
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Users, MapPin, Route, StopCircle, Clock } from 'lucide-react';

interface OverviewPageProps {
  usersCount: number;
  hubsCount: number;
  routesCount: number;
  stopsCount: number;
  waitingCount: number;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ 
  usersCount, 
  hubsCount, 
  routesCount,
  stopsCount,
  waitingCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Link to="/admin/dashboard/users" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Total Users</h3>
          <Users className="h-5 w-5 text-primary" />
        </div>
        <p className="text-3xl text-primary">{usersCount}</p>
      </Link>
      
      <Link to="/admin/dashboard/hubs" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Active Hubs</h3>
          <MapPin className="h-5 w-5 text-secondary" />
        </div>
        <p className="text-3xl text-secondary">{hubsCount}</p>
      </Link>
      
      <Link to="/admin/dashboard/routes" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Total Routes</h3>
          <Route className="h-5 w-5 text-accent" />
        </div>
        <p className="text-3xl text-accent">{routesCount}</p>
      </Link>
      
      <Link to="/admin/dashboard/stops" className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Total Stops</h3>
          <StopCircle className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-3xl text-blue-500">{stopsCount}</p>
      </Link>
      
      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">People Waiting</h3>
          <Clock className="h-5 w-5 text-orange-500" />
        </div>
        <p className="text-3xl text-orange-500">{waitingCount}</p>
      </Card>

      {/* HERE Maps Container */}
      <div className="col-span-1 md:col-span-3">
        <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
      </div>
    </div>
  );
};

export default OverviewPage;
