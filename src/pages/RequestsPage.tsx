import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  first_name: string;
  last_name: string;
  points: number;
  avatar_url: string | null;
  selected_title: string | null;
}

interface HubRequest {
  id: string;
  user_id: string;
  hub_name: string;
  location: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles: UserProfile;
}

interface RouteRequest {
  id: string;
  user_id: string;
  start_location: string;
  end_location: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles: UserProfile;
}

const RequestsPage = () => {
  const [hubRequests, setHubRequests] = useState<HubRequest[]>([]);
  const [routeRequests, setRouteRequests] = useState<RouteRequest[]>([]);
  const [hubRequestsLoading, setHubRequestsLoading] = useState(true);
  const [routeRequestsLoading, setRouteRequestsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHubRequests();
    fetchRouteRequests();
  }, []);

  const fetchHubRequests = async () => {
    try {
      setHubRequestsLoading(true);
      const { data, error } = await supabase
        .from('hub_requests')
        .select(`
          *,
          profiles:user_id(first_name, last_name, points, avatar_url, selected_title)
        `)
        .eq('status', 'pending');
      
      if (error) throw error;

      // Type assertion to handle the relationship data format
      const hubRequestsWithProfiles = data.map(item => {
        // Handle possible errors in the profiles relation
        let profile: UserProfile;
        if (item.profiles && typeof item.profiles === 'object' && !('error' in item.profiles)) {
          profile = item.profiles as UserProfile;
        } else {
          profile = {
            first_name: 'Unknown',
            last_name: 'User',
            points: 0,
            avatar_url: null,
            selected_title: null
          };
        }

        return {
          ...item,
          profiles: profile
        };
      });
      
      setHubRequests(hubRequestsWithProfiles as HubRequest[]);
    } catch (err) {
      console.error('Error fetching hub requests:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch hub requests',
        variant: 'destructive',
      });
    } finally {
      setHubRequestsLoading(false);
    }
  };

  const fetchRouteRequests = async () => {
    try {
      setRouteRequestsLoading(true);
      const { data, error } = await supabase
        .from('route_requests')
        .select(`
          *,
          profiles:user_id(first_name, last_name, points, avatar_url, selected_title)
        `)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      // Type assertion to handle the relationship data format
      const routeRequestsWithProfiles = data.map(item => {
        // Handle possible errors in the profiles relation
        let profile: UserProfile;
        if (item.profiles && typeof item.profiles === 'object' && !('error' in item.profiles)) {
          profile = item.profiles as UserProfile;
        } else {
          profile = {
            first_name: 'Unknown',
            last_name: 'User',
            points: 0,
            avatar_url: null,
            selected_title: null
          };
        }

        return {
          ...item,
          profiles: profile
        };
      });
      
      setRouteRequests(routeRequestsWithProfiles as RouteRequest[]);
    } catch (err) {
      console.error('Error fetching route requests:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch route requests',
        variant: 'destructive',
      });
    } finally {
      setRouteRequestsLoading(false);
    }
  };

  const handleHubRequestApproval = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hub_requests')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      // Optimistically update the state
      setHubRequests(hubRequests.map(request =>
        request.id === id ? { ...request, status: 'approved' } : request
      ));

      toast({
        title: 'Hub Request Approved',
        description: 'The hub request has been approved.',
      });
    } catch (err) {
      console.error('Error approving hub request:', err);
      toast({
        title: 'Error',
        description: 'Failed to approve hub request',
        variant: 'destructive',
      });
    }
  };

  const handleRouteRequestApproval = async (id: string) => {
    try {
      const { error } = await supabase
        .from('route_requests')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      // Optimistically update the state
      setRouteRequests(routeRequests.map(request =>
        request.id === id ? { ...request, status: 'approved' } : request
      ));

      toast({
        title: 'Route Request Approved',
        description: 'The route request has been approved.',
      });
    } catch (err) {
      console.error('Error approving route request:', err);
      toast({
        title: 'Error',
        description: 'Failed to approve route request',
        variant: 'destructive',
      });
    }
  };

  const handleHubRequestRejection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hub_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      // Optimistically update the state
      setHubRequests(hubRequests.map(request =>
        request.id === id ? { ...request, status: 'rejected' } : request
      ));

      toast({
        title: 'Hub Request Rejected',
        description: 'The hub request has been rejected.',
      });
    } catch (err) {
      console.error('Error rejecting hub request:', err);
      toast({
        title: 'Error',
        description: 'Failed to reject hub request',
        variant: 'destructive',
      });
    }
  };

  const handleRouteRequestRejection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('route_requests')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      // Optimistically update the state
      setRouteRequests(routeRequests.map(request =>
        request.id === id ? { ...request, status: 'rejected' } : request
      ));

      toast({
        title: 'Route Request Rejected',
        description: 'The route request has been rejected.',
      });
    } catch (err) {
      console.error('Error rejecting route request:', err);
      toast({
        title: 'Error',
        description: 'Failed to reject route request',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Requests</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hub Requests */}
        <div className="rounded-md border">
          <h3 className="px-4 py-2 font-semibold">Hub Requests</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Hub Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hubRequestsLoading ? (
                // Skeleton loading state
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={`hub-skeleton-${i}`}>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : hubRequests.length === 0 ? (
                // No data state
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No pending hub requests</TableCell>
                </TableRow>
              ) : (
                // Data mapping
                hubRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.profiles.first_name} {request.profiles.last_name}</TableCell>
                    <TableCell>{request.hub_name}</TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleHubRequestApproval(request.id)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleHubRequestRejection(request.id)}>Reject</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Route Requests */}
        <div className="rounded-md border">
          <h3 className="px-4 py-2 font-semibold">Route Requests</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Start Location</TableHead>
                <TableHead>End Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routeRequestsLoading ? (
                // Skeleton loading state
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={`route-skeleton-${i}`}>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  </TableRow>
                ))
              ) : routeRequests.length === 0 ? (
                // No data state
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No pending route requests</TableCell>
                </TableRow>
              ) : (
                // Data mapping
                routeRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.profiles.first_name} {request.profiles.last_name}</TableCell>
                    <TableCell>{request.start_location}</TableCell>
                    <TableCell>{request.end_location}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleRouteRequestApproval(request.id)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRouteRequestRejection(request.id)}>Reject</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
