import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WYSIWYGEditor from '@/components/admin/editor/WYSIWYGEditor';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const BlogDetailPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { blogId } = useParams();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blogs', blogId],
    queryFn: async () => {
      if (!blogId) return null;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!blogId
  });

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setHtmlContent(blog.content);
      setTags(blog.tags ? blog.tags.join(', ') : '');
      setStatus(blog.status);
    }
  }, [blog]);

  const updateBlog = useMutation({
    mutationFn: async () => {
      if (!blogId) return null;
      
      const updateData: any = {
        title,
        content: htmlContent,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status,
        updated_at: new Date(),
      };

      if (status === 'published' && blog?.status !== 'published') {
        updateData.published_at = new Date();
      }
      
      const { data, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', blogId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs', blogId] });
      toast({ title: "Success", description: "Blog post updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to update blog post: " + error.message, 
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
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/dashboard/blogs')} 
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Button>
        
        {blog && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Status: 
              <span className={`ml-2 font-medium ${blog.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                {blog.status}
              </span>
            </span>
            <span className="text-sm text-muted-foreground">
              • Created: {new Date(blog.created_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-2xl">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Content</Label>
            <Tabs defaultValue="wysiwyg">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="wysiwyg">Visual Editor</TabsTrigger>
                <TabsTrigger value="html">HTML Editor</TabsTrigger>
              </TabsList>
              <div className="mt-4 border rounded-md">
                <TabsContent value="wysiwyg" className="m-0">
                  <WYSIWYGEditor content={content} onChange={handleContentChange} />
                </TabsContent>
                <TabsContent value="html" className="m-0">
                  <div className="p-4">
                    <Textarea 
                      value={htmlContent} 
                      onChange={handleHtmlEdit} 
                      className="h-96 font-mono text-sm"
                      placeholder="Enter HTML content"
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="space-y-2 max-w-2xl">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tech, news, updates, tutorial"
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Separate tags with commas (e.g., "react, tutorial, web-development")
            </p>
          </div>

          <div className="space-y-2 max-w-xs">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                    Draft
                  </span>
                </SelectItem>
                <SelectItem value="published">
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Published
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/dashboard/blogs')}
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                if (blog) {
                  setTitle(blog.title);
                  setContent(blog.content);
                  setHtmlContent(blog.content);
                  setTags(blog.tags ? blog.tags.join(', ') : '');
                  setStatus(blog.status);
                }
              }}
            >
              Reset Changes
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => setStatus('draft')}
              className={status === 'draft' ? 'bg-primary/10' : ''}
            >
              Save as Draft
            </Button>
            <Button 
              onClick={() => updateBlog.mutate()} 
              disabled={updateBlog.isPending || (!title.trim() || !htmlContent.trim())}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              {updateBlog.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Preview Section */}
      {blog && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold mb-4">{title || 'Untitled Blog Post'}</h1>
              <div 
                className="prose-lg"
                dangerouslySetInnerHTML={{ __html: htmlContent || '<p class="text-muted-foreground">Content will appear here...</p>' }} 
              />
            </div>
            
            {tags && (
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.split(',').map((tag, index) => (
                  tag.trim() && (
                    <span 
                      key={index} 
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  )
                ))}
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>
                  Status: <span className={`font-medium ${status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                    {status}
                  </span>
                </span>
                <span>
                  {status === 'published' ? 'Will be published immediately' : 'Will remain as draft'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogDetailPage;