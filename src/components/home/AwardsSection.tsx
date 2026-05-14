import React from 'react';

const AwardsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-t from-black via-black/95 to-primary/20">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-secondary tracking-[2px] text-sm font-bold">AWARDS & RECOGNITION</p>
          <h2 className="text-3xl font-light text-white sm:text-4xl xl:text-5xl mt-4 mb-12">
            Recognized for Innovation
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <a 
              href="/blog/redbull-basement-2026" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-8 rounded-2xl bg-muted-darker/50 backdrop-blur-sm border border-glass hover:border-secondary/50 transition-all duration-300 transform hover:-translate-y-2 h-full"
            >
              <div className="flex flex-col items-center text-center">
                <img 
                  className="h-28 mx-auto filter drop-shadow-[0_10px_8px_rgba(0,0,0,0.4)]"
                  src="https://img.redbull.com/images/c_limit,w_2000/e_trim:1:transparent/c_limit,w_300,h_272/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/7/25/hckaipzsonzjai5rvhld/red-bull-basement-logo" 
                  alt="Red Bull Basement" 
                />
                <h3 className="mt-8 text-2xl md:text-3xl font-bold text-secondary">
                  Red Bull Basement 2026
                </h3>
                <p className="mt-2 text-lg text-white">
                  Representing South Africa
                </p>
                <p className="mt-4 text-gray-400">
                  Uthutho was selected as the South African representative for the global Red Bull Basement program, recognizing our innovative approach to solving local transportation challenges.
                </p>
              </div>
            </a>
            <div 
              className="block p-8 rounded-2xl bg-muted-darker/50 backdrop-blur-sm border border-glass hover:border-secondary/50 transition-all duration-300 transform hover:-translate-y-2 h-full"
            >
              <div className="flex flex-col items-center text-center">
                <img 
                  className="h-28 mx-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  src="https://africatechweek.co.za/wp-content/uploads/2023/02/SENTEch-1.png" 
                  alt="Africa Tech Week" 
                />
                <h3 className="mt-8 text-2xl md:text-3xl font-bold text-secondary">
                  Africa Tech Week
                </h3>
                <p className="mt-2 text-lg text-white">
                  Pitch Den Winners
                </p>
                <p className="mt-4 text-gray-400">
                  We are proud to have won the Pitch Den award at Africa Tech Week, a testament to our commitment to revolutionizing transport in Africa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
