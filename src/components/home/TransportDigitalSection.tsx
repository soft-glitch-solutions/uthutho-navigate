import { Bus, ArrowRight, Shield, MapPin, Users, Building2, Smartphone, School } from 'lucide-react';

const TransportDigitalSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-black via-black/95 to-primary/10">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 mb-8 rounded-full bg-primary/10">
            <Bus className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Built for the transport challenges people face every day
          </h2>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Uthutho brings taxi updates, route intelligence, school transport visibility, and partner insights into one connected platform so commuters, parents, and organisations can move with more confidence.
          </p>

          <div className="grid gap-6 text-left lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[2px] text-primary">The problem</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Millions of South Africans travel with too little real-time information.</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <MapPin className="mb-3 h-6 w-6 text-primary" />
                  <p className="text-sm text-gray-300">Long queues and route uncertainty slow down everyday commuting.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <School className="mb-3 h-6 w-6 text-primary" />
                  <p className="text-sm text-gray-300">Parents need clearer visibility into school transport safety and arrivals.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <Building2 className="mb-3 h-6 w-6 text-primary" />
                  <p className="text-sm text-gray-300">Employers and partners need better transport planning and commuter insight.</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[2px] text-primary">Check my route</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Example live route snapshot</h3>
              <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-black/40 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm text-gray-300">
                  <span>From: Mitchells Plain</span>
                  <span>To: Cape Town CBD</span>
                </div>
                <div className="grid gap-3 text-sm text-white/90">
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                    <span>Queue status</span>
                    <span className="text-primary">Moderate</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                    <span>Community updates</span>
                    <span className="text-primary">12 recent reports</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                    <span>Route suggestion</span>
                    <span className="text-primary">Use Town Centre rank</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                    <span>Journey chats</span>
                    <span className="text-primary">Available now</span>
                  </div>
                </div>
              </div>
              <a
                href="https://www.mobile.uthutho.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center text-primary transition-colors hover:text-primary/80"
              >
                Explore live transport
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-4">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center mb-3">
                <MapPin className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-white">
                  Community route intelligence
                </h3>
              </div>
              <p className="text-gray-400">
                Know how busy a route is before you arrive with live queue and travel updates from people on the ground.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-white">
                  School transport visibility
                </h3>
              </div>
              <p className="text-gray-400">
                Help parents and schools stay informed with clearer route, driver, and trip progress visibility.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center mb-3">
                <Shield className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-white">
                  Business solutions
                </h3>
              </div>
              <p className="text-gray-400">
                Give employers and transport partners better commuter visibility, planning support, and reporting opportunities.
              </p>
            </div>

            <div id="business-solutions" className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center mb-3">
                <Smartphone className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-white">
                  Data-light access
                </h3>
              </div>
              <p className="text-gray-400">
                Make transport information easier to reach with app, web, and low-data options designed for real commuter conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransportDigitalSection;