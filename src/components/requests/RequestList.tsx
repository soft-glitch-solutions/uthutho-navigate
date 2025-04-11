
import React from 'react';
import { HubRequestCard } from './HubRequestCard';
import { RouteRequestCard } from './RouteRequestCard';
import { StopRequestCard } from './StopRequestCard';
import { PriceChangeRequestCard } from './PriceChangeRequestCard';

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

interface RequestListProps {
  type: 'hub' | 'route' | 'stop' | 'price';
  requests: HubRequest[] | RouteRequest[] | StopRequest[] | PriceChangeRequest[];
  onApprove: (id: string, type: string) => void;
  onReject: (id: string, type: string) => void;
}

export const RequestList = ({ type, requests, onApprove, onReject }: RequestListProps) => {
  if (requests.length === 0) {
    return <p className="text-center col-span-full py-8">No {type} requests found</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {type === 'hub' && (requests as HubRequest[]).map((request) => (
        <HubRequestCard 
          key={request.id} 
          request={request} 
          onApprove={onApprove} 
          onReject={onReject} 
        />
      ))}
      
      {type === 'route' && (requests as RouteRequest[]).map((request) => (
        <RouteRequestCard 
          key={request.id} 
          request={request} 
          onApprove={onApprove} 
          onReject={onReject} 
        />
      ))}
      
      {type === 'stop' && (requests as StopRequest[]).map((request) => (
        <StopRequestCard 
          key={request.id} 
          request={request} 
          onApprove={onApprove} 
          onReject={onReject} 
        />
      ))}
      
      {type === 'price' && (requests as PriceChangeRequest[]).map((request) => (
        <PriceChangeRequestCard 
          key={request.id} 
          request={request} 
          onApprove={onApprove} 
          onReject={onReject} 
        />
      ))}
    </div>
  );
};
