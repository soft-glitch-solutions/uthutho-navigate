
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  Search, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Tag, 
  File, 
  FileText, 
  Filter,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentManagementProps {
  type: 'documentation' | 'blog';
}

interface Document {
  id: string;
  title: string;
  content: string;
  status: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  published_at?: string;
  author_id?: string;
}

const DocumentManagement: React.FC<DocumentManagementProps> = ({ type }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Get the correct table name based on the type
  const tableName = type === 'documentation' ? 'help_documentation' : 'blogs';
  
  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: [type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    }
  });
  
  // Delete document mutation
  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: [type] });
      setDeleteDialogOpen(false);
      
      // Log the action
      supabase.from('activity_logs').insert([{
        action: `delete_${type}`,
        entity_type: type,
        entity_id: id,
        details: { id },
        status: 'success'
      }]);
      
      toast({
        title: "Deleted",
        description: `${type === 'documentation' ? 'Document' : 'Blog post'} has been deleted.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle document actions
  const handleView = (id: string) => {
    navigate(`/admin/dashboard/${type === 'documentation' ? 'documentation' : 'blogs'}/${id}`);
  };
  
  const handleEdit = (id: string) => {
    navigate(`/admin/dashboard/${type === 'documentation' ? 'documentation' : 'blogs'}/${id}?edit=true`);
  };
  
  const handleDelete = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };
  
  const handleCreate = () => {
    navigate(`/admin/dashboard/${type === 'documentation' ? 'documentation' : 'blogs'}/new`);
  };
  
  // Filter documents based on search term and status
  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {type === 'documentation' ? 'Documentation' : 'Blog Posts'} Management
        </h2>
        <p className="text-muted-foreground">
          {type === 'documentation' ? 'Create and manage help documentation' : 'Manage blog content for your users'}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder={`Search ${type === 'documentation' ? 'documents' : 'blogs'}...`}
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('draft')}>Draft</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('published')}>Published</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('archived')}>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleCreate} className="whitespace-nowrap">
            <PlusCircle className="h-4 w-4 mr-2" />
            {type === 'documentation' ? 'New Document' : 'New Blog'}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded-md mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 bg-muted rounded-md"></div>
              </CardContent>
              <CardFooter>
                <div className="h-8 bg-muted rounded-md w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredDocuments && filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{doc.title}</CardTitle>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    doc.status === 'published' ? 'bg-green-100 text-green-800' :
                    doc.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status}
                  </div>
                </div>
                <CardDescription>{formatDate(doc.updated_at)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="line-clamp-3 text-sm text-muted-foreground mb-2">
                  {doc.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                </div>
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {doc.tags.map((tag, index) => (
                      <div key={index} className="flex items-center bg-secondary/30 px-2 py-0.5 rounded-full text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-1 border-t">
                <Button variant="ghost" size="sm" onClick={() => handleView(doc.id)}>
                  {type === 'documentation' ? <FileText className="h-4 w-4 mr-2" /> : <File className="h-4 w-4 mr-2" />}
                  View
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(doc.id)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(doc)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-secondary mb-4">
            {type === 'documentation' ? 
              <FileText className="h-8 w-8 text-muted-foreground" /> : 
              <File className="h-8 w-8 text-muted-foreground" />
            }
          </div>
          <h3 className="text-xl font-medium mb-1">No {type === 'documentation' ? 'documents' : 'blog posts'} found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 
              `No matching results for "${searchTerm}"` : 
              `You haven't created any ${type === 'documentation' ? 'documents' : 'blog posts'} yet`
            }
          </p>
          <Button onClick={handleCreate}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create {type === 'documentation' ? 'Document' : 'Blog Post'}
          </Button>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => documentToDelete && deleteDocument.mutate(documentToDelete.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement;
