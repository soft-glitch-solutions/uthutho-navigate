
import { useState, useEffect } from 'react';
import { MapPin, Users, Clock, Phone, Facebook, Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import TeamMember, { TeamMemberProps } from '../components/TeamMember';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const teamMembers: TeamMemberProps[] = [
    {
      id: 1,
      name: 'Shaqeel Less',
      title: 'Founder & CEO',
      description: 'Shaqeel is the visionary behind Uthutho, building a smarter way for communities to navigate and access public transport information.',
      image: '/lovable-uploads/b3a46f4f-ab9c-4d12-a070-741cd4fa8fce.png',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/shaqeellink',
        x: 'https://twitter.com/shaqeel',
        github: 'https://github.com/shaqeel',
      },
    },
    {
      id: 2,
      name: 'Malakai Johnson',
      title: 'Head of Sales & Community Partnerships',
      description: 'Malakai leads Uthutho\'s outreach and partnerships, helping us connect with commuters, operators, and local businesses.',
      image: '/lovable-uploads/43556a9b-2082-4701-a4d1-44a59d0e66ea.png',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/malakailink',
        x: 'https://twitter.com/malakai',
        github: 'https://github.com/malakai',
      },
    },
    {
      id: 3,
      name: 'Delisha-Ann Naicker',
      title: 'Head of Operations & Design',
      description: 'Delisha ensures the Uthutho experience is smooth, functional, and beautifully designed — for every commuter and community.',
      image: '/lovable-uploads/100e0ad5-0e76-4ae5-8d98-a110cd2e4425.png',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/delishasmith',
        x: 'https://twitter.com/delisha',
        github: 'https://github.com/delisha',
      },
    },
    {
      id: 4,
      name: 'Ishmael Sikhikhi',
      title: 'Quality Assurance & Software Development',
      description: 'Ishmael ensures our applications meet the highest standards through rigorous testing and quality control, while also contributing to our software development.',
      image: '/lovable-uploads/f5a15602-c45d-4933-b4bb-a0671d0c7a88.png',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/ishmael',
        x: 'https://twitter.com/ishmael',
        github: 'https://github.com/ishmael',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-black font-quiapo">
      {/* Navigation */}
      <nav className="fixed w-full z-50">
        <div className="container mx-auto px-4 pt-4 pb-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-full mx-auto max-w-3xl">
            <div className="flex items-center justify-between h-16 px-4 md:px-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
                  alt="Uthutho Maps Logo" 
                  className="h-8 w-8"
                />
                <span className="text-xl md:text-2xl font-bold text-primary">Uthutho</span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
                <a href="#about" className="text-gray-700 hover:text-primary transition-colors">About Us</a>
                <button className="bg-highlight text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-highlight/90 transition-colors">
                  <Phone size={18} />
                  <span>Download App</span>
                </button>
              </div>
              
              {/* Mobile Menu */}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="md:hidden text-gray-700">
                      <Menu size={24} />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-80 bg-black border-white/10">
                    <div className="flex flex-col h-full pt-10 space-y-6">
                      <a href="#features" className="text-white text-lg hover:text-primary transition-colors py-2">Features</a>
                      <a href="#about" className="text-white text-lg hover:text-primary transition-colors py-2">About Us</a>
                      <button className="bg-highlight text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 hover:bg-highlight/90 transition-colors">
                        <Phone size={18} />
                        <span>Download App</span>
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#1ea2b133,#ed67b133,#f8c32533,#fd602d33)] opacity-20"></div>
          <div className="absolute inset-0 bg-[url('/lovable-uploads/57f51ba8-7a3d-442f-b314-6732a5bd80fe.png')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <img 
              src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
              alt="Uthutho Maps Logo Background" 
              className="w-[800px] h-[800px]"
            />
          </div>
        </div>
        <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 py-8 md:py-16">
          <div className="text-center md:text-left md:w-1/2 mb-12 md:mb-0">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Transform Your Daily Commute
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              South Africa's smart public transport companion
            </p>
            <p className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              No Data No problem, Join our data free web app version. 
            </p>
            <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                Get Started
              </button>
              <button className="bg-transparent text-white px-8 py-3 rounded-full font-semibold border-2 border-primary hover:bg-primary/10 transition-colors">
                Data Free Portal
              </button>
            </div>
          </div>
          <div className={`md:w-1/2 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="relative w-[250px] sm:w-[300px] h-[500px] sm:h-[600px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-highlight opacity-20 blur-xl rounded-full"></div>
              <div className="relative z-10 bg-black rounded-[40px] p-3 shadow-2xl">
                <div className="relative overflow-hidden rounded-[32px] h-[470px] sm:h-[570px]">
                  <img 
                    src="/lovable-uploads/Uthuthophone.png"
                    alt="Uthutho Maps App"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary via-secondary to-highlight">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
            "Hamba ngokukhululeka, yazi indlela yakho!"
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90">
            Travel with ease, know your route!
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-black">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-white">Our Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<MapPin className="h-8 w-8 text-primary" />}
              title="Real-time Updates"
              description="Get live updates on routes, schedules, and fares for all public transport options."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-secondary" />}
              title="Stop Waiting"
              description="Mark yourself as waiting at a stop to help others know about crowding and queue status."
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

      {/* Motto Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary via-secondary to-highlight">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
            "Izindlela zakho ziqinisekisa impumelelo!"
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90">
            Your journey leads to success – keep moving forward!
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section id="about" className="py-12 md:py-20 bg-black">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-white">Our Team</h2>
          <p className="text-gray-300 text-center mb-8 md:mb-16 max-w-3xl mx-auto">
            Meet the dedicated team behind Uthutho Maps, working tirelessly to transform public transport in South Africa.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member) => (
              <TeamMember
                key={member.id}
                {...member}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
                  alt="Uthutho Maps Logo" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-primary">Uthutho Maps</span>
              </div>
              <p className="text-gray-400">Transforming local travel in South Africa through smart public transport solutions.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-primary transition-colors">Blog</Link>
                </li>
                <li>
                  <Link to="/docs" className="text-gray-400 hover:text-primary transition-colors">Documentation</Link>
                </li>
                <li>
                  <Link to="/admin" className="text-gray-400 hover:text-primary transition-colors">Admin Portal</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Cape Town, South Africa</li>
                <li className="text-gray-400">info@uthuthomaps.com</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
              
              {/* Legal Links */}
              <div className="space-y-2">
                <Link to="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors block">
                  Privacy Policy
                </Link>
                <Link to="/terms-and-conditions" className="text-gray-400 hover:text-primary transition-colors block">
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
            <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} Uthutho Maps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all animate-fade-up h-full">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">{title}</h3>
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
