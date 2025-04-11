
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/utils/dateUtils';

interface HelpDocument {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

const HelpDocumentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<HelpDocument | null>(null);
  const [newDocument, setNewDocument] = useState({ title: '', content: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch help documents
  const { data: helpDocuments, isLoading } = useQuery({
    queryKey: ['helpDocuments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_documentation')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to load help documentation: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as HelpDocument[];
    },
  });

  // Create new document mutation
  const createDocumentMutation = useMutation({
    mutationFn: async (newDoc: { title: string; content: string }) => {
      const { data, error } = await supabase
        .from('help_documentation')
        .insert([{
          title: newDoc.title,
          content: newDoc.content,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpDocuments'] });
      toast({
        title: "Success",
        description: "Help document created successfully",
      });
      setIsAddDialogOpen(false);
      setNewDocument({ title: '', content: '' });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create document: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async (doc: HelpDocument) => {
      const { error } = await supabase
        .from('help_documentation')
        .update({
          title: doc.title,
          content: doc.content,
        })
        .eq('id', doc.id);
      
      if (error) throw error;
      return doc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpDocuments'] });
      toast({
        title: "Success",
        description: "Help document updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedDocument(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update document: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('help_documentation')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpDocuments'] });
      toast({
        title: "Success",
        description: "Help document deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedDocument(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete document: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Filter help documents based on search query
  const filteredDocuments = helpDocuments?.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDocument = () => {
    if (!newDocument.title || !newDocument.content) {
      toast({
        title: "Error",
        description: "Please provide both title and content for the document",
        variant: "destructive",
      });
      return;
    }

    createDocumentMutation.mutate(newDocument);
  };

  const handleUpdateDocument = () => {
    if (!selectedDocument) return;
    
    if (!selectedDocument.title || !selectedDocument.content) {
      toast({
        title: "Error",
        description: "Please provide both title and content for the document",
        variant: "destructive",
      });
      return;
    }

    updateDocumentMutation.mutate(selectedDocument);
  };

  const handleDeleteDocument = () => {
    if (!selectedDocument) return;
    deleteDocumentMutation.mutate(selectedDocument.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Help Documentation</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add New Document
        </Button>
      </div>

      <div className="flex items-center relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search documents..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredDocuments && filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{doc.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: {formatDate(doc.updated_at)}
                </p>
              </div>
              
              <p className="line-clamp-3">{doc.content}</p>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedDocument(doc);
                  setIsEditDialogOpen(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => {
                  setSelectedDocument(doc);
                  setIsDeleteDialogOpen(true);
                }}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-md">
          <p>No help documents found. {searchQuery && 'Try adjusting your search query.'}</p>
        </div>
      )}

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Help Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                value={newDocument.title}
                onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                placeholder="Enter document title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <Textarea 
                id="content" 
                rows={8}
                value={newDocument.content}
                onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                placeholder="Enter document content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateDocument} disabled={createDocumentMutation.isPending}>
              {createDocumentMutation.isPending ? "Creating..." : "Create Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Help Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
              <Input 
                id="edit-title" 
                value={selectedDocument?.title || ''}
                onChange={(e) => selectedDocument && setSelectedDocument({
                  ...selectedDocument,
                  title: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-content" className="text-sm font-medium">Content</label>
              <Textarea 
                id="edit-content" 
                rows={8}
                value={selectedDocument?.content || ''}
                onChange={(e) => selectedDocument && setSelectedDocument({
                  ...selectedDocument,
                  content: e.target.value
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateDocument} disabled={updateDocumentMutation.isPending}>
              {updateDocumentMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Help Document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{selectedDocument?.title}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDocument} disabled={deleteDocumentMutation.isPending}>
              {deleteDocumentMutation.isPending ? "Deleting..." : "Delete Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpDocumentation;
