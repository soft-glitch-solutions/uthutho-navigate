import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserProfile {
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
  profiles: UserProfile | null;
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
  profiles: UserProfile | null;
}

const RequestsPage = () => {
  const [hubRequests, setHubRequests] = useState<HubRequest[]>([]);
  const [routeRequests, setRouteRequests] = useState<RouteRequest[]>([]);
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
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          points,
          avatar_url,
          selected_title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (data) {
      const formattedData: HubRequest[] = data.map(item => ({
        ...item,
        profiles: item.profiles ? {
          first_name: item.profiles.first_name || null,
          last_name: item.profiles.last_name || null,
          points: item.profiles.points,
          avatar_url: item.profiles.avatar_url,
          selected_title: item.profiles.selected_title
        } : null
      }));
      setHubRequests(formattedData);
    }
  };

  const fetchRouteRequests = async () => {
    const { data, error } = await supabase
      .from('route_requests')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          points,
          avatar_url,
          selected_title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (data) {
      const formattedData: RouteRequest[] = data.map(item => ({
        ...item,
        profiles: item.profiles ? {
          first_name: item.profiles.first_name || null,
          last_name: item.profiles.last_name || null,
          points: item.profiles.points,
          avatar_url: item.profiles.avatar_url,
          selected_title: item.profiles.selected_title
        } : null
      }));
      setRouteRequests(formattedData);
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
        <p className="text-muted-foreground">Review and manage route and hub requests submitted by users</p>
      </div>

      <Tabs defaultValue="hub-requests" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="hub-requests">Hub Requests</TabsTrigger>
          <TabsTrigger value="route-requests">Route Requests</TabsTrigger>
        </TabsList>
        
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
                      {request.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Address:</span> {request.address}</div>
                      <div><span className="font-medium">Transport Type:</span> {request.transport_type}</div>
                      <div><span className="font-medium">Submitted by:</span> {request.profiles ? `${request.profiles.first_name || ''} ${request.profiles.last_name || ''}`.trim() : 'Unknown'}</div>
                      <div><span className="font-medium">Submitted on:</span> {formatDate(request.created_at)}</div>
                    </div>
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
                      {request.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Transport Type:</span> {request.transport_type}</div>
                      <div><span className="font-medium">Cost:</span> R{(request.cost || 0).toFixed(2)}</div>
                      <div><span className="font-medium">Submitted by:</span> {request.profiles ? `${request.profiles.first_name || ''} ${request.profiles.last_name || ''}`.trim() : 'Unknown'}</div>
                      <div><span className="font-medium">Submitted on:</span> {formatDate(request.created_at)}</div>
                    </div>
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
      </Tabs>
    </div>
  );
};

export default RequestsPage;
