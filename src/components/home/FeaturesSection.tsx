import { MapPin, Users, Clock, Award, MessageSquare } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-12 md:py-20 bg-black">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-white">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            icon={<MapPin className="h-8 w-8 text-primary" />}
            title="Find People on Your Route"
            description="Mark yourself as waiting or traveling and see who else is on the same journey with you."
          />
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8 text-secondary" />}
            title="Journey Chats"
            description="Join temporary chats with fellow commuters. Conversations disappear once the journey ends."
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-accent" />}
            title="Gamified Travel"
            description="Earn points, badges, and rewards as you travel. Compete on leaderboards and keep your streaks alive."
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8 text-primary" />}
            title="Dynamic Journeys"
            description="Journeys exist only while people are traveling. When the trip ends, the journey closes automatically."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-secondary" />}
            title="Community & Safety"
            description="Travel feels less lonely and more secure by connecting with others going the same way."
          />
          <FeatureCard
            icon={<MapPin className="h-8 w-8 text-accent" />}
            title="Public Transport Integration"
            description="Works seamlessly with taxis, buses, and trains to give you real-time updates and routes."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
