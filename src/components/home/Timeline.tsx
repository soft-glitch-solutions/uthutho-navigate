import React from 'react';
import { Clock } from 'lucide-react';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

const timelineItems: TimelineItem[] = [
  {
    date: "January 2026",
    title: "Journey Expansion & Driver Onboarding",
    description: "Expanding the Journey feature to school transport and carpooling. Drivers can sign up with Uber-like features including profiles, availability, and route management."
  },
  {
    date: "March 2026",
    title: "Stability & Performance Updates",
    description: "Major stability improvements, bug fixes, performance optimisation, and improved real-time journey accuracy."
  },
  {
    date: "April 2026",
    title: "City Route Expansion",
    description: "Adding and refining routes in Johannesburg and Durban, with better coverage and commuter-driven updates."
  },
  {
    date: "May 2026",
    title: "Transport Organisation Partnerships",
    description: "Connecting with transport organisations, schools, and fleet operators to onboard verified drivers and official routes."
  },
  {
    date: "June 2026",
    title: "International Expansion",
    description: "Preparing for and launching Uthutho in selected international markets with similar public transport needs."
  }
];

const Timeline = () => {
  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="container px-4 mx-auto">
        <div className="flex justify-center mb-10">
          <div className="inline-block p-3 rounded-full bg-primary/10">
            <Clock className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Roadmap
        </h2>
        
        <div className="max-w-4xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-1/2 transform sm:translate-x-[-50%] top-0 bottom-0 w-0.5 bg-primary/50"></div>

          {/* Timeline items */}
          <div className="space-y-12 relative">
            {timelineItems.map((item, index) => (
              <div key={index} className="relative">
                <div
                  className={`flex flex-col sm:flex-row gap-8 ${
                    index % 2 === 0 ? '' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-1/2 transform sm:translate-x-[-50%] w-4 h-4 rounded-full bg-primary mt-4"></div>
                  
                  {/* Content box */}
                  <div
                    className={`sm:w-[calc(50%-40px)] ml-12 sm:ml-0 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 ${
                      index % 2 === 0 ? 'sm:mr-auto' : 'sm:ml-auto'
                    }`}
                  >
                    <div className="text-primary font-bold mb-2">
                      {item.date}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Timeline;
