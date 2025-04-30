
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all animate-fade-up h-full">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default FeatureCard;
