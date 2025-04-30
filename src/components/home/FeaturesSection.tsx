
import { MapPin, Users, Clock } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-12 md:py-20 bg-black">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-white">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            icon={<MapPin className="h-8 w-8 text-primary" />}
            title="Real-time Updates"
            description="Get live updates on routes, schedules, and fares for all public transport options."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-secondary" />}
            title="Stop Waiting"
            description="Mark yourself as waiting at a stop to help others know about crowding and queue status."
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8 text-accent" />}
            title="Time Saving"
            description="Plan your journey efficiently with accurate timing information."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
