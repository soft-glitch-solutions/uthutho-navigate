
import { Users, Home, MapPin, Route, Clock, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import StatsCard from './StatsCard';

interface StatsGridProps {
  usersCount: number;
  hubsCount: number;
  routesCount: number;
  stopsCount: number;
  waitingCount: number;
  totalProfiles?: number;
  activeUsers?: number;
}

const StatsGrid = ({ 
  usersCount, 
  hubsCount, 
  routesCount, 
  stopsCount, 
  waitingCount,
  totalProfiles = 0,
  activeUsers = 0
}: StatsGridProps) => {
  const statsData = [
    {
      title: 'Total Users',
      value: totalProfiles,
      icon: Users,
      href: '/admin/dashboard/users',
      color: 'text-primary',
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
      href: '/admin/dashboard/users',
      color: 'text-green-500',
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
    <>
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
    </>
  );
};

export default StatsGrid;
