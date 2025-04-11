
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface ActionButtonsProps {
  status: string | null;
  onApprove: () => void;
  onReject: () => void;
}

export const ActionButtons = ({ status, onApprove, onReject }: ActionButtonsProps) => {
  if (status !== 'pending') return null;
  
  return (
    <div className="flex space-x-2 mt-4">
      <Button 
        variant="outline" 
        className="flex-1"
        onClick={onApprove}
      >
        <CheckCircle className="h-4 w-4 mr-1" /> Approve
      </Button>
      <Button 
        variant="outline" 
        className="flex-1"
        onClick={onReject}
      >
        <XCircle className="h-4 w-4 mr-1" /> Reject
      </Button>
    </div>
  );
};
