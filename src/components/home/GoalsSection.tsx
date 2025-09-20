import React from 'react';
import { MapPin, Users, Award, Shield, Leaf, Zap } from 'lucide-react';

const goals = [
  { icon: <MapPin className="h-6 w-6 text-primary" />, text: "Make commuting in South Africa simple, social, and fun" },
  { icon: <Users className="h-6 w-6 text-secondary" />, text: "Build safer and stronger communities through shared journeys" },
  { icon: <Award className="h-6 w-6 text-accent" />, text: "Use gamification to keep travel engaging and rewarding" },
  { icon: <Shield className="h-6 w-6 text-primary" />, text: "Protect commuter privacy with journey titles only" },
  { icon: <Leaf className="h-6 w-6 text-green-500" />, text: "Promote eco-friendly travel and reduce congestion" },
  { icon: <Zap className="h-6 w-6 text-yellow-400" />, text: "Bridge the information gap with real-time updates" },
];

const GoalsSection = () => {
  return (
    <section className="py-12 md:py-20 bg-black">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-white">Our Goals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-all animate-fade-up flex items-center space-x-4"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0 animate-pulse-slow">{goal.icon}</div>
              <p className="text-base md:text-lg text-gray-300">{goal.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
