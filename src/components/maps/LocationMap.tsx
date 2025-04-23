
import React, { useEffect, useRef, useState } from 'react';

interface LocationMapProps {
  className?: string;
  height?: string;
  mapObjects?: any[];
  showControls?: boolean;
  onHubClick?: (hubId: string) => void;
  onStopClick?: (stopId: string) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({
  className = "",
  height = "400px",
  mapObjects,
  showControls = true,
  onHubClick,
  onStopClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  
  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error obtaining location:', error);
          setLocationPermissionDenied(true);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    try {
      // Initialize HERE Map
      const platform = new window.H.service.Platform({
        apikey: 'tEzSszjXMvnBlus-bapyE2hF0qnnPmKpreM7wK3ciAg'
      });
      
      const defaultLayers = platform.createDefaultLayers();
      
      // Initialize the map
      const mapInstance = new window.H.Map(
        mapContainerRef.current,
        defaultLayers.vector.normal.map,
        {
          zoom: 5,
          center: { lat: -30.5595, lng: 22.9375 } // Default: South Africa
        }
      );

      setMap(mapInstance);

      // Add UI controls if needed
      if (showControls) {
        const ui = window.H.ui.UI.createDefault(mapInstance, defaultLayers);
      }
      
      // Enable map interaction (pan, zoom)
      const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance));
      
      // Add window resize listener
      const onWindowResize = () => mapInstance.getViewPort().resize();
      window.addEventListener('resize', onWindowResize);

      // Clean up
      return () => {
        window.removeEventListener('resize', onWindowResize);
        if (mapInstance) {
          mapInstance.dispose();
        }
      };
    } catch (error) {
      console.error('Error initializing HERE map:', error);
    }
  }, [showControls]);
  
  // Handle user location and zoom
  useEffect(() => {
    if (!map || !userLocation) return;
    
    try {
      // Add a marker for user location
      const userMarker = new window.H.map.Marker(
        { lat: userLocation.lat, lng: userLocation.lng },
        {
          icon: new window.H.map.Icon('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white"/></svg>', {size: {w: 24, h: 24}})
        }
      );
      
      map.addObject(userMarker);
      
      // Zoom to user location
      map.setCenter({lat: userLocation.lat, lng: userLocation.lng});
      map.setZoom(13); // City level zoom
      
    } catch (error) {
      console.error('Error adding user location to map:', error);
    }
  }, [map, userLocation]);
  
  // Add map objects (hubs, stops)
  useEffect(() => {
    if (!map || !mapObjects) return;

    try {
      // Clear existing objects first
      map.removeObjects(map.getObjects());
      
      // Add user location marker again if it exists
      if (userLocation) {
        const userMarker = new window.H.map.Marker(
          { lat: userLocation.lat, lng: userLocation.lng },
          {
            icon: new window.H.map.Icon('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="white"/></svg>', {size: {w: 24, h: 24}})
          }
        );
        map.addObject(userMarker);
      }
      
      // Create marker groups
      const hubsGroup = new window.H.map.Group();
      const stopsGroup = new window.H.map.Group();
      map.addObject(hubsGroup);
      map.addObject(stopsGroup);

      mapObjects.forEach(obj => {
        if (!obj || typeof obj.latitude !== 'number' || typeof obj.longitude !== 'number') return;
        
        if (obj.type === 'hub') {
          const marker = new window.H.map.Marker(
            { lat: obj.latitude, lng: obj.longitude },
            {
              data: { id: obj.id, name: obj.name, type: 'hub' },
              icon: new window.H.map.Icon('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" fill="#1E40AF" stroke="white" stroke-width="2"/></svg>', {size: {w: 32, h: 32}})
            }
          );
          
          hubsGroup.addObject(marker);
          
          // Add click event
          marker.addEventListener('tap', (evt) => {
            const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
              content: `<div style="padding:10px;">
                <b>Hub:</b> ${obj.name}<br>
                <b>Address:</b> ${obj.address || 'N/A'}<br>
                <button id="view-hub-${obj.id}" style="background-color:#1E40AF;color:white;border:none;padding:5px 10px;margin-top:5px;border-radius:4px;cursor:pointer;">View Hub</button>
              </div>`
            });
            
            map.ui.addBubble(bubble);
            
            // Add event listener to the button
            setTimeout(() => {
              const button = document.getElementById(`view-hub-${obj.id}`);
              if (button && onHubClick) {
                button.addEventListener('click', () => {
                  onHubClick(obj.id);
                });
              }
            }, 100);
          });
        } else if (obj.type === 'stop') {
          const marker = new window.H.map.Marker(
            { lat: obj.latitude, lng: obj.longitude },
            {
              data: { id: obj.id, name: obj.name, type: 'stop' },
              icon: new window.H.map.Icon('<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="#38BDF8" stroke="white" stroke-width="2"/></svg>', {size: {w: 28, h: 28}})
            }
          );
          
          stopsGroup.addObject(marker);
          
          // Add click event
          marker.addEventListener('tap', (evt) => {
            const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
              content: `<div style="padding:10px;">
                <b>Stop:</b> ${obj.name}<br>
                <b>Order:</b> ${obj.order_number || 'N/A'}<br>
                <button id="view-stop-${obj.id}" style="background-color:#38BDF8;color:white;border:none;padding:5px 10px;margin-top:5px;border-radius:4px;cursor:pointer;">View Stop</button>
              </div>`
            });
            
            map.ui.addBubble(bubble);
            
            // Add event listener to the button
            setTimeout(() => {
              const button = document.getElementById(`view-stop-${obj.id}`);
              if (button && onStopClick) {
                button.addEventListener('click', () => {
                  onStopClick(obj.id);
                });
              }
            }, 100);
          });
        }
      });
      
      // If no user location but we have map objects, fit the map to show all objects
      if (!userLocation && mapObjects.length > 0) {
        const points = mapObjects.filter(p => 
          p && typeof p.latitude === 'number' && typeof p.longitude === 'number'
        );
        
        if (points.length > 0) {
          const bounds = new window.H.geo.Rect(
            points.reduce((min, p) => Math.min(min, p.latitude), 90),
            points.reduce((min, p) => Math.min(min, p.longitude), 180),
            points.reduce((max, p) => Math.max(max, p.latitude), -90),
            points.reduce((max, p) => Math.max(max, p.longitude), -180)
          );
          
          map.getViewModel().setLookAtData({
            bounds: bounds
          }, true);
        }
      }
    } catch (error) {
      console.error('Error adding objects to map:', error);
    }
  }, [map, mapObjects, userLocation, onHubClick, onStopClick]);

  return (
    <div className={className}>
      {locationPermissionDenied && (
        <div className="absolute top-2 right-2 bg-white p-2 rounded shadow z-10 text-sm">
          <p className="text-amber-600">Enable location for better experience</p>
        </div>
      )}
      <div ref={mapContainerRef} style={{ height }} className="w-full rounded-lg"></div>
    </div>
  );
};

export default LocationMap;
