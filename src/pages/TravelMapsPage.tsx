
import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { HERE_API_KEY } from '@/integrations/here-config';

const TravelMapsPage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: hubs } = useQuery({
    queryKey: ['map-hubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hubs')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: stops } = useQuery({
    queryKey: ['map-stops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stops')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!hubs || !stops || !mapContainerRef.current) return;
    
    try {
      // Initialize HERE Map
      const platform = new window.H.service.Platform({
        apikey: HERE_API_KEY
      });
      
      const defaultLayers = platform.createDefaultLayers();
      
      // Get map container element
      const mapElement = mapContainerRef.current;
      if (!mapElement) {
        console.error('Map container element not found');
        return;
      }

      // Initialize the map with South Africa as the center
      const map = new window.H.Map(
        mapElement,
        defaultLayers.vector.normal.map,
        {
          zoom: 5,
          center: { lat: -30.5595, lng: 22.9375 } // Center of South Africa
        }
      );

      // Add UI controls
      const ui = window.H.ui.UI.createDefault(map, defaultLayers);
      
      // Enable map interaction (pan, zoom)
      const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

      // Add window resize listener
      const onWindowResize = () => map.getViewPort().resize();
      window.addEventListener('resize', onWindowResize);

      // Create marker groups
      const hubsGroup = new window.H.map.Group();
      const stopsGroup = new window.H.map.Group();
      map.addObject(hubsGroup);
      map.addObject(stopsGroup);

      // Add hubs to the map
      hubs.forEach(hub => {
        if (hub && typeof hub.latitude === 'number' && typeof hub.longitude === 'number') {
          const marker = new window.H.map.Marker(
            { lat: hub.latitude, lng: hub.longitude },
            {
              data: {
                type: 'hub',
                id: hub.id,
                name: hub.name
              },
              icon: new window.H.map.Icon('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#1E40AF" stroke="white" stroke-width="2"/></svg>', {size: {w: 32, h: 32}})
            }
          );
          
          hubsGroup.addObject(marker);

          // Add info bubble for hub
          marker.addEventListener('tap', (evt) => {
            const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
              content: `<div style="padding:10px;"><b>Hub:</b> ${hub.name}<br><b>Address:</b> ${hub.address || 'N/A'}</div>`
            });
            ui.addBubble(bubble);
          });
        }
      });

      // Add stops to the map
      stops.forEach(stop => {
        if (stop && typeof stop.latitude === 'number' && typeof stop.longitude === 'number') {
          const marker = new window.H.map.Marker(
            { lat: stop.latitude, lng: stop.longitude },
            {
              data: {
                type: 'stop',
                id: stop.id,
                name: stop.name
              },
              icon: new window.H.map.Icon('<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="#38BDF8" stroke="white" stroke-width="2"/></svg>', {size: {w: 28, h: 28}})
            }
          );
          
          stopsGroup.addObject(marker);

          // Add info bubble for stop
          marker.addEventListener('tap', (evt) => {
            const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
              content: `<div style="padding:10px;"><b>Stop:</b> ${stop.name}<br><b>Order:</b> ${stop.order_number || 'N/A'}</div>`
            });
            ui.addBubble(bubble);
          });
        }
      });

      // If we have points, calculate the viewport that contains all of them
      if (hubs.length > 0 || stops.length > 0) {
        const allPoints = [...hubs, ...stops].filter(
          p => p && typeof p.latitude === 'number' && typeof p.longitude === 'number'
        );
        
        if (allPoints.length > 0) {
          const bounds = new window.H.geo.Rect(
            allPoints.reduce((min, p) => Math.min(min, p.latitude), 90),
            allPoints.reduce((min, p) => Math.min(min, p.longitude), 180),
            allPoints.reduce((max, p) => Math.max(max, p.latitude), -90),
            allPoints.reduce((max, p) => Math.max(max, p.longitude), -180)
          );
          
          map.getViewModel().setLookAtData({
            bounds: bounds
          }, true);
        }
      }

      // Clean up
      return () => {
        window.removeEventListener('resize', onWindowResize);
        if (map) {
          map.dispose();
        }
      };
    } catch (error) {
      console.error('Error initializing HERE map:', error);
    }
  }, [hubs, stops]);

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Travel Maps</CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="w-full h-[calc(100vh-12rem)] flex flex-col">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>Transport Hubs and Stops</span>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
                    <span>Hubs ({hubs?.length || 0})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                    <span>Stops ({stops?.length || 0})</span>
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <div ref={mapContainerRef} className="flex-1 rounded-b-lg overflow-hidden"></div>
        </Card>
      </div>
    </div>
  );
};

export default TravelMapsPage;
