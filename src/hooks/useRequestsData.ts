
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

export const useRequestsData = () => {
  const [hubRequests, setHubRequests] = useState<HubRequest[]>([]);
  const [routeRequests, setRouteRequests] = useState<RouteRequest[]>([]);
  const [priceChangeRequests, setPriceChangeRequests] = useState<PriceChangeRequest[]>([]);
  const [stopRequests, setStopRequests] = useState<StopRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
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
            first_name: profileData.first_name,
            last_name: profileData.last_name,
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
            first_name: profileData.first_name,
            last_name: profileData.last_name,
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
            first_name: profileData.first_name,
            last_name: profileData.last_name,
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
            first_name: profileData.first_name,
            last_name: profileData.last_name,
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

  useEffect(() => {
    fetchRequests();
  }, []);
  
  return {
    hubRequests,
    routeRequests,
    priceChangeRequests,
    stopRequests,
    loading,
    handleApproveRequest,
    handleRejectRequest,
    fetchRequests
  };
};
