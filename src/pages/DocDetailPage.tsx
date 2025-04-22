
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar } from 'lucide-react';

const DocDetailPage = () => {
  const { docId } = useParams();

  const { data: doc, isLoading } = useQuery({
    queryKey: ['public-documentation', docId],
    queryFn: async () => {
      if (!docId) return null;
      
      const { data, error } = await supabase
        .from('help_documentation')
        .select('*')
        .eq('id', docId)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!docId
  });

  // Related docs by tag
  const { data: relatedDocs } = useQuery({
    queryKey: ['related-docs', doc?.tags],
    queryFn: async () => {
      if (!doc || !doc.tags || doc.tags.length === 0) return [];
      
      const { data, error } = await supabase
        .from('help_documentation')
        .select('*')
        .eq('status', 'published')
        .neq('id', docId)
        .filter('tags', 'cs', `{${doc.tags.join(',')}}`)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!doc && !!doc.tags && doc.tags.length > 0
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full bg-gray-900 border-gray-700">
          <CardContent className="pt-6">
            <div className="h-8 w-1/3 bg-gray-800 animate-pulse rounded mb-4"></div>
            <div className="h-64 bg-gray-800 animate-pulse rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="container mx-auto p-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Document not found</h2>
        <p className="mb-4">The document you're looking for may have been removed or is unavailable.</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to="/docs">Back to Documentation</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-4 text-blue-400 hover:text-blue-300">
            <Link to="/docs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documentation
            </Link>
          </Button>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-3xl text-white">{doc.title}</CardTitle>
              <div className="flex items-center text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {new Date(doc.updated_at).toLocaleDateString()}
                </span>
              </div>
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {doc.tags.map((tag: string) => (
                    <span key={tag} className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-invert prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: doc.content }}
              />
            </CardContent>
          </Card>

          {relatedDocs && relatedDocs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4 text-white">Related Documentation</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedDocs.map((relatedDoc) => (
                  <Card key={relatedDoc.id} className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">{relatedDoc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose-sm prose-invert max-w-none line-clamp-3 mb-4">
                        <div dangerouslySetInnerHTML={{ __html: relatedDoc.content.substring(0, 100) + '...' }} />
                      </div>
                      <Link 
                        to={`/docs/${relatedDoc.id}`} 
                        className="text-blue-400 hover:text-blue-300 hover:underline"
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

export default DocDetailPage;
