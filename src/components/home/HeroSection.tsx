
import { useState, useEffect } from 'react';
import { Phone, Bot } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#1ea2b133,#ed67b133,#f8c32533,#fd602d33)] opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/lovable-uploads/57f51ba8-7a3d-442f-b314-6732a5bd80fe.png')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img 
            src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
            alt="Uthutho Logo Background" 
            className="w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] max-w-[800px] max-h-[800px]"
          />
        </div>
      </div>
      <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 py-8 md:py-16">
        <div className="text-center md:text-left md:w-1/2 mb-12 md:mb-0">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Transform Your Daily Commute!
          </h1>
          <p className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            South Africa's smart public transport companion
          </p>
          <p className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            No Data No problem, Join our data free web app version. 
          </p>
          <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col items-center sm:items-start">
              <button 
                className="bg-primary text-white px-8 py-3 rounded-full font-semibold opacity-50 cursor-not-allowed flex items-center gap-2"
                disabled
              >
                <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 16l4-4h-3V4h-2v8H8l4 4z"/>
                    <path d="M6 18v2h12v-2H6z"/>
                  </svg>
                  <span>Download Now</span>
                </div>
                <div className="flex items-center space-x-1 pl-2 border-l border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.365 1.43c0 1.14-.417 2.1-1.25 2.876-.92.845-1.962 1.335-3.123 1.26-.06-1.1.407-2.06 1.21-2.84.417-.402.94-.734 1.57-.995.63-.262 1.207-.357 1.593-.3zM20.79 17.72c-.473 1.1-1.037 2.06-1.69 2.88-.88 1.08-1.83 1.63-2.85 1.65-.726.02-1.272-.2-1.638-.65-.36-.44-.74-.884-1.144-1.33-.404-.445-.84-.672-1.31-.68-.488-.01-1.01.21-1.57.66-.56.45-1.032.88-1.42 1.29-.42.47-.932.7-1.536.69-1.055-.03-2.037-.6-2.945-1.72-.75-.92-1.37-1.99-1.86-3.22-.52-1.31-.783-2.58-.79-3.81-.01-1.24.25-2.31.78-3.2.52-.87 1.214-1.56 2.08-2.05.867-.5 1.824-.76 2.87-.78.565-.01 1.31.22 2.23.69.92.47 1.515.71 1.785.72.19.01.86-.27 2.02-.85 1.08-.54 1.99-.76 2.73-.67 2.02.16 3.54.96 4.55 2.4-1.8 1.09-2.69 2.61-2.67 4.57.02 1.53.57 2.81 1.65 3.83z"/>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 3.25a.75.75 0 0 0-1.046.2l-1.089 1.63A7.963 7.963 0 0 0 12 4c-1.25 0-2.432.287-3.388.79L7.523 3.45a.75.75 0 0 0-1.246.846l1.017 1.5A7.956 7.956 0 0 0 4 12v6a2 2 0 0 0 2 2h1v2.25a.75.75 0 0 0 1.5 0V20h7v2.25a.75.75 0 0 0 1.5 0V20h1a2 2 0 0 0 2-2v-6a7.956 7.956 0 0 0-3.294-6.204l1.017-1.5a.75.75 0 0 0-.2-1.046zM9 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>

                </div>
              </button>
              <span className="text-sm text-gray-400 mt-2">Coming Soon</span>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => window.open("https://www.mobile.uthutho.co.za/", "_blank")}
                className="bg-transparent text-white px-8 py-3 rounded-full font-semibold border-2 border-primary hover:bg-primary/10 transition-colors"
              >
                Data Free Portal
              </button>
            </div>
          </div>
        </div>
        <div className={`md:w-1/2 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
          <div className="relative w-[250px] sm:w-[300px] h-[500px] sm:h-[600px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-highlight opacity-20 blur-xl rounded-full"></div>
            <div className="relative z-10 bg-black rounded-[40px] p-3 shadow-2xl">
              <div className="relative overflow-hidden rounded-[32px] h-[470px] sm:h-[570px]">
                <img 
                  src="/lovable-uploads/Uthuthophone.png"
                  alt="Uthutho App"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
