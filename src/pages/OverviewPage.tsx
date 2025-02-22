import React from 'react';

interface OverviewPageProps {
  usersCount: number;
  hubsCount: number;
  dailyTripsCount: number;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ usersCount, hubsCount, dailyTripsCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Total Users</h3>
        <p className="text-3xl text-primary">{usersCount}</p>
      </div>
      <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Active Hubs</h3>
        <p className="text-3xl text-secondary">{hubsCount}</p>
      </div>
      <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Daily Trips</h3>
        <p className="text-3xl text-accent">{dailyTripsCount}</p>
      </div>
    </div>
  );
};

export default OverviewPage;
