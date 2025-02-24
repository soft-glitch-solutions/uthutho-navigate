
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  start_point: string;
  end_point: string;
  transport_type: string;
  cost: number;
}

interface Hub {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  transport_type: string | null;
}

const HubDetailsPage = () => {
  const { hubId } = useParams<{ hubId: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch hub details
  const { data: hub } = useQuery({
    queryKey: ['hub', hubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hubs')
        .select('*')
        .eq('id', hubId)
        .single();
      if (error) throw error;
      return data as Hub;
    },
  });

  // Fetch routes related to the hub
  const { data: routes } = useQuery({
    queryKey: ['routes', hubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('hub_id', hubId);
      if (error) throw error;
      return data as Route[];
    },
  });

  const filteredRoutes = routes?.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.start_point.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.end_point.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link to="/admin/dashboard" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-2">{hub?.name}</h1>
        <p className="text-muted-foreground">{hub?.address}</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Routes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredRoutes?.length === 0 ? (
            <p className="text-muted-foreground">No routes found for this hub.</p>
          ) : (
            filteredRoutes?.map((route) => (
              <div
                key={route.id}
                className="bg-card p-4 rounded-lg border border-border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground">{route.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {route.start_point} → {route.end_point}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-foreground">
                      R{route.cost.toFixed(2)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {route.transport_type}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HubDetailsPage;
