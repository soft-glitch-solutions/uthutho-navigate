
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Search, Users, MapPin, Route } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileSearchResult {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

const Overview = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const { data: overviewData } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const { count: userCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      const { count: hubCount } = await supabase
        .from('hubs')
        .select('*', { count: 'exact', head: true });

      const { count: routeCount } = await supabase
        .from('routes')
        .select('*', { count: 'exact', head: true });

      return {
        usersCount: userCount || 0,
        hubsCount: hubCount || 0,
        routesCount: routeCount || 0,
      };
    },
  });

  const searchProfiles = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
        .limit(5);
      
      if (error) throw error;
      
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/admin/dashboard/users/${userId}`);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users by name..." 
            className="pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchProfiles()}
          />
          <Button 
            size="sm" 
            variant="ghost" 
            className="absolute right-0 top-0 h-full"
            onClick={searchProfiles}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
          
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card shadow-lg rounded-md border border-border overflow-hidden">
              {searchResults.map((profile) => (
                <div 
                  key={profile.id}
                  className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer"
                  onClick={() => handleViewProfile(profile.id)}
                >
                  <Avatar>
                    <AvatarFallback>{profile.first_name?.[0] || profile.last_name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {profile.first_name} {profile.last_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-foreground mb-2">Total Users</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl text-primary">{overviewData?.usersCount || 0}</p>
        </Card>
        <Card className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-foreground mb-2">Active Hubs</h3>
            <MapPin className="h-5 w-5 text-secondary" />
          </div>
          <p className="text-3xl text-secondary">{overviewData?.hubsCount || 0}</p>
        </Card>
        <Card className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-foreground mb-2">Total Routes</h3>
            <Route className="h-5 w-5 text-accent" />
          </div>
          <p className="text-3xl text-accent">{overviewData?.routesCount || 0}</p>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
