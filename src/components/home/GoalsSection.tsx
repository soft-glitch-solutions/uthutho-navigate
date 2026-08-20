import React from 'react';
import { MapPin, Users, Award, Shield, Leaf, Zap } from 'lucide-react';

const goals = [
  { icon: <MapPin className="h-6 w-6 text-primary" />, text: "Help commuters make smarter decisions with live route and queue visibility" },
  { icon: <Users className="h-6 w-6 text-secondary" />, text: "Turn everyday travellers into a trusted network of real-time transport updates" },
  { icon: <Award className="h-6 w-6 text-accent" />, text: "Build a stronger transport ecosystem for taxis, school transport, and future mobility services" },
  { icon: <Shield className="h-6 w-6 text-primary" />, text: "Give parents better confidence through clearer school transport information and visibility" },
  { icon: <Leaf className="h-6 w-6 text-green-500" />, text: "Support more efficient journeys by reducing guesswork, missed connections, and wasted trips" },
  { icon: <Zap className="h-6 w-6 text-yellow-400" />, text: "Keep transport intelligence accessible with digital and data-light experiences" },
];

const GoalsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 text-white">
          What makes Uthutho different
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          {/* Image side */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/lovable-uploads/uthutho-commute.jpg" // replace with your image path
              alt="Uthutho commuters"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Goals list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 flex items-start space-x-4"
              >
                <div className="flex-shrink-0 mt-1">{goal.icon}</div>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                  {goal.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
