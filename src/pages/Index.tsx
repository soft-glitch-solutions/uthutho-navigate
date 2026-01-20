
import React from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import QuoteSection from '../components/home/QuoteSection';
import FeaturesSection from '../components/home/FeaturesSection';
import GoalsSection from '../components/home/GoalsSection';
import SchoolTransportSection from '../components/home/SchoolTransportSection';
import TeamSection from '../components/home/TeamSection';
import Footer from '../components/home/Footer';
import Timeline from '../components/home/Timeline';

const Index = () => {
  return (
    <div className="min-h-screen bg-black font-quiapo">
      <Navbar />
      <HeroSection />
      
      <QuoteSection 
        quote="Hamba ngokukhululeka, yazi indlela yakho!"
        translation="Travel with ease, know your route!"
      />
      

      
      {/* Moved AISection to appear before GoalsSection */}
      <SchoolTransportSection />
      
      <FeaturesSection />
      
      <GoalsSection />
      
      {/* Added new Timeline section */}
      <Timeline />
      
      <QuoteSection 
        quote="Izindlela zakho ziqinisekisa impumelelo!"
        translation="Your journey leads to success – keep moving forward!"
      />
      
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Index;
