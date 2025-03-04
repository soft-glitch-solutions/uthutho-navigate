import { useState, useEffect } from 'react';
import { Bus, Train, MapPin, Users, Clock, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-advance partners carousel
    const interval = setInterval(() => {
      setCurrentPartnerIndex((prev) => (prev + 1) % partners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black font-quiapo">
      {/* Navigation */}
      <nav className="fixed w-full z-50">
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-full mx-auto max-w-3xl">
            <div className="flex items-center justify-between h-16 px-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
                  alt="Uthutho Maps Logo" 
                  className="h-8 w-8"
                />
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
            "Izindlela zakho ziqinisekisa impumelelo!"
          </h2>
          <p className="text-lg md:text-xl text-white/90">
            Your journey leads to success – keep moving forward!
          </p>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Our Awards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AwardCard
              logo="Meek Ventures"
              title="Africa Start Up Of"
              description="Winner of Meek Ventures Innovation Challenge 2023"
            />
            <AwardCard
              logo="Innovation City"
              title="Start-up of the Year"
              description="Innovation City's Most Promising Startup 2023"
            />
            <AwardCard
              logo="City of Cape Town"
              title="City Hustlers"
              description="Cape Town's Urban Mobility Champion 2023"
            />
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Our Partners</h2>
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out"
                 style={{ transform: `translateX(-${currentPartnerIndex * 100}%)` }}>
              {partners.map((partner, index) => (
                <div key={index} className="min-w-full flex justify-center items-center space-x-8">
                  {partner.map((logo, i) => (
                    <div key={i} className="w-32 h-16 bg-white/10 rounded-lg p-4 flex items-center justify-center">
                      <img src={logo} alt="Partner logo" className="max-w-full max-h-full object-contain invert" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <TeamCard
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                <li className="text-gray-400">+27 123 456 789</li>
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

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} Uthutho Maps. All rights reserved.</p>
          </div>
        </div>
      </footer>
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

const AwardCard = ({ logo, title, description }: { logo: string; title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all animate-fade-up">
    <div className="mb-4 text-white font-bold text-lg">{logo}</div>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const TeamCard = ({ name, role, image }: { name: string; role: string; image: string }) => (
  <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all animate-fade-up text-center">
    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-white">{name}</h3>
    <p className="text-gray-400">{role}</p>
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

const partners = [
  ['/google-logo.svg', '/visa-logo.svg', '/amazon-logo.svg'],
  ['/cape-town-logo.svg', '/labs-logo.svg', '/university-logo.svg'],
];

const team = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    image: "/team-member-1.jpg"
  },
  {
    name: "Jane Smith",
    role: "CTO",
    image: "/team-member-2.jpg"
  },
  {
    name: "Mike Johnson",
    role: "Lead Developer",
    image: "/team-member-3.jpg"
  },
  {
    name: "Sarah Williams",
    role: "Design Lead",
    image: "/team-member-4.jpg"
  }
];

export default Index;
