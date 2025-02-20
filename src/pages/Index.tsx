
import { useState, useEffect } from 'react';
import { Bus, Train, MapPin, Users, Clock, Phone, Info } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black font-quiapo">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">Uthutho Maps</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">About Us</a>
              <button className="bg-highlight text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-highlight/90 transition-colors">
                <Phone size={18} />
                <span>Download App</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#1ea2b133,#ed67b133,#f8c32533,#fd602d33)] opacity-20"></div>
          <div className="absolute inset-0 bg-[url('/lovable-uploads/f5e9d906-40f5-4654-ac1a-6c887f67a7e3.png')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="text-center md:text-left md:w-1/2 mb-12 md:mb-0">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 text-white transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Transform Your Daily Commute
            </h1>
            <p className={`text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              South Africa's smart public transport companion
            </p>
            <div className={`space-x-4 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                Get Started
              </button>
              <button className="bg-transparent text-white px-8 py-3 rounded-full font-semibold border-2 border-primary hover:bg-primary/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className={`md:w-1/2 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="relative w-[300px] h-[600px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-highlight opacity-20 blur-xl rounded-full"></div>
              <div className="relative z-10 bg-black rounded-[40px] p-3 shadow-2xl">
                <div className="relative overflow-hidden rounded-[32px] h-[570px]">
                  <img 
                    src="/lovable-uploads/f5e9d906-40f5-4654-ac1a-6c887f67a7e3.png"
                    alt="Uthutho Maps App"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-primary" />}
              title="Real-time Updates"
              description="Get live updates on routes, schedules, and fares for all public transport options."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-secondary" />}
              title="Carpooling"
              description="Connect with fellow travelers to share rides and reduce costs."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-accent" />}
              title="Time Saving"
              description="Plan your journey efficiently with accurate timing information."
            />
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Our Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-all animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <p className="text-lg text-gray-300">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-highlight">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            "Hamba ngokukhululeka, yazi indlela yakho!"
          </h2>
          <p className="text-lg md:text-xl text-white/90">
            Travel with ease, know your route!
          </p>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all animate-fade-up">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
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
