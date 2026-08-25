import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

/* TikTok Icon (lucide-react does not include TikTok) */
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 8.5c-1.9 0-3.7-.6-5.1-1.8v8.3c0 4.2-3.4 7.5-7.6 7.5S.8 19.2.8 15s3.4-7.5 7.6-7.5c.4 0 .9 0 1.3.1v3.9c-.4-.1-.8-.2-1.3-.2-2 0-3.6 1.6-3.6 3.6s1.6 3.6 3.6 3.6 3.6-1.6 3.6-3.6V.5h4c.3 1.9 2.2 4 5.1 4v4z" />
  </svg>
);

const Footer = () => {
  return (
    <footer id="contact" className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png"
                alt="Uthutho Logo"
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-primary">Uthutho</span>
            </div>
            <p className="text-gray-400">
              Community-powered transport intelligence for commuters, parents, and partners across South Africa.
            </p>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Feedback</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/feedback" className="text-gray-400 hover:text-secondary transition-colors">
                  Give us feedback
                </Link>
              </li>
              <li>
                <Link to="/ratings" className="text-gray-400 hover:text-secondary transition-colors">
                  Rate our app
                </Link>
              </li>
              <li>
                <Link to="/suggest-a-stop" className="text-gray-400 hover:text-secondary transition-colors">
                  Suggest a stop
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Cape Town, South Africa</li>
              <li className="text-gray-400">info@uthutho.co.za</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://www.facebook.com/uthuthorsa/"
                className="text-gray-400 hover:text-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </a>

              <a
                href="https://www.instagram.com/uthuthorsa/"
                className="text-gray-400 hover:text-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>

              <a
                href="https://www.linkedin.com/company/uthutho/"
                className="text-gray-400 hover:text-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-6 w-6" />
              </a>

              <a
                href="https://www.youtube.com/@Uthutho"
                className="text-gray-400 hover:text-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-6 w-6" />
              </a>

              <a
                href="https://www.tiktok.com/@uthuthorsa"
                className="text-gray-400 hover:text-secondary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TikTokIcon className="h-6 w-6" />
              </a>
            </div>

            <div className="space-y-2">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-secondary transition-colors block"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="text-gray-400 hover:text-secondary transition-colors block"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Uthutho. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
