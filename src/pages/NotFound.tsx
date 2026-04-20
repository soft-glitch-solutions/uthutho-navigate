import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import taxiIcon from "/lovable-uploads/taxi-icon.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black font-quiapo text-white flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <img src={taxiIcon} alt="Taxi Icon" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Ooh no, you seem lost.</h1>
          <p className="text-xl text-gray-400 mb-8">
            Let us help you navigate your way back.
          </p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
