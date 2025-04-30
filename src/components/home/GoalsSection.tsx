
import React from 'react';

const goals = [
  "Provide real-time route and schedule updates",
  "Make public transport easier to understand",
  "Encourage eco-friendly travel options",
  "Reduce traffic congestion",
  "Improve urban mobility",
  "Bridge the information gap"
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
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-all animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <p className="text-base md:text-lg text-gray-300">{goal}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;
