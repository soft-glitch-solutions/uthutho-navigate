import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import SchoolTransportSection from '../components/home/SchoolTransportSection';
import AwardsSection from '../components/home/AwardsSection';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <SchoolTransportSection />
      <AwardsSection />
    </>
  );
};

export default HomePage;
