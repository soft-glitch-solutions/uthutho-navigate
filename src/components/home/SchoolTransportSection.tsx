import { Truck, ArrowRight, Shield, MapPin, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const SchoolTransportSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 mb-8 rounded-full bg-primary/10">
            <Truck className="w-8 h-8 text-primary" />
          </div>

          <p className="text-primary tracking-[2px] text-sm font-bold">SCHOOL TRANSPORT</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-white">
            Simple, Safe, and Transparent
          </h2>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Uthutho connects parents with school transport providers, offering digital tools to find, manage, and monitor school transport with greater visibility and peace of mind.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="https://mobile.uthutho.co.za/"
              className="group inline-flex items-center px-8 py-3 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Find School Transport
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/learn-more"
              className="text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-xl bg-muted-darker/50 backdrop-blur-sm border border-glass hover:border-primary/50 transition-all">
              <div className="mb-4"><MapPin className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">Transport Listings</h3>
              <p className="text-gray-400">Browse services by area, route, and pricing to find the best fit for your family.</p>
            </div>

            <div className="p-6 rounded-xl bg-muted-darker/50 backdrop-blur-sm border border-glass hover:border-primary/50 transition-all">
              <div className="mb-4"><Shield className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">Safety & Transparency</h3>
              <p className="text-gray-400">Access clear information on routes, operators, and safety-focused features.</p>
            </div>

            <div className="p-6 rounded-xl bg-muted-darker/50 backdrop-blur-sm border border-glass hover:border-primary/50 transition-all">
              <div className="mb-4"><Users className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Vehicle Tracking</h3>
              <p className="text-gray-400">Track transport vehicles in real-time, giving you peace of mind and visibility.</p>
            </div>

            <div className="p-6 rounded-xl bg-muted-darker/50 backdrop-blur-sm border border-glass hover:border-primary/50 transition-all">
              <div className="mb-4"><DollarSign className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">Digital Payments</h3>
              <p className="text-gray-400">Pay for transport services securely and conveniently through the Uthutho platform.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolTransportSection;
