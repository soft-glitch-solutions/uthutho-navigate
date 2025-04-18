
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const BlogDetailPublicPage = () => {
  const { blogId } = useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['public-blog', blogId],
    queryFn: async () => {
      if (!blogId) return null;
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*, profiles(first_name, last_name)')
        .eq('id', blogId)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!blogId
  });

  // Related blogs by tag
  const { data: relatedBlogs } = useQuery({
    queryKey: ['related-blogs', blog?.tags],
    queryFn: async () => {
      if (!blog || !blog.tags || blog.tags.length === 0) return [];
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .neq('id', blogId)
        .containsAny('tags', blog.tags)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!blog && !!blog.tags && blog.tags.length > 0
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
        <p className="mb-4">The blog post you're looking for may have been removed or is unavailable.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const authorName = blog.profiles ? 
    `${blog.profiles.first_name} ${blog.profiles.last_name}`.trim() : 
    'Uthutho Team';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
          
          <article>
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                <span>{authorName}</span>
              </div>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Blog image placeholder */}
            <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-8">
              <span className="text-4xl opacity-30">Uthutho</span>
            </div>
            
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Share */}
          <div className="mt-12">
            <Separator />
            <div className="py-6">
              <h3 className="font-medium mb-2">Share this article</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="bg-[#1877F2] text-white border-none hover:bg-[#1877F2]/90">
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="bg-[#1DA1F2] text-white border-none hover:bg-[#1DA1F2]/90">
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="bg-[#0A66C2] text-white border-none hover:bg-[#0A66C2]/90">
                  LinkedIn
                </Button>
              </div>
            </div>
            <Separator />
          </div>

          {/* Related posts */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedBlogs.map((relatedBlog) => (
                  <Card key={relatedBlog.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Link to={`/blog/${relatedBlog.id}`} className="hover:text-primary transition-colors">
                          {relatedBlog.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none prose-sm line-clamp-3 mb-4">
                        <div dangerouslySetInnerHTML={{ __html: relatedBlog.content.substring(0, 100) + '...' }} />
                      </div>
                      <Link 
                        to={`/blog/${relatedBlog.id}`} 
                        className="text-primary hover:underline"
                      >
                        Read more
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPublicPage;
