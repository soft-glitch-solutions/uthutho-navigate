
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  href: string;
  color: string;
}

const StatsCard = ({ title, value, icon: Icon, href, color }: StatsCardProps) => {
  return (
    <Link to={href} className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border hover:bg-accent/10 transition-colors">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className={`text-3xl ${color}`}>{value}</p>
    </Link>
  );
};

export default StatsCard;
