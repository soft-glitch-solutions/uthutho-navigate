
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const DocsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

  const { data: docs } = useQuery({
    queryKey: ['public-documentation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_documentation')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Group documentation by tags
  const groupedDocs = docs?.reduce((acc, doc) => {
    if (doc.tags && doc.tags.length > 0) {
      doc.tags.forEach((tag: string) => {
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(doc);
      });
    } else {
      if (!acc['Uncategorized']) acc['Uncategorized'] = [];
      acc['Uncategorized'].push(doc);
    }
    return acc;
  }, {} as Record<string, any[]>) || {};

  // Filter documentation based on search query
  const filteredDocs = docs?.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.tags && doc.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => 
      prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
    );
  };

  // Frequently asked questions - hardcoded for now, but you could store these in the database
  const faqs = [
    { 
      id: '1', 
      question: 'What is Uthutho?', 
      answer: 'Uthutho is a smart public transport companion for South Africa, providing real-time updates on routes, schedules, and fares for various transport options.' 
    },
    { 
      id: '2', 
      question: 'How do I use the app?', 
      answer: 'Download the app from the App Store or Google Play, or use our data-free web portal. Create an account to access all features.' 
    },
    { 
      id: '3', 
      question: 'Is Uthutho available in my city?', 
      answer: 'Uthutho is expanding across South Africa. Check the app to see if your city is covered, or submit a request for your area.' 
    },
    { 
      id: '4', 
      question: 'How do I report an issue?', 
      answer: 'You can report issues through the app by submitting a support ticket, or by contacting our support team at support@uthutho.com.' 
    },
    { 
      id: '5', 
      question: 'How accurate is the information?', 
      answer: 'We strive for maximum accuracy through a combination of official data, real-time updates from transport providers, and crowd-sourced information from users.' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Find answers to your questions and learn how to get the most out of Uthutho's features
          </p>
          
          {/* Search bar */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white text-gray-800 rounded-full border-0 shadow focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Documentation</TabsTrigger>
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {searchQuery ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
                {filteredDocs && filteredDocs.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {filteredDocs.map((doc) => (
                      <Card key={doc.id}>
                        <CardHeader>
                          <CardTitle>{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose dark:prose-invert max-w-none prose-sm mb-4">
                            <div dangerouslySetInnerHTML={{ __html: doc.content.substring(0, 150) + '...' }} />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {doc.tags && doc.tags.map((tag: string) => (
                              <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Link 
                            to={`/docs/${doc.id}`} 
                            className="text-primary hover:underline"
                          >
                            Read more
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">No results found for "{searchQuery}"</p>
                )}
              </>
            ) : (
              Object.entries(groupedDocs).map(([category, categoryDocs]) => (
                <div key={category} className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-2">{category}</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {categoryDocs.map((doc) => (
                      <Card key={doc.id}>
                        <CardHeader>
                          <CardTitle>{doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose dark:prose-invert max-w-none prose-sm mb-4">
                            <div dangerouslySetInnerHTML={{ __html: doc.content.substring(0, 150) + '...' }} />
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {doc.tags && doc.tags.map((tag: string) => (
                              <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Link 
                            to={`/docs/${doc.id}`} 
                            className="text-primary hover:underline"
                          >
                            Read more
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="faq">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="p-0">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-6 rounded-none h-auto" 
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="text-lg font-medium">{faq.question}</span>
                      {expandedFaqs.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                    {expandedFaqs.includes(faq.id) && (
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Call to Action */}
      <section className="bg-secondary py-12 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="mb-6">Contact our support team or submit a request for help</p>
          <Button asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default DocsPage;
