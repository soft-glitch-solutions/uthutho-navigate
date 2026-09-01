import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Bus,
  CalendarDays,
  Check,
  ChevronRight,
  Cloud,
  Download,
  ExternalLink,
  Globe2,
  MapPin,
  Menu,
  Newspaper,
  Quote,
  Route,
  School,
  ShieldCheck,
  Sparkles,
  TrainFront,
  Users,
  X,
} from "lucide-react";

const BRAND = {
  primary: "#1ea2b1",
  secondary: "#ed67b1",
  accent: "#f8c325",
  highlight: "#fd602d",
};

const LOGO_SRC = "/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png";

const articles = [
  {
    publication: "UWC News",
    date: "13 April 2026",
    title: "UWC alumni take homegrown transport app from local commutes to global stage",
    summary:
      "UWC highlights how Makhi Mangxola and Shaqeel Less created Uthutho to help commuters navigate unclear routes, uncertain fares and limited real-time travel information.",
    tag: "University feature",
    accent: BRAND.primary,
    url: "https://www.uwc.ac.za/news-and-announcements/news/uwc-alumni-take-homegrown-transport-app-from-local-commutes-to-global-stage",
  },
  {
    publication: "Startup Magazine South Africa",
    date: "23 March 2026",
    title: "From local commute to Silicon Valley: Uthutho crowned South Africa’s champion",
    summary:
      "The publication covers Uthutho’s Red Bull Basement South Africa win and its vision for a community-powered interface bringing taxi, bus and train information together.",
    tag: "Startup spotlight",
    accent: BRAND.secondary,
    url: "https://startupmag.co.za/2026/03/from-local-commute-to-silicon-valley-uthutho-crowned-south-africas-red-bull-basement-champion/",
  },
  {
    publication: "Weekend Argus / Pretoria News",
    date: "17 April 2026",
    title: "Meet the UWC graduates revolutionising South Africa’s public transport with Uthutho",
    summary:
      "A profile of the founders, the platform’s live journey updates and community-verified information, as well as its support for school transport operators and parents.",
    tag: "Founder story",
    accent: BRAND.highlight,
    url: "https://pretorianews.co.za/weekend-argus/2026-04-17-meet-the-uwc-graduates-revolutionising-south-africas-public-transport-with-uthutho/",
  },
];

const features = [
  {
    icon: Route,
    title: "Clearer journeys",
    text: "Discover transport information that helps make unfamiliar routes easier to understand.",
    color: BRAND.primary,
  },
  {
    icon: MapPin,
    title: "Live travel context",
    text: "Use GPS-enabled updates and community input to make everyday commuting more predictable.",
    color: BRAND.secondary,
  },
  {
    icon: Users,
    title: "Community powered",
    text: "Build more useful transport information through updates shared and verified by commuters.",
    color: BRAND.accent,
  },
  {
    icon: School,
    title: "School transport",
    text: "Help parents browse listed operators, routes, vehicles and pricing options in one place.",
    color: BRAND.highlight,
  },
];

