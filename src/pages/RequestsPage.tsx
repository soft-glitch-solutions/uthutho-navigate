
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  points?: number;
  avatar_url?: string;
  selected_title?: string;
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

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('hub-requests');
  const [hubRequests, setHubRequests] = useState<HubRequest[]>([]);
  const [routeRequests, setRouteRequests] = useState<RouteRequest[]>([]);
  const [priceChangeRequests, setPriceChangeRequests] = useState<PriceChangeRequest[]>([]);
  const [stopRequests, setStopRequests] = useState<StopRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch hub requests with profile info
      await fetchHubRequests();
      
      // Fetch route requests with profile info
      await fetchRouteRequests();
      
      // Fetch price change requests
      await fetchPriceChangeRequests();
      
      // Fetch stop requests
      await fetchStopRequests();
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHubRequests = async () => {
    const { data, error } = await supabase
      .from('hub_requests')
      .select('*');

    if (error) throw error;
    
    if (data) {
      // Get user profiles separately to avoid the join issue
      const userProfiles: Record<string, UserProfile> = {};
      for (const request of data) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, points, avatar_url, selected_title')
          .eq('id', request.user_id)
          .single();
          
        if (profileData) {
          userProfiles[request.user_id] = {
            user_id: profileData.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            points: profileData.points,
            avatar_url: profileData.avatar_url,
            selected_title: profileData.selected_title
          };
        }
      }
      
      const formattedData: HubRequest[] = data.map(item => ({
        ...item,
        user_profile: userProfiles[item.user_id]
      }));
      
      setHubRequests(formattedData);
    }
  };

  const fetchRouteRequests = async () => {
    const { data, error } = await supabase
      .from('route_requests')
      .select('*');

    if (error) throw error;
    
    if (data) {
      // Get user profiles separately to avoid the join issue
      const userProfiles: Record<string, UserProfile> = {};
      for (const request of data) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, points, avatar_url, selected_title')
          .eq('id', request.user_id)
          .single();
          
        if (profileData) {
          userProfiles[request.user_id] = {
            user_id: profileData.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            points: profileData.points,
            avatar_url: profileData.avatar_url,
            selected_title: profileData.selected_title
          };
        }
      }
      
      const formattedData: RouteRequest[] = data.map(item => ({
        ...item,
        user_profile: userProfiles[item.user_id]
      }));
      
      setRouteRequests(formattedData);
    }
  };
  
  const fetchPriceChangeRequests = async () => {
    const { data, error } = await supabase
      .from('price_change_requests')
      .select(`
        *,
        routes (
          name
        )
      `);

    if (error) throw error;
    
    if (data) {
      // Get user profiles separately
      const userProfiles: Record<string, UserProfile> = {};
      for (const request of data) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, points, avatar_url, selected_title')
          .eq('id', request.user_id)
          .single();
          
        if (profileData) {
          userProfiles[request.user_id] = {
            user_id: profileData.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            points: profileData.points,
            avatar_url: profileData.avatar_url,
            selected_title: profileData.selected_title
          };
        }
      }
      
      const formattedData: PriceChangeRequest[] = data.map(item => ({
        ...item,
        route_name: item.routes?.name,
        user_profile: userProfiles[item.user_id]
      }));
      
      setPriceChangeRequests(formattedData);
    }
  };
  
  const fetchStopRequests = async () => {
    const { data, error } = await supabase
      .from('stop_requests')
      .select(`
        *,
        routes (
          name
        )
      `);

    if (error) throw error;
    
    if (data) {
      // Get user profiles separately
      const userProfiles: Record<string, UserProfile> = {};
      for (const request of data) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, points, avatar_url, selected_title')
          .eq('id', request.user_id)
          .single();
          
        if (profileData) {
          userProfiles[request.user_id] = {
            user_id: profileData.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            points: profileData.points,
            avatar_url: profileData.avatar_url,
            selected_title: profileData.selected_title
          };
        }
      }
      
      const formattedData: StopRequest[] = data.map(item => ({
        ...item,
        route_name: item.routes?.name,
        user_profile: userProfiles[item.user_id]
      }));
      
      setStopRequests(formattedData);
    }
  };

  const handleApproveRequest = async (id: string, type: string) => {
    try {
      let table;
      if (type === 'hub') table = 'hub_requests';
      else if (type === 'route') table = 'route_requests';
      else if (type === 'price') table = 'price_change_requests';
      else if (type === 'stop') table = 'stop_requests';
      
      const { error } = await supabase
        .from(table)
        .update({ status: 'approved' })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Request Approved",
        description: "The request has been approved successfully."
      });
      
      // Refresh data
      fetchRequests();
      
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve the request.",
        variant: "destructive"
      });
    }
  };
  
  const handleRejectRequest = async (id: string, type: string) => {
    try {
      let table;
      if (type === 'hub') table = 'hub_requests';
      else if (type === 'route') table = 'route_requests';
      else if (type === 'price') table = 'price_change_requests';
      else if (type === 'stop') table = 'stop_requests';
      
      const { error } = await supabase
        .from(table)
        .update({ status: 'rejected' })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Request Rejected",
        description: "The request has been rejected."
      });
      
      // Refresh data
      fetchRequests();
      
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject the request.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-4 h-4 mr-1" /> Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="border-orange-400 text-orange-400"><Clock className="w-4 h-4 mr-1" /> Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">Requests Management</h2>
        <p className="text-muted-foreground">Review and manage user-submitted requests</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-4">
          <TabsTrigger value="hub-requests">Hub Requests</TabsTrigger>
          <TabsTrigger value="route-requests">Route Requests</TabsTrigger>
          <TabsTrigger value="stop-requests">Stop Requests</TabsTrigger>
          <TabsTrigger value="price-requests">Price Changes</TabsTrigger>
        </TabsList>
        
        {/* Hub Requests Tab */}
        <TabsContent value="hub-requests" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hubRequests.length === 0 ? (
              <p className="text-center col-span-full py-8">No hub requests found</p>
            ) : (
              hubRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{request.name}</CardTitle>
                      {getStatusBadge(request.status || 'pending')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {request.description || 'No description provided'}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Address:</span> {request.address}</div>
                      <div><span className="font-medium">Transport Type:</span> {request.transport_type}</div>
                      <div><span className="font-medium">Submitted by:</span> {request.user_profile ? `${request.user_profile.first_name || ''} ${request.user_profile.last_name || ''}`.trim() : 'Unknown'}</div>
                      <div><span className="font-medium">Submitted on:</span> {formatDate(request.created_at)}</div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleApproveRequest(request.id, 'hub')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleRejectRequest(request.id, 'hub')}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => navigate(`/requests/hub/${request.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Route Requests Tab */}
        <TabsContent value="route-requests" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routeRequests.length === 0 ? (
              <p className="text-center col-span-full py-8">No route requests found</p>
            ) : (
              routeRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{request.start_point} → {request.end_point}</CardTitle>
                      {getStatusBadge(request.status || 'pending')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {request.description || 'No description provided'}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Transport Type:</span> {request.transport_type}</div>
                      <div><span className="font-medium">Cost:</span> R{(request.cost || 0).toFixed(2)}</div>
                      <div><span className="font-medium">Submitted by:</span> {request.user_profile ? `${request.user_profile.first_name || ''} ${request.user_profile.last_name || ''}`.trim() : 'Unknown'}</div>
                      <div><span className="font-medium">Submitted on:</span> {formatDate(request.created_at)}</div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleApproveRequest(request.id, 'route')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleRejectRequest(request.id, 'route')}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => navigate(`/requests/route/${request.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Stop Requests Tab */}
        <TabsContent value="stop-requests" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stopRequests.length === 0 ? (
              <p className="text-center col-span-full py-8">No stop requests found</p>
            ) : (
              stopRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{request.name}</CardTitle>
                      {getStatusBadge(request.status || 'pending')}
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
                      <div><span className="font-medium">Submitted by:</span> {request.user_profile ? `${request.user_profile.first_name || ''} ${request.user_profile.last_name || ''}`.trim() : 'Unknown'}</div>
                      <div><span className="font-medium">Submitted on:</span> {formatDate(request.created_at)}</div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleApproveRequest(request.id, 'stop')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleRejectRequest(request.id, 'stop')}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Price Change Requests Tab */}
        <TabsContent value="price-requests" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {priceChangeRequests.length === 0 ? (
              <p className="text-center col-span-full py-8">No price change requests found</p>
            ) : (
              priceChangeRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 mr-1 text-primary" />
                          Price Change Request
                        </div>
                      </CardTitle>
                      {getStatusBadge(request.status || 'pending')}
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
                          {((request.new_price - request.current_price) / request.current_price * 100).toFixed(1)}% change
                        </div>
                      </div>
                      <div><span className="font-medium">Submitted by:</span> {request.user_profile ? `${request.user_profile.first_name || ''} ${request.user_profile.last_name || ''}`.trim() : 'Unknown'}</div>
                      <div><span className="font-medium">Submitted on:</span> {formatDate(request.created_at)}</div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleApproveRequest(request.id, 'price')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleRejectRequest(request.id, 'price')}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsPage;
