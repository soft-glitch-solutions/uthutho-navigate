
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

interface HubRequest {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string;
  transport_type: string;
  status: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_profile?: UserProfile | null;
}

interface HubRequestCardProps {
  request: HubRequest;
  onApprove: (id: string, type: string) => void;
  onReject: (id: string, type: string) => void;
}

export const HubRequestCard = ({ request, onApprove, onReject }: HubRequestCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card key={request.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-medium">{request.name}</h3>
          <RequestStatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {request.description || 'No description provided'}
        </p>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Address:</span> {request.address}</div>
          <div><span className="font-medium">Transport Type:</span> {request.transport_type}</div>
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
          onApprove={() => onApprove(request.id, 'hub')}
          onReject={() => onReject(request.id, 'hub')}
        />
        
        <Button 
          className="w-full mt-4" 
          onClick={() => navigate(`/requests/hub/${request.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
