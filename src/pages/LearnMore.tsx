import React from 'react';
import { Bot, Brain, Shield, Globe, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnMore: React.FC = () => {
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
            <span className="text-xl md:text-2xl font-bold text-primary">
              Uthutho
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            School Transport
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-12">
              Uthutho provides a digital platform that connects parents with
              school transport drivers and operators, making it easier to find,
              manage, and monitor safe school transport services.
            </p>

            {/* Platform Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Globe className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Transport Listings
                </h3>
                <p className="text-gray-400">
                  School transport drivers and operators can list their routes,
                  service areas, and pricing so parents can easily find options
                  near them.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Safety & Transparency
                </h3>
                <p className="text-gray-400">
                  Parents receive clear information about how their children are
                  transported, helping them make informed and safe decisions.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Truck className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Live Vehicle Tracking
                </h3>
                <p className="text-gray-400">
                  Drivers can share real-time vehicle location with parents,
                  allowing them to track trips and know when children arrive
                  safely.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Brain className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Simple Digital Tools
                </h3>
                <p className="text-gray-400">
                  Drivers get access to easy-to-use, Uber-like tools to manage
                  their transport services without extra cost.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <h2 className="text-3xl font-bold text-white mb-6">
              How It Works
            </h2>

            <div className="space-y-6 mb-16">
              <p className="text-gray-300">
                School transport drivers and operators sign up on the Uthutho
                platform and create a profile listing their routes, coverage
                areas, vehicles, and pricing. Uthutho provides the technology
                and tools to support their transport services.
              </p>

              <p className="text-gray-300">
                Parents can browse available school transport options, view
                service details, and apply directly to join a driver or
                operator’s transport system.
              </p>

              <p className="text-gray-300">
                Uthutho offers live tracking and safety-focused features, but
                does not manage transport operations or handle any payments.
                All financial arrangements are made directly between parents
                and transport providers.
              </p>
            </div>

            {/* Driver & Operator Information */}
            <h2 className="text-3xl font-bold text-white mb-6">
              Driver & Operator Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Sign Up for Free
                </h3>
                <p className="text-gray-400">
                  Drivers and operators can join the platform at no cost and
                  access digital tools to manage and showcase their school
                  transport services.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Globe className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Reach More Parents
                </h3>
                <p className="text-gray-400">
                  Your transport service becomes visible to parents actively
                  looking for reliable school transport in your area.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Truck className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Live Tracking Access
                </h3>
                <p className="text-gray-400">
                  Provide parents with real-time tracking to build trust,
                  transparency, and peace of mind.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <Brain className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Technology Provider Only
                </h3>
                <p className="text-gray-400">
                  Uthutho does not handle payments or transport management. The
                  platform exists solely to provide technology and connections
                  between parents and transport providers.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Get Started with School Transport on Uthutho
              </h3>
              <p className="text-gray-300 mb-6">
                Whether you are a parent looking for safe school transport or a
                driver wanting to list your service, Uthutho helps you connect
                with confidence.
              </p>
              <a
                href="https://mobile.uthutho.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
