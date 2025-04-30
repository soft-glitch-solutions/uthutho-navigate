
import { Link } from 'react-router-dom';
import { Phone, Menu, Bot } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="fixed w-full z-50">
      <div className="container mx-auto px-4 pt-4 pb-2">
        <div className="bg-white/95 backdrop-blur-sm rounded-full mx-auto max-w-3xl">
          <div className="flex items-center justify-between h-16 px-4 md:px-8">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
                alt="Uthutho Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl md:text-2xl font-bold text-primary">Uthutho</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">About Us</a>
              <a 
                href="https://ai.uthutho.co.za/"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-primary transition-colors"
              >
                Try AI
              </a>
              <button className="bg-highlight text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-highlight/90 transition-colors">
                <Phone size={18} />
                <span>Download App</span>
              </button>
            </div>
            
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
  );
};

export default Navbar;
