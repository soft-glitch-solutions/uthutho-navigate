
import React from 'react';
import { Bot, Brain, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnMore = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" 
              alt="Uthutho Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl md:text-2xl font-bold text-primary">Uthutho</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Understanding Uthutho AI</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-12">
              Uthutho AI is your intelligent travel companion, designed to revolutionize how you navigate South Africa's public transport system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Bot className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Intelligent Assistant</h3>
                <p className="text-gray-400">Get real-time answers about routes, schedules, and transport options tailored to your needs.</p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Brain className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Smart Learning</h3>
                <p className="text-gray-400">Our AI continuously learns from user interactions to provide more accurate and relevant information.</p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Safe & Reliable</h3>
                <p className="text-gray-400">Get trusted information and safety tips for your journey, verified by our community.</p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Globe className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Local Knowledge</h3>
                <p className="text-gray-400">Access detailed insights about local transport options and community recommendations.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
            <div className="space-y-6 mb-12">
              <p className="text-gray-300">
                Simply ask Uthutho AI any questions about public transport in South Africa. Whether you need route information, 
                scheduling details, or cost estimates, our AI assistant provides quick, accurate answers based on real-time data 
                and community insights.
              </p>
              <p className="text-gray-300">
                The more you interact with Uthutho AI, the better it becomes at understanding your preferences and providing 
                personalized recommendations for your travel needs.
              </p>
            </div>

            <div className="bg-primary/10 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-white mb-4">Start Your Journey with Uthutho AI</h3>
              <p className="text-gray-300 mb-6">
                Experience the future of public transport navigation. Try Uthutho AI now and make your daily commute smarter and more efficient.
              </p>
              <a 
                href="https://ai.uthutho.co.za/"
                className="inline-flex items-center px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Uthutho AI Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
