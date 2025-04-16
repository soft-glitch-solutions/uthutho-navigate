
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import { Loader2, Plus } from 'lucide-react';
import { CreateTicketDialog } from './support/CreateTicketDialog';
import { useToast } from '@/components/ui/use-toast';
import { TicketDetails } from './support/TicketDetails';

export const SupportTickets = () => {
  const [selectedTicket, setSelectedTicket] = React.useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const { toast } = useToast();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          creator:created_by(first_name, last_name),
          assignee:assigned_to(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500 text-white';
      case 'in_progress':
        return 'bg-yellow-500 text-white';
      case 'resolved':
        return 'bg-green-500 text-white';
      case 'closed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid gap-4">
        {tickets?.map((ticket) => (
          <Card 
            key={ticket.id} 
            className="p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => setSelectedTicket(ticket.id)}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold">{ticket.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ticket.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <div>
                Created by: {ticket.creator?.first_name} {ticket.creator?.last_name}
              </div>
              <div>
                {ticket.assignee ? (
                  `Assigned to: ${ticket.assignee.first_name} ${ticket.assignee.last_name}`
                ) : (
                  'Unassigned'
                )}
              </div>
              <div>{formatDate(ticket.created_at)}</div>
            </div>
          </Card>
        ))}

        {tickets?.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground">
            No tickets found
          </Card>
        )}
      </div>

      <CreateTicketDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />

      {selectedTicket && (
        <TicketDetails 
          ticketId={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </div>
  );
};
