
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { RequestStatusBadge } from './RequestStatusBadge';
import { ActionButtons } from './ActionButtons';
import { formatDate } from '@/utils/dateUtils';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

interface PriceChangeRequest {
  id: string;
  route_id: string;
  route_name?: string;
  user_id: string;
  current_price: number;
  new_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_profile?: UserProfile | null;
}

interface PriceChangeRequestCardProps {
  request: PriceChangeRequest;
  onApprove: (id: string, type: string) => void;
  onReject: (id: string, type: string) => void;
}

export const PriceChangeRequestCard = ({ request, onApprove, onReject }: PriceChangeRequestCardProps) => {
  // Calculate price percentage change
  const percentageChange = ((request.new_price - request.current_price) / request.current_price * 100).toFixed(1);
  
  return (
    <Card key={request.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium flex items-center">
            <DollarSign className="h-5 w-5 mr-1 text-primary" />
            Price Change Request
          </h3>
          <RequestStatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div><span className="font-medium">Route:</span> {request.route_name || 'Unknown Route'}</div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 text-red-800 rounded-md">
              R{request.current_price.toFixed(2)}
            </div>
            <span className="text-lg">→</span>
            <div className="p-2 bg-green-100 text-green-800 rounded-md">
              R{request.new_price.toFixed(2)}
            </div>
            <div className="text-xs bg-gray-100 p-1 rounded">
              {percentageChange}% change
            </div>
          </div>
          <div>
            <span className="font-medium">Submitted by:</span> {
              request.user_profile 
                ? `${request.user_profile.first_name || ''} ${request.user_profile.last_name || ''}`.trim() 
                : 'Unknown'
            }
          </div>
          <div><span className="font-medium">Submitted on:</span> {formatDate(request.created_at)}</div>
        </div>
        
        <ActionButtons 
          status={request.status} 
          onApprove={() => onApprove(request.id, 'price')}
          onReject={() => onReject(request.id, 'price')}
        />
      </CardContent>
    </Card>
  );
};
