
import { Bot, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AISection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-black via-black/95 to-primary/10">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 mb-8 rounded-full bg-primary/10">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Meet Uthutho AI Assistant
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your personal guide to navigating South Africa's transport system. Get instant answers about routes, schedules, and travel tips tailored to your needs. Powered by advanced AI to make your journey smoother.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/chat"
              className="group inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Try Uthutho AI
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/learn-more"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Learn more about our AI
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Route Planning</h3>
              <p className="text-gray-400">Get detailed information about the best routes and transport options for your journey.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Local Insights</h3>
              <p className="text-gray-400">Access up-to-date information about local transport services and travel conditions.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">24/7 Assistance</h3>
              <p className="text-gray-400">Get instant answers to your travel questions anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
