
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, ChevronRight, Search, Tag, BookOpen } from 'lucide-react';

interface Documentation {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  is_published?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

const DocsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const { data: docs, isLoading } = useQuery({
    queryKey: ['public-documentation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documentation')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Documentation[];
    },
  });

  const faqs: FAQ[] = [
    {
      question: 'How do I find the nearest transport hub?',
      answer: 'You can use our mobile app to find the nearest transport hub based on your current location. The app will show you all nearby hubs and the routes that pass through them.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept cash, credit/debit cards, and mobile payments through our app. You can also purchase prepaid travel cards at any of our hub offices.'
    },
    {
      question: 'What are the operating hours?',
      answer: 'Most routes operate from 5:00 AM to 10:00 PM on weekdays, and 6:00 AM to 9:00 PM on weekends. However, specific routes may have different schedules. Check the route details in our app for accurate information.'
    },
    {
      question: 'How do I report a lost item?',
      answer: 'If you\'ve lost an item on one of our vehicles, please report it through our mobile app or contact our customer service. Provide details about the route, time, and a description of the item.'
    },
    {
      question: 'Are there discounts for students and seniors?',
      answer: 'Yes, we offer discounted rates for students, seniors, and disabled passengers. You need to apply for a special travel card with valid identification to access these discounts.'
    }
  ];

  // Extract all unique tags from docs
  const allTags = React.useMemo(() => {
    if (!docs) return [];
    
    const tagsSet = new Set<string>();
    docs.forEach(doc => {
      if (doc.tags && Array.isArray(doc.tags)) {
        doc.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    
    return Array.from(tagsSet);
  }, [docs]);

  // Filter docs based on search term and active tag
  const filteredDocs = React.useMemo(() => {
    if (!docs) return [];
    
    return docs.filter(doc => {
      const matchesSearch = 
        !searchTerm || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.excerpt && doc.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = 
        !activeTag || 
        (doc.tags && Array.isArray(doc.tags) && doc.tags.includes(activeTag));
      
      return matchesSearch && matchesTag;
    });
  }, [docs, searchTerm, activeTag]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">Documentation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Explore our comprehensive guides and documentation to help you navigate our public transport system efficiently.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search documentation..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge 
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
            {activeTag && (
              <Badge 
                variant="outline"
                className="cursor-pointer"
                onClick={() => setActiveTag(null)}
              >
                Clear filters
              </Badge>
            )}
          </div>
        </div>

        {/* Documentation Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="relative h-64 border border-blue-100 dark:border-gray-700">
                <CardHeader>
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredDocs && filteredDocs.length > 0 ? (
            filteredDocs.map(doc => (
              <Link key={doc.id} to={`/docs/${doc.id}`}>
                <Card className="relative h-64 border border-blue-100 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500 transition-all cursor-pointer hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2 mb-1">
                      <Calendar size={12} />
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                    <CardTitle className="text-blue-600 dark:text-blue-400">{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {doc.excerpt || doc.content.substring(0, 120).replace(/<[^>]*>/g, '') + '...'}
                    </p>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.tags && Array.isArray(doc.tags) && doc.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <ChevronRight className="absolute bottom-4 right-4 h-5 w-5 text-blue-500" />
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">No documentation found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTag ? 
                  `No documents found with the tag "${activeTag}"` : 
                  searchTerm ? 
                    `No results for "${searchTerm}"` : 
                    "Documentation will be added soon"}
              </p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
