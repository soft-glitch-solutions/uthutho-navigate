import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TransportDigitalSection from '../components/home/TransportDigitalSection';
import AISection from '../components/home/AISection';
import AwardsSection from '../components/home/AwardsSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <TransportDigitalSection />
      <FeaturesSection />
      <AISection />
      <AwardsSection />
    </>
  );
};

export default HomePage;
