
import React from 'react';
import { Stop, Route, Hub } from '@/types/stops';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map } from 'lucide-react';

interface StopFormProps {
  selectedStop: Stop | null;
  setSelectedStop: React.Dispatch<React.SetStateAction<Stop | null>>;
  googleMapsUrl: string;
  setGoogleMapsUrl: React.Dispatch<React.SetStateAction<string>>;
  handleGoogleMapsUrlChange: (url: string) => void;
  routes?: Route[];
  hubs?: Hub[];
  selectedRoutes: string[];
  selectedHubs: string[];
  toggleRouteSelection: (routeId: string) => void;
  toggleHubSelection: (hubId: string) => void;
  routeOrderNumbers: Record<string, number>;
  setRouteOrderNumbers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  hubDistances: Record<string, number>;
  setHubDistances: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitButtonText: string;
}

export const StopForm = ({
  selectedStop,
  setSelectedStop,
  googleMapsUrl,
  setGoogleMapsUrl,
  handleGoogleMapsUrlChange,
  routes = [],
  hubs = [],
  selectedRoutes,
  selectedHubs,
  toggleRouteSelection,
  toggleHubSelection,
  routeOrderNumbers,
  setRouteOrderNumbers,
  hubDistances,
  setHubDistances,
  onSubmit,
  onCancel,
  submitButtonText
}: StopFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={selectedStop?.name || ''}
            onChange={(e) => setSelectedStop({ ...selectedStop!, name: e.target.value })}
            className="w-full p-2 border border-border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Google Maps URL</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              className="w-full p-2 border border-border rounded-md"
              placeholder="Paste Google Maps URL here"
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => handleGoogleMapsUrlChange(googleMapsUrl)}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Paste a Google Maps URL to automatically extract coordinates
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={selectedStop?.latitude || 0}
              onChange={(e) => setSelectedStop({ ...selectedStop!, latitude: parseFloat(e.target.value) })}
              className="w-full p-2 border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={selectedStop?.longitude || 0}
              onChange={(e) => setSelectedStop({ ...selectedStop!, longitude: parseFloat(e.target.value) })}
              className="w-full p-2 border border-border rounded-md"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cost (R)</label>
          <input
            type="number"
            step="0.01"
            value={selectedStop?.cost || 0}
            onChange={(e) => setSelectedStop({ ...selectedStop!, cost: parseFloat(e.target.value) })}
            className="w-full p-2 border border-border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={selectedStop?.notes || ''}
            onChange={(e) => setSelectedStop({ ...selectedStop!, notes: e.target.value })}
            className="w-full p-2 border border-border rounded-md"
            rows={3}
            placeholder="Add any notes or details about this stop"
          />
        </div>
        
        <Tabs defaultValue="routes">
          <TabsList className="w-full">
            <TabsTrigger value="routes" className="flex-1">Associated Routes</TabsTrigger>
            <TabsTrigger value="hubs" className="flex-1">Associated Hubs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="routes">
            <div className="space-y-2 p-2">
              <p className="text-sm font-medium">Select routes for this stop:</p>
              <div className="max-h-60 overflow-y-auto border border-border rounded-md p-2">
                {routes.map(route => (
                  <div key={route.id} className="border-b border-border py-2 px-1 last:border-0">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRoutes.includes(route.id)}
                          onChange={() => toggleRouteSelection(route.id)}
                          className="mr-2"
                        />
                        <span>{route.name}</span>
                      </div>
                      {selectedRoutes.includes(route.id) && (
                        <div className="flex items-center">
                          <span className="text-xs mr-2">Order:</span>
                          <input
                            type="number"
                            min="1"
                            value={routeOrderNumbers[route.id] || 1}
                            onChange={(e) => {
                              const newOrderNumbers = { ...routeOrderNumbers };
                              newOrderNumbers[route.id] = parseInt(e.target.value);
                              setRouteOrderNumbers(newOrderNumbers);
                            }}
                            className="w-16 p-1 border border-border rounded-md"
                          />
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hubs">
            <div className="space-y-2 p-2">
              <p className="text-sm font-medium">Select hubs for this stop:</p>
              <div className="max-h-60 overflow-y-auto border border-border rounded-md p-2">
                {hubs.map(hub => (
                  <div key={hub.id} className="border-b border-border py-2 px-1 last:border-0">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedHubs.includes(hub.id)}
                          onChange={() => toggleHubSelection(hub.id)}
                          className="mr-2"
                        />
                        <span>{hub.name}</span>
                      </div>
                      {selectedHubs.includes(hub.id) && (
                        <div className="flex items-center">
                          <span className="text-xs mr-2">Distance (m):</span>
                          <input
                            type="number"
                            min="0"
                            value={hubDistances[hub.id] || 0}
                            onChange={(e) => {
                              const newDistances = { ...hubDistances };
                              newDistances[hub.id] = parseInt(e.target.value);
                              setHubDistances(newDistances);
                            }}
                            className="w-20 p-1 border border-border rounded-md"
                          />
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitButtonText}</Button>
      </div>
    </form>
  );
};
