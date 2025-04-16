
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import WYSIWYGEditor from '@/components/admin/editor/WYSIWYGEditor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const DocumentationPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');

  const { data: docs, isLoading } = useQuery({
    queryKey: ['documentation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_documentation')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createDoc = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('help_documentation')
        .insert([
          {
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()),
            status,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] });
      toast({ title: "Success", description: "Documentation created successfully" });
      setTitle('');
      setContent('');
      setTags('');
      setStatus('draft');
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to create documentation", 
        variant: "destructive" 
      });
    },
  });

  const updateDocStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string, newStatus: string }) => {
      const { data, error } = await supabase
        .from('help_documentation')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] });
      toast({ title: "Success", description: "Documentation status updated successfully" });
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Documentation</CardTitle>
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
            <WYSIWYGEditor content={content} onChange={setContent} />
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

          <div className="flex justify-end">
            <Button onClick={() => createDoc.mutate()}>
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {docs?.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: doc.content }} />
              {doc.tags && (
                <div className="flex gap-2 mb-4">
                  {doc.tags.map((tag: string) => (
                    <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Status: {doc.status}
                </span>
                {doc.status === 'draft' && (
                  <Button 
                    onClick={() => updateDocStatus.mutate({ 
                      id: doc.id, 
                      newStatus: 'published' 
                    })}
                  >
                    Publish
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentationPage;
