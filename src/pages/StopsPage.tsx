
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const StopsPage = () => {
  const { toast } = useToast();

  const { data: stops, isLoading, refetch } = useQuery({
    queryKey: ['stops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stops')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load stops data",
          variant: "destructive",
        });
        throw error;
      }
      
      return data || [];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Manage Stops</h2>
              <Button>Add New Stop</Button>
            </div>
            
            {isLoading ? (
              <p className="text-muted-foreground">Loading stops data...</p>
            ) : stops && stops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stops.map((stop) => (
                  <div key={stop.id} className="bg-background rounded-lg border border-border p-4">
                    <h3 className="font-medium text-foreground mb-2">{stop.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">Route ID: {stop.route_id}</p>
                    <p className="text-muted-foreground text-sm mb-2">Order: {stop.order_number}</p>
                    <p className="text-muted-foreground text-sm mb-4">Cost: R{stop.cost || 0}</p>
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No stops found. Add some to get started.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StopsPage;
