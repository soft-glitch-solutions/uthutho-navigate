
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface RequestStatusBadgeProps {
  status: string | null;
}

export const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <Badge className="bg-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle className="w-4 h-4 mr-1" /> Rejected</Badge>;
    case 'pending':
    default:
      return <Badge variant="outline" className="border-orange-400 text-orange-400"><Clock className="w-4 h-4 mr-1" /> Pending</Badge>;
  }
};
