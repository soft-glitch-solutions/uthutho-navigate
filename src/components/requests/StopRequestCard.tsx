
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RequestStatusBadge } from './RequestStatusBadge';
import { ActionButtons } from './ActionButtons';
import { formatDate } from '@/utils/dateUtils';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
}

interface StopRequest {
  id: string;
  name: string;
  description: string | null;
  route_id: string;
  route_name?: string;
  latitude: number;
  longitude: number;
  cost: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_profile?: UserProfile | null;
}

interface StopRequestCardProps {
  request: StopRequest;
  onApprove: (id: string, type: string) => void;
  onReject: (id: string, type: string) => void;
}

export const StopRequestCard = ({ request, onApprove, onReject }: StopRequestCardProps) => {
  return (
    <Card key={request.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{request.name}</h3>
          <RequestStatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {request.description || 'No description provided'}
        </p>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Route:</span> {request.route_name || 'Unknown Route'}</div>
          <div><span className="font-medium">Coordinates:</span> {request.latitude}, {request.longitude}</div>
          <div><span className="font-medium">Cost:</span> {request.cost ? `R${request.cost}` : 'Free'}</div>
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
          onApprove={() => onApprove(request.id, 'stop')}
          onReject={() => onReject(request.id, 'stop')}
        />
      </CardContent>
    </Card>
  );
};
