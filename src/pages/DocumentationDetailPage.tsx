
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WYSIWYGEditor from '@/components/admin/editor/WYSIWYGEditor';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const DocumentationDetailPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { docId } = useParams();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');

  const { data: doc, isLoading } = useQuery({
    queryKey: ['documentation', docId],
    queryFn: async () => {
      if (!docId) return null;
      
      const { data, error } = await supabase
        .from('help_documentation')
        .select('*')
        .eq('id', docId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!docId
  });

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setContent(doc.content);
      setHtmlContent(doc.content);
      setTags(doc.tags ? doc.tags.join(', ') : '');
      setStatus(doc.status);
    }
  }, [doc]);

  const updateDoc = useMutation({
    mutationFn: async () => {
      if (!docId) return null;
      
      const { data, error } = await supabase
        .from('help_documentation')
        .update({
          title,
          content: htmlContent, // Use the HTML content from either the WYSIWYG or direct HTML edit
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          status,
          updated_at: new Date(),
        })
        .eq('id', docId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] });
      queryClient.invalidateQueries({ queryKey: ['documentation', docId] });
      toast({ title: "Success", description: "Documentation updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to update documentation: " + error.message, 
        variant: "destructive" 
      });
    }
  });

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHtmlContent(newContent);
  };

  const handleHtmlEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard/documentation')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documentation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter documentation title"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Content</Label>
            <Tabs defaultValue="wysiwyg">
              <TabsList>
                <TabsTrigger value="wysiwyg">Visual Editor</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              <TabsContent value="wysiwyg">
                <WYSIWYGEditor content={content} onChange={handleContentChange} />
              </TabsContent>
              <TabsContent value="html">
                <Textarea 
                  value={htmlContent} 
                  onChange={handleHtmlEdit} 
                  className="h-64 font-mono"
                  placeholder="Enter HTML content"
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="getting-started, api, guide"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            onClick={() => updateDoc.mutate()} 
            disabled={updateDoc.isPending}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentationDetailPage;
