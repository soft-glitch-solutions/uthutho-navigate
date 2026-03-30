import React from 'react';

const RedbullArticle = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Uthutho Wins Red Bull Basement South Africa 2026</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Uthutho is proud to be the winner of the Red Bull Basement South Africa 2026, representing South Africa on the global stage.
          </p>
        </div>
      </header>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-8">
            The original article can be found <a href="https://www.redbull.com/za-en/red-bull-basement-south-africa-2026-winner" target="_blank" rel="noopener noreferrer" className="text-secondary underline">here</a>.
          </p>
          <p className="text-lg mb-8">
            Uthutho, a revolutionary app designed to simplify and streamline public transport in South Africa, has been crowned the winner of the Red Bull Basement South Africa 2026. The app, which provides real-time information on taxi routes, fares, and estimated travel times, aims to empower commuters and make public transport more accessible and efficient.
          </p>
          <p className="text-lg mb-8">
            The team behind Uthutho will now go on to represent South Africa at the global Red Bull Basement workshop, where they will compete against other innovative projects from around the world. This is a huge milestone for Uthutho and a testament to the team's hard work and dedication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedbullArticle;
