
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import LocationMap from '@/components/maps/LocationMap';

interface MapSectionProps {
  mapObjects: any[];
  onHubClick: (hubId: string) => void;
  onStopClick: (stopId: string) => void;
}

const MapSection = ({ mapObjects, onHubClick, onStopClick }: MapSectionProps) => {
  return (
    <>
      <Link to="/admin/dashboard/travel-maps" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">View Full Map</h3>
          <MapPin className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">Click to view detailed map</p>
      </Link>

      <div className="col-span-1 sm:col-span-2 md:col-span-3">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="p-3 bg-card border-b border-border flex justify-between items-center">
            <h3 className="font-medium">Transport Network Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
                <span>Hubs</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                <span>Stops</span>
              </div>
            </div>
          </div>
          <LocationMap 
            height="400px" 
            mapObjects={mapObjects}
            onHubClick={onHubClick}
            onStopClick={onStopClick}
          />
        </div>
      </div>
    </>
  );
};

export default MapSection;
