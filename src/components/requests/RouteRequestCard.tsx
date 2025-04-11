
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RequestStatusBadge } from './RequestStatusBadge';
import { ActionButtons } from './ActionButtons';
import { formatDate } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

interface RouteRequest {
  id: string;
  start_point: string;
  end_point: string;
  description: string | null;
  transport_type: string;
  cost: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_profile?: UserProfile | null;
}

interface RouteRequestCardProps {
  request: RouteRequest;
  onApprove: (id: string, type: string) => void;
  onReject: (id: string, type: string) => void;
}

export const RouteRequestCard = ({ request, onApprove, onReject }: RouteRequestCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card key={request.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{request.start_point} → {request.end_point}</h3>
          <RequestStatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {request.description || 'No description provided'}
        </p>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Transport Type:</span> {request.transport_type}</div>
          <div><span className="font-medium">Cost:</span> R{(request.cost || 0).toFixed(2)}</div>
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
          onApprove={() => onApprove(request.id, 'route')}
          onReject={() => onReject(request.id, 'route')}
        />
        
        <Button 
          className="w-full mt-4" 
          onClick={() => navigate(`/requests/route/${request.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
