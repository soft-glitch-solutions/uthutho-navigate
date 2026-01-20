import { Truck, ArrowRight, Shield, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchoolTransportSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-black via-black/95 to-primary/10">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 mb-8 rounded-full bg-primary/10">
            <Truck className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Introducing School Transport Made Simple
          </h2>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Uthutho connects parents with school transport drivers and operators,
            helping families find safe, reliable transport while giving drivers
            simple digital tools to manage their services.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="https://mobile.uthutho.co.za/"
              className="group inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Find School Transport
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/learn-more"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Learn how it works
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center mb-3">
                <MapPin className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-white">
                  Transport Listings
                </h3>
              </div>
              <p className="text-gray-400">
                Browse available school transport services by area, route, and
                pricing to find the best option for your child.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-white">
                  Safety & Transparency
                </h3>
              </div>
              <p className="text-gray-400">
                Access clear information on how your child is transported,
                including routes, operators, and safety-focused features.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-white">
                  Live Tracking for Parents
                </h3>
              </div>
              <p className="text-gray-400">
                Track transport vehicles in real time, giving parents peace of
                mind and visibility during school trips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolTransportSection;
