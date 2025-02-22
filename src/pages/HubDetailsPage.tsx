import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HubDetailsPage = () => {
  const { hubId } = useParams<{ hubId: string }>(); // Get the hubId from the URL

  // Fetch routes related to the selected hub
  const { data: routes, isLoading, error } = useQuery({
    queryKey: ['routes', hubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('hub_id', hubId); // Assuming routes table has a `hub_id` field
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading routes</div>;

  return (
    <div>
      <h1>Routes for Hub {hubId}</h1>
      <div>
        {routes?.length === 0 ? (
          <p>No routes found for this hub.</p>
        ) : (
          <ul>
            {routes.map((route) => (
              <li key={route.id}>{route.name}</li> // Assuming routes have an 'id' and 'name'
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HubDetailsPage;
