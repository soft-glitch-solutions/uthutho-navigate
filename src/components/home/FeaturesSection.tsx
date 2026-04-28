import { useState, useEffect } from 'react';
import {
  MapPin,
  Users,
  Clock,
  Award,
  MessageSquare,
  Truck,
  Shield,
  Navigation
} from 'lucide-react';
import FeatureCard from './FeatureCard';
import centralImage from "/lovable-uploads/Tech.jpg";

const FeaturesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-secondary" />,
      title: "Find People on Your Route",
      description: "Mark yourself as waiting or traveling and see who else is on the same journey with you."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Journey Chats",
      description: "Join temporary chats with fellow commuters. Conversations disappear once the journey ends."
    },
    {
      icon: <Award className="h-8 w-8 text-secondary" />,
      title: "Gamified Travel",
      description: "Earn points, badges, and rewards as you travel. Compete on leaderboards and keep your streaks alive."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Dynamic Journeys",
      description: "Journeys exist only while people are traveling. When the trip ends, the journey closes automatically."
    },
    {
      icon: <Users className="h-8 w-8 text-secondary" />,
      title: "Community & Safety",
      description: "Travel feels less lonely and more secure by connecting with others going the same way."
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "School Transport Listings",
      description: "Drivers and operators can list school transport routes, service areas, and pricing for parents to browse."
    },
    {
      icon: <Navigation className="h-8 w-8 text-secondary" />,
      title: "Live Vehicle Tracking",
      description: "Parents can track school transport vehicles in real time and know when children arrive safely."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Safe & Transparent Transport",
      description: "Parents get clear information about drivers, routes, and transport services to make informed decisions."
    }
  ];

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
            Connecting Commuters, Empowering Parents
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Left Side - Rotating Feature */}
          <div className="w-full lg:w-1/2 transition-all duration-500 ease-in-out">
            <div className="transform transition-all duration-500 animate-fade-in">
              <FeatureCard
                icon={features[currentIndex].icon}
                title={features[currentIndex].title}
                description={features[currentIndex].description}
              />
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