const timeline = [
  {
    date: "Late 2025",
    title: "Uthutho takes shape",
    text: "The platform is developed in response to unclear taxi routes, uncertain fares and limited real-time transport information.",
    color: BRAND.primary,
  },
  {
    date: "March 2026",
    title: "National recognition",
    text: "Uthutho is named the 2026 Red Bull Basement South Africa national champion.",
    color: BRAND.secondary,
  },
  {
    date: "April 2026",
    title: "The story gains momentum",
    text: "UWC News and South African publications profile the founders, the platform and its potential impact.",
    color: BRAND.accent,
  },
  {
    date: "1 to 3 June 2026",
    title: "Taking South African innovation global",
    text: "The team is scheduled to showcase Uthutho at the Red Bull Basement World Final in San Francisco and Silicon Valley.",
    color: BRAND.highlight,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
      <Sparkles className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All coverage");

  const filters = ["All coverage", "University feature", "Startup spotlight", "Founder story"];
  const filteredArticles = useMemo(
    () =>
      activeFilter === "All coverage"
        ? articles
        : articles.filter((article) => article.tag === activeFilter),
    [activeFilter]
  );

  const downloadPressPage = () => {
    window.print();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050809] text-white selection:bg-cyan-300 selection:text-black">
      <style>{`
        :root { color-scheme: dark; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #050809; }
        @media print {
          nav, .no-print { display: none !important; }
          body, #uthutho-media-page { background: #050809 !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          section { break-inside: avoid; }
        }
      `}</style>

      <div id="uthutho-media-page">

        <main id="top">
          <section className="relative flex min-h-[92vh] items-center overflow-hidden pt-20">
            <div className="absolute inset-0">
              <div className="absolute -left-40 top-24 h-[520px] w-[520px] rounded-full bg-cyan-400/15 blur-[120px]" />
              <div className="absolute -right-40 bottom-0 h-[560px] w-[560px] rounded-full bg-pink-500/15 blur-[140px]" />
              <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
            </div>

            <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 md:px-8 lg:grid-cols-[1.1fr_.9fr]">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.65 }}>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-200">
                  <Award className="h-4 w-4" />
                  2026 Red Bull Basement South Africa winner
                </div>

                <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                  Moving people.
                  <span className="block bg-gradient-to-r from-cyan-300 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    Connecting communities.
                  </span>
                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-8 text-white/62 md:text-xl">
                  Uthutho is a South African public transport platform created to make everyday journeys clearer, safer and more predictable through live and community-powered information.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <a href="#coverage" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-black transition hover:bg-cyan-200">
                    Explore press coverage <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#story" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
                    Discover Uthutho
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.75, delay: 0.12 }}
                className="relative"
              >
                <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-cyan-400/25 via-pink-500/10 to-orange-400/20 blur-3xl" />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#10282c] to-[#111014] p-6 shadow-2xl">
                  <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#fd602d]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#f8c325]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#1ea2b1]" />
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/45">Community mobility</span>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-black/35 p-7">
                    <div className="mb-8 flex items-center gap-4">
                      <div className="rounded-2xl bg-white p-3">
                        <img src={LOGO_SRC} alt="Uthutho" className="h-10 w-auto" />
                      </div>
                      <div>
                        <p className="font-bold">Plan your journey</p>
                        <p className="text-sm text-white/45">Cape Town, South Africa</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: Bus, label: "Taxi and bus routes", color: BRAND.primary },
                        { icon: TrainFront, label: "Connected travel options", color: BRAND.secondary },
                        { icon: ShieldCheck, label: "Community-verified updates", color: BRAND.accent },
                      ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl p-2" style={{ backgroundColor: `${color}22`, color }}><Icon className="h-5 w-5" /></div>
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/25" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

      

        

         

          <section id="coverage" className="mx-auto max-w-7xl px-5 py-28 md:px-8">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <SectionLabel>In the news</SectionLabel>
                <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">The Uthutho story, covered across South Africa.</h2>
              </div>
              <div className="flex max-w-full gap-2 overflow-x-auto pb-2 no-print">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                      activeFilter === filter ? "bg-white text-black" : "border border-white/10 bg-white/[0.03] text-white/55 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {filteredArticles.map((article, index) => (
                <motion.article
                  layout
                  key={article.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="group flex min-h-[430px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]"
                >
                  <div className="relative h-40 overflow-hidden p-6" style={{ background: `linear-gradient(135deg, ${article.accent}33, #0a0e10 72%)` }}>
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10" />
                    <div className="absolute right-8 top-8 h-16 w-16 rounded-full border border-white/10" />
                    <Newspaper className="absolute bottom-6 left-6 h-10 w-10" style={{ color: article.accent }} />
                    <span className="absolute right-6 top-6 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
                      {article.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center justify-between gap-4 text-xs text-white/38">
                      <span className="font-semibold uppercase tracking-wider" style={{ color: article.accent }}>{article.publication}</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="mt-5 text-xl font-bold leading-7">{article.title}</h3>
                    <p className="mt-4 flex-1 text-sm leading-6 text-white/48">{article.summary}</p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white transition group-hover:text-cyan-300"
                    >
                      Read original article <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          

          <section id="journey" className="border-y border-white/10 bg-[#091012] py-28">
            <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[.7fr_1.3fr]">
              <div>
                <SectionLabel>The journey</SectionLabel>
                <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">From a local challenge to a global stage.</h2>
                <p className="mt-6 max-w-lg leading-7 text-white/48">A focused timeline of the milestones documented in public coverage of Uthutho.</p>
              </div>
              <div className="relative space-y-4 before:absolute before:bottom-5 before:left-[19px] before:top-5 before:w-px before:bg-white/10">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.date}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={fadeUp}
                    transition={{ delay: index * 0.08 }}
                    className="relative grid grid-cols-[40px_1fr] gap-5"
                  >
                    <div className="relative z-10 mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#091012]">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: item.color }}>
                        <CalendarDays className="h-4 w-4" /> {item.date}
                      </div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/48">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer id="contact" className="border-t border-white/10 bg-[#030506]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
            <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2"><img src={LOGO_SRC} alt="Uthutho" className="h-7 w-auto" /></div>
                  <p className="text-xl font-black">UTHUTHO</p>
                </div>
                <h2 className="max-w-2xl text-3xl font-black tracking-tight md:text-5xl">Let’s move the story forward.</h2>
                <p className="mt-5 text-white/45">For press, partnership and platform enquiries, contact the Uthutho team through the official website.</p>
              </div>
              <a href="mailto:brand@uthutho.com" className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 font-bold text-black transition hover:bg-cyan-300">
                Contact Uthutho <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/10 pt-7 text-xs text-white/32 md:flex-row">
              <p>© 2026 Uthutho. Media and press page.</p>
              <p>Transport information. Community connection. Smarter journeys.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;