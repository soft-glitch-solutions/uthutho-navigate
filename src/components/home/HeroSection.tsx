import { useState, useEffect } from 'react';

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
          <div className={`transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* App Store Badges */}
            <div className="flex flex-col items-center md:items-start mb-8">
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-3">
                <div className="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png" 
                    alt="Get it on Google Play" 
                    className="h-12"
                  />
                </div>
                <a 
                  href="https://appgallery.huawei.com/app/C115317901" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="https://firstimpact.co.za/wp-content/uploads/2024/02/huawei-Badge-Black-huawei-app-gallery-1-1024x307.png" 
                    alt="Available on Huawei AppGallery" 
                    className="h-12"
                  />
                </a>
              </div>
              <span className="text-sm text-gray-400">Download Now</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => window.open("https://www.mobile.uthutho.co.za/", "_blank")}
                className="bg-transparent text-white px-8 py-3 rounded-full font-semibold border-2 border-[#fd602d] hover:bg-[#fd602d]/10 transition-colors whitespace-nowrap"
              >
                Data Free Portal
              </button>
              <button 
                onClick={() => window.open("/path-to-your-apk-file.apk", "_blank")}
                className="bg-transparent text-white px-8 py-3 rounded-full font-semibold border-2 border-[#1ea2b1] hover:bg-[#1ea2b1]/10 transition-colors whitespace-nowrap"
              >
                Download APK
              </button>
            </div>
          </div>
        </div>
        <div className={`md:w-1/2 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
          <div className="relative w-[250px] sm:w-[300px] h-[500px] sm:h-[600px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1ea2b1] via-[#ed67b1] to-[#f8c325] opacity-20 blur-xl rounded-full"></div>
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