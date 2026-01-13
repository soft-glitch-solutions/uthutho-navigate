import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import WYSIWYGEditor from '@/components/admin/editor/WYSIWYGEditor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const BlogsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createBlog = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
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
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast({ title: "Success", description: "Blog post created successfully" });
      setTitle('');
      setContent('');
      setTags('');
      setStatus('draft');
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to create blog post", 
        variant: "destructive" 
      });
    },
  });

  const updateBlogStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string, newStatus: string }) => {
      const { data, error } = await supabase
        .from('blogs')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast({ title: "Success", description: "Blog status updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to update blog status", 
        variant: "destructive" 
      });
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="max-w-2xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Content</Label>
            <div className="border rounded-md">
              <WYSIWYGEditor content={content} onChange={setContent} />
            </div>
          </div>

          <div className="space-y-2 max-w-2xl">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tech, news, updates, tutorial"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setTitle('');
                setContent('');
                setTags('');
              }}
            >
              Clear
            </Button>
            <Button 
              onClick={() => createBlog.mutate()}
              disabled={createBlog.isPending}
            >
              {createBlog.isPending ? "Saving..." : "Save as Draft"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
        {isLoading ? (
          <div className="text-center py-8">Loading blog posts...</div>
        ) : blogs?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No blog posts yet. Create your first one above!</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs?.map((blog) => (
              <Card key={blog.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="prose prose-sm max-w-none mb-4 flex-1 line-clamp-3" 
                       dangerouslySetInnerHTML={{ __html: blog.content }} />
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag: string) => (
                        <span 
                          key={tag} 
                          className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Status: <span className={`font-medium ${blog.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                          {blog.status}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {blog.status === 'draft' ? (
                        <Button 
                          size="sm"
                          onClick={() => updateBlogStatus.mutate({ 
                            id: blog.id, 
                            newStatus: 'published' 
                          })}
                          disabled={updateBlogStatus.isPending}
                        >
                          {updateBlogStatus.isPending ? "Publishing..." : "Publish"}
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => updateBlogStatus.mutate({ 
                            id: blog.id, 
                            newStatus: 'draft' 
                          })}
                          disabled={updateBlogStatus.isPending}
                        >
                          {updateBlogStatus.isPending ? "Unpublishing..." : "Unpublish"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;