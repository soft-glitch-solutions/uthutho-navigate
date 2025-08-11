
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
                alt="Uthutho Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-primary">Uthutho</span>
            </div>
            <p className="text-gray-400">Transforming local travel in South Africa through smart public transport solutions.</p>
          </div>

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

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Cape Town, South Africa</li>
              <li className="text-gray-400">info@uthutho.com</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://www.facebook.com/uthuthorsa/" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/uthuthorsa/" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/company/uthutho/" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            
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
          <p className="text-center text-gray-400">&copy; {new Date().getFullYear()} Uthutho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
