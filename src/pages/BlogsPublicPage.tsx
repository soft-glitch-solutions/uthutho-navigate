
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';

const BlogsPublicPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: blogs } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Filter blogs based on search query
  const filteredBlogs = blogs?.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (blog.tags && blog.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-blue-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Uthutho Blog</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Stay updated with the latest news, features, and insights about Uthutho and public transport in South Africa
          </p>
          
          {/* Search bar */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-gray-900 text-white rounded-full border-0 shadow focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {searchQuery && (
          <h2 className="text-2xl font-semibold mb-6 text-white">
            {filteredBlogs?.length || 0} results for "{searchQuery}"
          </h2>
        )}

        <div className="grid gap-8">
          {filteredBlogs?.map((blog) => (
            <Card key={blog.id} className="bg-gray-900 border-gray-700 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/3 p-6">
                  <CardHeader className="p-0 pb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.tags && blog.tags.map((tag: string) => (
                        <span key={tag} className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <CardTitle className="text-2xl text-white">
                      <Link to={`/blog/${blog.id}`} className="text-white hover:text-blue-300 transition-colors">
                        {blog.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center text-gray-400 text-sm mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(blog.published_at || blog.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="prose prose-invert max-w-none prose-sm line-clamp-3 mb-4">
                      <div dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 300) + '...' }} />
                    </div>
                    <Link 
                      to={`/blog/${blog.id}`} 
                      className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                    >
                      Read more
                    </Link>
                  </CardContent>
                </div>
                {/* Blog image placeholder */}
                <div className="md:w-1/3 bg-gray-800 h-56 md:h-auto">
                  <div className="w-full h-full bg-gradient-to-r from-blue-900/50 to-blue-700/50 flex items-center justify-center">
                    <span className="text-4xl opacity-30">Uthutho</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredBlogs?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2 text-white">No blogs found</h3>
              <p className="text-gray-400">
                {searchQuery ? 'Try using different search terms' : 'Check back later for new posts'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Newsletter Section */}
      <section className="bg-blue-900 py-12 text-white">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h2>
          <p className="mb-6">Stay updated with our latest news and updates directly to your inbox</p>
          <div className="flex gap-2">
            <Input placeholder="Your email address" className="bg-blue-800/50 border-blue-700 text-white placeholder:text-white/50" />
            <button className="bg-white text-blue-900 px-4 py-2 rounded-md font-medium hover:bg-white/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogsPublicPage;
