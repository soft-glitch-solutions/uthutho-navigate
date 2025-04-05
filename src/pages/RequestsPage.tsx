
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, X, MapPin, Route as RouteIcon, 
  StopCircle, Inbox, Banknote 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface HubRequest {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  transport_type: string;
  description: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

interface RouteRequest {
  id: string;
  transport_type: string;
  description: string | null;
  status: string;
  created_at: string;
  user_id: string;
  start_point: string;
  end_point: string;
  cost: number | null;
}

interface StopRequest {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  route_id: string;
  cost: number | null;
  description: string | null;
  status: string;
  created_at: string;
  user_id: string;
}

interface PriceChangeRequest {
  id: string;
  route_id: string;
  user_id: string;
  current_price: number;
  new_price: number;
  created_at: string;
  status: string;
  updated_at: string;
}

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('hub-requests');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch hub requests
  const { data: hubRequests, isLoading: hubsLoading } = useQuery({
    queryKey: ['hub-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hub_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as HubRequest[];
    },
  });

  // Fetch route requests
  const { data: routeRequests, isLoading: routesLoading } = useQuery({
    queryKey: ['route-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RouteRequest[];
    },
  });

  // Fetch stop requests
  const { data: stopRequests, isLoading: stopsLoading } = useQuery({
    queryKey: ['stop-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stop_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StopRequest[];
    },
  });

  // Fetch price change requests
  const { data: priceChangeRequests, isLoading: priceChangeLoading } = useQuery({
    queryKey: ['price-change-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_change_requests')
        .select(`
          *,
          routes(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (PriceChangeRequest & { routes: { name: string } })[];
    },
  });

  // Mutation to update hub request status
  const updateHubRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('hub_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return { id, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hub-requests'] });
      toast({
        title: "Status updated",
        description: `Hub request status changed to ${data.status}`,
      });
    },
  });

  // Mutation to update route request status
  const updateRouteRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('route_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return { id, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['route-requests'] });
      toast({
        title: "Status updated",
        description: `Route request status changed to ${data.status}`,
      });
    },
  });

  // Mutation to update stop request status
  const updateStopRequestStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('stop_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return { id, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['stop-requests'] });
      toast({
        title: "Status updated",
        description: `Stop request status changed to ${data.status}`,
      });
    },
  });

  // Mutation to update price change request status
  const updatePriceChangeRequestStatus = useMutation({
    mutationFn: async ({ id, status, routeId, newPrice }: { id: string; status: string; routeId?: string; newPrice?: number }) => {
      const { error } = await supabase
        .from('price_change_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // If approved, update the route price
      if (status === 'approved' && routeId && newPrice !== undefined) {
        const { error: routeError } = await supabase
          .from('routes')
          .update({ cost: newPrice })
          .eq('id', routeId);
        
        if (routeError) throw routeError;
      }
      
      return { id, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['price-change-requests'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({
        title: "Status updated",
        description: `Price change request ${data.status}`,
      });
    },
  });

  // Mutation to approve and create a hub from a request
  const approveAndCreateHub = useMutation({
    mutationFn: async (hubRequest: HubRequest) => {
      // First create the hub
      const { data: hub, error: hubError } = await supabase
        .from('hubs')
        .insert([{
          name: hubRequest.name,
          address: hubRequest.address,
          latitude: hubRequest.latitude,
          longitude: hubRequest.longitude,
          transport_type: hubRequest.transport_type
        }])
        .select()
        .single();
      
      if (hubError) throw hubError;
      
      // Then update the request status
      const { error: requestError } = await supabase
        .from('hub_requests')
        .update({ status: 'approved' })
        .eq('id', hubRequest.id);
      
      if (requestError) throw requestError;
      
      return hub;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hub-requests'] });
      queryClient.invalidateQueries({ queryKey: ['hubs'] });
      toast({
        title: "Hub created",
        description: "Hub request approved and new hub created",
      });
    },
  });

  // Mutation to approve and create a route from a request
  const approveAndCreateRoute = useMutation({
    mutationFn: async (routeRequest: RouteRequest) => {
      // First create the route
      const { data: route, error: routeError } = await supabase
        .from('routes')
        .insert([{
          start_point: routeRequest.start_point,
          end_point: routeRequest.end_point,
          cost: routeRequest.cost || 0,
          transport_type: routeRequest.transport_type,
          name: `${routeRequest.start_point} to ${routeRequest.end_point}`
        }])
        .select()
        .single();
      
      if (routeError) throw routeError;
      
      // Then update the request status
      const { error: requestError } = await supabase
        .from('route_requests')
        .update({ status: 'approved' })
        .eq('id', routeRequest.id);
      
      if (requestError) throw requestError;
      
      return route;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route-requests'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({
        title: "Route created",
        description: "Route request approved and new route created",
      });
    },
  });

  // Mutation to approve and create a stop from a request
  const approveAndCreateStop = useMutation({
    mutationFn: async (stopRequest: StopRequest) => {
      // First create the stop
      const { data: stop, error: stopError } = await supabase
        .from('stops')
        .insert([{
          name: stopRequest.name,
          latitude: stopRequest.latitude,
          longitude: stopRequest.longitude,
          route_id: stopRequest.route_id,
          cost: stopRequest.cost || 0,
          order_number: 1 // Default order, would need logic to determine proper order
        }])
        .select()
        .single();
      
      if (stopError) throw stopError;
      
      // Then update the request status
      const { error: requestError } = await supabase
        .from('stop_requests')
        .update({ status: 'approved' })
        .eq('id', stopRequest.id);
      
      if (requestError) throw requestError;
      
      return stop;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stop-requests'] });
      queryClient.invalidateQueries({ queryKey: ['stops'] });
      toast({
        title: "Stop created",
        description: "Stop request approved and new stop created",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <h1 className="text-2xl font-bold mb-6">Manage Requests</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="hub-requests" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" /> Hub Requests
          </TabsTrigger>
          <TabsTrigger value="route-requests" className="flex items-center">
            <RouteIcon className="mr-2 h-4 w-4" /> Route Requests
          </TabsTrigger>
          <TabsTrigger value="stop-requests" className="flex items-center">
            <StopCircle className="mr-2 h-4 w-4" /> Stop Requests
          </TabsTrigger>
          <TabsTrigger value="price-change-requests" className="flex items-center">
            <Banknote className="mr-2 h-4 w-4" /> Price Changes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="hub-requests">
          <div className="space-y-4">
            {hubsLoading ? (
              <div>Loading hub requests...</div>
            ) : hubRequests?.length === 0 ? (
              <div>No hub requests found</div>
            ) : (
              hubRequests?.map((request) => (
                <div key={request.id} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{request.name}</h3>
                      <p className="text-muted-foreground">{request.address}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Latitude</p>
                      <p>{request.latitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Longitude</p>
                      <p>{request.longitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transport Type</p>
                      <p>{request.transport_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p>{new Date(request.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {request.description && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p>{request.description}</p>
                    </div>
                  )}
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => approveAndCreateHub.mutate(request)}
                        className="flex items-center"
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve & Create
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => updateHubRequestStatus.mutate({ id: request.id, status: 'rejected' })}
                        className="flex items-center"
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="route-requests">
          <div className="space-y-4">
            {routesLoading ? (
              <div>Loading route requests...</div>
            ) : routeRequests?.length === 0 ? (
              <div>No route requests found</div>
            ) : (
              routeRequests?.map((request) => (
                <div key={request.id} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{request.start_point} to {request.end_point}</h3>
                      <p className="text-muted-foreground">Transport: {request.transport_type}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Suggested Cost</p>
                      <p>{request.cost ? `R${request.cost}` : 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p>{new Date(request.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {request.description && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p>{request.description}</p>
                    </div>
                  )}
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => approveAndCreateRoute.mutate(request)}
                        className="flex items-center"
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve & Create
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => updateRouteRequestStatus.mutate({ id: request.id, status: 'rejected' })}
                        className="flex items-center"
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="stop-requests">
          <div className="space-y-4">
            {stopsLoading ? (
              <div>Loading stop requests...</div>
            ) : stopRequests?.length === 0 ? (
              <div>No stop requests found</div>
            ) : (
              stopRequests?.map((request) => (
                <div key={request.id} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{request.name}</h3>
                      <p className="text-muted-foreground">For Route ID: {request.route_id}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Latitude</p>
                      <p>{request.latitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Longitude</p>
                      <p>{request.longitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Suggested Cost</p>
                      <p>{request.cost ? `R${request.cost}` : 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p>{new Date(request.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {request.description && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p>{request.description}</p>
                    </div>
                  )}
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => approveAndCreateStop.mutate(request)}
                        className="flex items-center"
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve & Create
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => updateStopRequestStatus.mutate({ id: request.id, status: 'rejected' })}
                        className="flex items-center"
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="price-change-requests">
          <div className="space-y-4">
            {priceChangeLoading ? (
              <div>Loading price change requests...</div>
            ) : priceChangeRequests?.length === 0 ? (
              <div>No price change requests found</div>
            ) : (
              priceChangeRequests?.map((request) => (
                <div key={request.id} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">Price Change Request</h3>
                      <p className="text-muted-foreground">
                        Route: {request.routes?.name || `ID: ${request.route_id}`}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p>R{request.current_price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Requested New Price</p>
                      <p>R{request.new_price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price Difference</p>
                      <p className={request.new_price > request.current_price ? "text-red-500" : "text-green-500"}>
                        {request.new_price > request.current_price ? "+" : ""}
                        R{(request.new_price - request.current_price).toFixed(2)}
                        {" "}
                        ({((request.new_price - request.current_price) / request.current_price * 100).toFixed(1)}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p>{new Date(request.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => updatePriceChangeRequestStatus.mutate({ 
                          id: request.id, 
                          status: 'approved', 
                          routeId: request.route_id,
                          newPrice: request.new_price
                        })}
                        className="flex items-center"
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve Change
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => updatePriceChangeRequestStatus.mutate({ id: request.id, status: 'rejected' })}
                        className="flex items-center"
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsPage;
