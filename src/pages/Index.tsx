
import { useState, useEffect } from 'react';
import { Bus, Train, MapPin, Users, Clock, CircleDollarSign } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        <div className="container px-4 mx-auto text-center relative z-10">
          <h1 className={`text-4xl md:text-6xl font-playfair font-bold mb-6 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Uthutho Maps
          </h1>
          <p className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Transforming Local Travel in South Africa
          </p>
          <div className={`space-x-4 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Get Started
            </button>
            <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold border-2 border-primary hover:bg-primary/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <Bus size={120} className="text-primary animate-pulse" />
          </div>
          <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
            <Train size={120} className="text-secondary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-16">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-primary" />}
              title="Real-time Updates"
              description="Get live updates on routes, schedules, and fares for all public transport options."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary" />}
              title="Carpooling"
              description="Connect with fellow travelers to share rides and reduce costs."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-primary" />}
              title="Time Saving"
              description="Plan your journey efficiently with accurate timing information."
            />
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-16">Our Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <p className="text-lg text-gray-700">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-playfair italic mb-4">
            "Hamba ngokukhululeka, yazi indlela yakho!"
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            Travel with ease, know your route!
          </p>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow animate-fade-up">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const goals = [
  "Provide real-time route and schedule updates",
  "Make public transport easier to understand",
  "Encourage eco-friendly travel options",
  "Reduce traffic congestion",
  "Improve urban mobility",
  "Bridge the information gap"
];

export default Index;
