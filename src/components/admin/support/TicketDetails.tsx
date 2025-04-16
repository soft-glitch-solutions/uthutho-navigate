
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/utils/dateUtils';
import { Loader2 } from 'lucide-react';

interface TicketDetailsProps {
  ticketId: string;
  onClose: () => void;
}

export const TicketDetails = ({ ticketId, onClose }: TicketDetailsProps) => {
  const [newComment, setNewComment] = React.useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          creator:created_by(first_name, last_name),
          assignee:assigned_to(first_name, last_name)
        `)
        .eq('id', ticketId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['ticket-comments', ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_comments')
        .select(`
          *,
          user:user_id(first_name, last_name)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });

      toast({
        title: "Success",
        description: "Ticket status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('ticket_comments')
        .insert([{
          ticket_id: ticketId,
          content: newComment
        }]);

      if (error) throw error;

      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['ticket-comments', ticketId] });

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  if (ticketLoading || commentsLoading) {
    return (
      <Sheet open={true} onOpenChange={onClose}>
        <SheetContent className="w-[400px] sm:w-[540px] md:w-[700px]">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] md:w-[700px]">
        <SheetHeader>
          <SheetTitle>{ticket?.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">
                  Created by {ticket?.creator?.first_name} {ticket?.creator?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(ticket?.created_at)}
                </p>
              </div>
              <div className="space-y-2">
                <Select defaultValue={ticket?.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Badge>{ticket?.priority}</Badge>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p>{ticket?.description}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Comments</h3>
            <div className="space-y-4">
              {comments?.map((comment) => (
                <div key={comment.id} className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">
                      {comment.user?.first_name} {comment.user?.last_name}
                    </span>
                    <span className="text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}

              {comments?.length === 0 && (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
