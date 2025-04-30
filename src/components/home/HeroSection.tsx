
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
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4.5h18v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15zm9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                  <span>Download Now</span>
                </div>
                <div className="flex items-center space-x-1 pl-2 border-l border-white/20">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.8 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.04zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm9 2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3.5a3.5 3.5 0 1 0 0-7H12zm0 2h2.5a1.5 1.5 0 0 1 0 3H12V9z" />
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
              <button 
                onClick={() => window.open("https://ai.uthutho.co.za/", "_blank")}
                className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Bot size={18} />
                <span>Try AI</span>
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
