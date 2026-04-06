import React from 'react';

const AwardsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-primary via-secondary to-highlight">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl xl:text-5xl font-pj">
            Our Awards
          </h2>
          <p className="mt-4 text-lg text-white">
            We are proud to be recognized for our innovation and impact.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="p-8 rounded-lg text-center">
            <a href="/blog/redbull-basement-2026" target="_blank" rel="noopener noreferrer">
              <img className="h-24 mx-auto" src="https://img.redbull.com/images/c_limit,w_2000/e_trim:1:transparent/c_limit,w_300,h_272/bo_5px_solid_rgb:00000000/q_auto:best,f_auto/redbullcom/2024/7/25/hckaipzsonzjai5rvhld/red-bull-basement-logo" alt="Red Bull Basement" />
              <h3 className="mt-6 text-2xl font-bold text-white">Red Bull Basement 2026</h3>
              <p className="mt-2 text-base text-white">Representing South Africa</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;