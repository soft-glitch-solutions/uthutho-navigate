
import { Users, Home, MapPin, Route, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import StatsCard from './StatsCard';

interface StatsGridProps {
  usersCount: number;
  hubsCount: number;
  routesCount: number;
  stopsCount: number;
  waitingCount: number;
}

const StatsGrid = ({ usersCount, hubsCount, routesCount, stopsCount, waitingCount }: StatsGridProps) => {
  const statsData = [
    {
      title: 'Total Users',
      value: usersCount,
      icon: Users,
      href: '/admin/dashboard/users',
      color: 'text-primary',
    },
    {
      title: 'Hubs',
      value: hubsCount,
      icon: Home,
      href: '/admin/dashboard/hubs',
      color: 'text-orange-500',
    },
    {
      title: 'Routes',
      value: routesCount,
      icon: Route,
      href: '/admin/dashboard/routes',
      color: 'text-accent',
    },
    {
      title: 'Active Stops',
      value: stopsCount,
      icon: MapPin,
      href: '/admin/dashboard/stops',
      color: 'text-secondary',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {statsData.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
      
      <Card className="p-6">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">People Waiting</h3>
          <Clock className="h-5 w-5 text-blue-500" />
        </div>
        <p className="text-3xl text-blue-500">{waitingCount}</p>
      </Card>
    </div>
  );
};

export default StatsGrid;
