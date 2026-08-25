
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Media Coverage', to: '/media' },
    { label: 'About', to: '/about-us' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full z-50">
      <div className="container mx-auto px-4 pt-4 pb-2">
        <div className="bg-muted-darker/95 backdrop-blur-sm rounded-full mx-auto max-w-3xl border border-glass">
          <div className="flex items-center justify-between h-16 px-4 md:px-8">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
                alt="Uthutho Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl md:text-2xl font-bold text-primary">Uthutho</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) =>
                item.to ? (
                  <Link key={item.label} to={item.to} className="text-white hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} className="text-white hover:text-primary transition-colors">
                    {item.label}
                  </a>
                ),
              )}
            </div>
            
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <button className="md:hidden text-white">
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 bg-black border-white/10">
                  <div className="flex flex-col h-full pt-10 space-y-6">
                    {navItems.map((item) =>
                      item.to ? (
                        <Link key={item.label} to={item.to} className="text-white text-lg hover:text-primary transition-colors py-2">
                          {item.label}
                        </Link>
                      ) : (
                        <a key={item.label} href={item.href} className="text-white text-lg hover:text-primary transition-colors py-2">
                          {item.label}
                        </a>
                      ),
                    )}
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
