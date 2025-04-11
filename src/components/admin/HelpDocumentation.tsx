
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus, Save } from 'lucide-react';

interface HelpDocument {
  id: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

const HelpDocumentation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<HelpDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch help documentation
  const { data: helpDocs, isLoading } = useQuery({
    queryKey: ['help_documentation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_documentation')
        .select('*');
      
      if (error) throw error;
      return data as HelpDocument[];
    },
  });

  // Create help document mutation
  const createHelpDoc = useMutation({
    mutationFn: async (newDoc: Omit<HelpDocument, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('help_documentation')
        .insert([{
          title: newDoc.title,
          content: newDoc.content,
          created_by: user.user?.id
        }]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_documentation'] });
      setIsCreating(false);
      setCurrentDocument(null);
      toast({
        title: "Success",
        description: "Help document has been created successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create help document: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update help document mutation
  const updateHelpDoc = useMutation({
    mutationFn: async (updatedDoc: HelpDocument) => {
      const { error } = await supabase
        .from('help_documentation')
        .update({
          title: updatedDoc.title,
          content: updatedDoc.content
        })
        .eq('id', updatedDoc.id);
      
      if (error) throw error;
      return updatedDoc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_documentation'] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Help document has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update help document: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete help document mutation
  const deleteHelpDoc = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('help_documentation')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['help_documentation'] });
      toast({
        title: "Success",
        description: "Help document has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete help document: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Filter docs based on search term
  const filteredDocs = helpDocs?.filter(
    doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDocument) return;

    if (isCreating) {
      createHelpDoc.mutate({
        title: currentDocument.title,
        content: currentDocument.content,
      });
    } else if (isEditing) {
      updateHelpDoc.mutate(currentDocument);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setCurrentDocument({
      id: '',
      title: '',
      content: ''
    });
  };

  const handleEdit = (doc: HelpDocument) => {
    setCurrentDocument(doc);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this help document?")) {
      deleteHelpDoc.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setCurrentDocument(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Help Documentation</h1>
        {!isEditing && !isCreating && (
          <Button onClick={handleCreateNew} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        )}
      </div>

      {(isEditing || isCreating) ? (
        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-4 rounded-lg border border-border">
          <h2 className="text-xl font-semibold">
            {isCreating ? "Create New Help Document" : "Edit Help Document"}
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <Input
              id="title"
              value={currentDocument?.title || ''}
              onChange={(e) => setCurrentDocument({ ...currentDocument!, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="content">
              Content
            </label>
            <Textarea
              id="content"
              value={currentDocument?.content || ''}
              onChange={(e) => setCurrentDocument({ ...currentDocument!, content: e.target.value })}
              rows={10}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              {isCreating ? "Create" : "Save Changes"}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search help documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredDocs?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No help documentation found.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDocs?.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="prose max-w-none mb-4 line-clamp-3">
                      {doc.content}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                        className="flex items-center"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="flex items-center"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HelpDocumentation;
