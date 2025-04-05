
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Trophy, Star, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  points: number;
  avatar_url: string | null;
  preferred_transport: string | null;
  titles: string[];
  selected_title: string | null;
  updated_at: string;
}

interface UserStats {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
}

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    totalRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    pendingRequests: 0
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!userId,
  });

  // Fetch user statistics (requests submitted)
  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      // Fetch hub requests
      const { data: hubRequests, error: hubError } = await supabase
        .from('hub_requests')
        .select('status')
        .eq('user_id', userId);
      
      // Fetch route requests
      const { data: routeRequests, error: routeError } = await supabase
        .from('route_requests')
        .select('status')
        .eq('user_id', userId);
      
      // Fetch stop requests
      const { data: stopRequests, error: stopError } = await supabase
        .from('stop_requests')
        .select('status')
        .eq('user_id', userId);

      // Fetch price change requests
      const { data: priceRequests, error: priceError } = await supabase
        .from('price_change_requests')
        .select('status')
        .eq('user_id', userId);

      if (hubError || routeError || stopError || priceError) {
        console.error("Error fetching user statistics");
        return;
      }

      const allRequests = [
        ...(hubRequests || []),
        ...(routeRequests || []),
        ...(stopRequests || []),
        ...(priceRequests || [])
      ];

      const approved = allRequests.filter(req => req.status === 'approved').length;
      const rejected = allRequests.filter(req => req.status === 'rejected').length;
      const pending = allRequests.filter(req => req.status === 'pending').length;

      setStats({
        totalRequests: allRequests.length,
        approvedRequests: approved,
        rejectedRequests: rejected,
        pendingRequests: pending
      });
    };

    fetchStats();
  }, [userId]);

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '?';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="Profile" />
              ) : (
                <AvatarFallback>{getInitials(profile?.first_name, profile?.last_name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {profile?.first_name || ''} {profile?.last_name || ''}
                {(!profile?.first_name && !profile?.last_name) && 'Unknown User'}
              </h3>
              {profile?.selected_title && (
                <Badge variant="secondary" className="mt-1">
                  {profile.selected_title}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-xs truncate">{userId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preferred Transport</p>
              <p>{profile?.preferred_transport || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p>{profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Never'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h4 className="font-semibold">Points: {profile?.points || 0}</h4>
          </div>

          <Separator />
          
          <div>
            <h4 className="font-semibold flex items-center mb-4">
              <Activity className="mr-2 h-5 w-5" />
              User Activity
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.totalRequests}</div>
                    <p className="text-xs text-muted-foreground">Total Requests</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{stats.approvedRequests}</div>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{stats.rejectedRequests}</div>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{stats.pendingRequests}</div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {profile?.titles && profile.titles.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold flex items-center mb-4">
                  <Star className="mr-2 h-5 w-5" />
                  Available Titles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.titles.map((title, index) => (
                    <Badge 
                      key={index}
                      variant={title === profile.selected_title ? "default" : "outline"}
                    >
                      {title}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
