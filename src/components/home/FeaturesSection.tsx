import { useState, useEffect } from 'react';
import {
  MapPin,
  Users,
  Clock,
  Award,
  MessageSquare,
  Bus, // Changed from Truck
  Shield,
  Navigation,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import FeatureCard from './FeatureCard';
import centralImage from "/lovable-uploads/Tech.jpg";

const FeaturesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-secondary" />,
      title: "Know how busy your route is before you arrive",
      description: "See live commuter activity, queue demand, and movement on the route you plan to use."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Talk to commuters on your route while travelling",
      description: "Join live journey chats to swap updates, ask questions, and travel with more confidence."
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: "See what is happening across the whole journey",
      description: "Track demand at each stop so you can spot pressure points and make better route decisions earlier."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Get live updates only when they matter",
      description: "Uthutho focuses on active journeys, giving you timely information instead of stale transport listings."
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "Travel with community-powered visibility",
      description: "Move with less uncertainty by relying on updates from people already travelling your route."
    },
    {
      icon: <Bus className="h-8 w-8 text-primary" />,
      title: "Find school transport options with more clarity",
      description: "Parents can review routes, service areas, and available transport options in one place."
    },
    {
      icon: <Navigation className="h-8 w-8 text-secondary" />,
      title: "Follow school transport progress in real time",
      description: "Track active school transport journeys and stay informed about expected arrivals and movement."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Choose transport with better safety context",
      description: "Get clearer route and service information so families and commuters can make more informed choices."
    }
  ];

  const nextFeature = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section id="features" className="py-16 md:py-24 bg-black">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-primary tracking-[2px] text-sm font-bold">FEATURES</p>
          <h2 className="text-3xl font-light text-white sm:text-4xl xl:text-5xl font-pj">
            One platform for commuters, parents, and partners
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Left Side - Rotating Feature */}
          <div className="w-full lg:w-1/2 transition-all duration-500 ease-in-out">
            <div className="flex items-center justify-between">
              <button onClick={prevFeature} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronLeft className="w-6 h-6 text-white" /></button>
              <div className="transform transition-all duration-500 animate-fade-in">
                <FeatureCard
                  icon={features[currentIndex].icon}
                  title={features[currentIndex].title}
                  description={features[currentIndex].description}
                />
              </div>
              <button onClick={nextFeature} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronRight className="w-6 h-6 text-white" /></button>
            </div>
            
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full h-2 ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-white/30'
                  }`}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Central Image with Cloud Effect */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Cloud-like floating effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
              <div className="absolute -inset-12 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-full blur-3xl animate-float-slow"></div>
              
              {/* Image */}
              <div className="relative bg-muted-darker/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-glass">
                <img 
                  src={centralImage}
                  alt="Journey Connect"
                  className="w-full max-w-md h-auto object-cover relative z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(20px) scale(1.08);
            opacity: 0.6;
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-10px) scale(1.1);
            opacity: 0.4;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
