import React from 'react';

const MediaSection: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-pj">
            As Featured In
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Uthutho has been featured in various media outlets for its impact on public transport.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-12 xl:grid-cols-5 xl:gap-16 justify-items-center">
            <div className="flex items-center justify-center">
                <a href="/blog/redbull-basement-2026" target="_blank" rel="noopener noreferrer">
                  <img className="h-12" src="https://www.redbull.com/energy/img/redbullcom/2021/11/17/i9oj1xh2vbi934yg9z3i/red-bull-basement-logo-2021.png" alt="Red Bull Basement" />
                </a>
            </div>
            <div className="flex items-center justify-center">
                <img className="h-12" src="https://via.placeholder.com/150x50?text=SABC+News" alt="SABC News" />
            </div>
            <div className="flex items-center justify-center">
                <img className="h-12" src="https://via.placeholder.com/150x50?text=Fast+Company" alt="Fast Company" />
            </div>
            <div className="flex items-center justify-center">
                <img className="h-12" src="https://via.placeholder.com/150x50?text=Forbes" alt="Forbes" />
            </div>
             <div className="flex items-center justify-center">
                <img className="h-12" src="https://via.placeholder.com/150x50?text=Wired" alt="Wired" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;