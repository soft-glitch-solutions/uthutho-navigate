import React from 'react';
import { Clock } from 'lucide-react';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

const timelineItems: TimelineItem[] = [
  {
    date: "September 2026",
    title: "Cape Town & Gauteng Growth Push",
    description: "Accelerating user adoption and route coverage across Cape Town and Gauteng. Expanding commuter presence through targeted campaigns, local ambassadors, and community-driven route contributions."
  },
  {
    date: "October 2026",
    title: "Business Partnership Development",
    description: "Building strategic relationships with local businesses, corporate shuttle services, and commercial transport operators in Cape Town and Gauteng to integrate Uthutho into daily business logistics."
  },
  {
    date: "November 2026",
    title: "Fleet Management & B2B Tools",
    description: "Rolling out dedicated fleet management dashboards and B2B tools for business partners, enabling real-time vehicle tracking, driver scheduling, and route optimisation at scale."
  },
  {
    date: "December 2026",
    title: "Year-End Scaling & 2027 Roadmap",
    description: "Consolidating growth in Cape Town and Gauteng, onboarding new business partners, and finalising the strategic roadmap for 2027 expansion into additional provinces and neighbouring countries."
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
