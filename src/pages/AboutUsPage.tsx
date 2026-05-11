import React from 'react';
import TeamMember, { TeamMemberProps } from '../components/TeamMember';

const teamMembers: TeamMemberProps[] = [
  {
    id: 1,
    name: 'Shaqeel Less',
    title: 'Founder',
    description: 'Shaqeel is the visionary behind Uthutho, building a smarter way for communities to navigate and access public transport information.',
    image: '/lovable-uploads/shaqeel.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/shaqeel-less-11979a186?originalSubdomain=za',
    },
  },
  {
    id: 4,
    name: 'Makhi Mangxola',
    title: 'Co-Founder',
    description: 'Makhi drives Uthutho’s product strategy by bridging technical development with business needs. He leads business analysis, defines system requirements, supports data-driven decision-making, and works closely with developers to ensure scalable, market-ready transport solutions aligned with Uthutho’s growth goals.',
    image: '/lovable-uploads/makhi.jpeg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/makhi-mangxola-4b740718b/',
    },
  },
  {
    id: 2,
    name: 'Delisha-Ann Naicker',
    title: 'Head of Business Operations',
    description: 'Delisha ensures the Uthutho experience is smooth, functional, and beautifully designed — for every commuter and community.',
    image: '/lovable-uploads/delisha.jpeg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/delisha-ann-n-710879115/',
    },
  },
    {
    id: 7,
    name: 'Naeema Less',
    title: 'Head of Network Growth',
    description: 'Naeema oversees data accuracy and system integrity, ensuring seamless information management and reliability across all platforms.',
    image: '/lovable-uploads/Naeema.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/naeema-less-77b9a31a9/',
    },
  },
  {
    id: 9,
    name: 'Waseem Dollie',
    title: 'Business Analyst & Developer',
    description: 'Waseem ensures Uthutho’s systems and processes align with governance best practices, supporting compliance, structure, and sustainable platform growth.',
    image: '/lovable-uploads/waseem.jpg', // update when you have the image
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/waseemdollie/',
    },
  },
  {
    id: 3,
    name: 'Zeyn Kisten',
    title: 'Business Development & Account Manager',
    description: 'Zeyn brings financial expertise to Uthutho, ensuring sound financial planning, analysis, and sustainability as we scale our transport solutions across communities.',
    image: '/lovable-uploads/zeyn.jpeg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/zeyn-kisten/',
    },
  },
  {
    id: 8,
    name: 'Zacharia Solomons',
    title: 'Brand Ambassador, UI/UX Tester & Support',
    description: 'Zacharia contributes to Uthutho growth by identifying new opportunities, supporting partnerships, and helping align business initiatives with community needs.',
    image: '/lovable-uploads/zac.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/naeema-less-77b9a31a9/',
    },
  },
  {
    id: 5,
    name: 'Ishmael Sikhikhi',
    title: 'Brand Ambassador, UI/UX Tester & Support',
    description: 'Ishmael ensures our applications meet the highest standards through rigorous testing and quality control, while also contributing to our software development.',
    image: '/lovable-uploads/Ishmeal.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/ishmael-sikhikhi-2b8086126/?originalSubdomain=za',
    },
  },
  {
    id: 6,
    name: 'Eben Jacobs',
    title: 'Developer & Network Mapper',
    description: 'Eben meticulously tests our software to identify issues, improve performance, and ensure every product release is reliable and user-friendly.',
    image: '/lovable-uploads/eben.jpeg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/eben-jacobs-92090037a/',
    },
  },
  {
    id: 10,
    name: 'Aakifah Moosa',
    title: 'Network Mapper',
    description: 'Aakifah is responsible for mapping and maintaining our network infrastructure, ensuring the highest levels of performance and reliability.',
    image: '/lovable-uploads/aakifah.jpeg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/aakifah-moosa/',
    },
  },
];

const AboutUsPage = () => {
  return (
    <div className="bg-black text-white">
      <header className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary tracking-[2px] text-sm font-bold">OUR TEAM</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mt-4">
              The People Behind the Mission
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
              Meet the dedicated individuals working to transform public transport in South Africa. Our team combines expertise in technology, design, and community engagement to build solutions that make a difference.
            </p>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">Our Mission & Vision</h2>
              <p className="text-gray-400 mb-6">
                Our mission is to empower commuters with reliable, real-time information, making public transport more accessible and efficient for everyone. We envision a future where technology seamlessly connects communities, reduces congestion, and promotes sustainable urban mobility across Africa.
              </p>
              <h3 className="text-2xl font-light text-white mb-3">Our Goals</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Expand our network to cover all major routes in South Africa.</li>
                <li>Continuously innovate to deliver a user-friendly experience.</li>
                <li>Foster partnerships with transport operators and local communities.</li>
                <li>Promote sustainable transport solutions for a greener future.</li>
              </ul>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden border border-glass">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 backdrop-blur-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/lovable-uploads/e9056cae-b62d-4515-aae1-ac0e16261d24.png" alt="Uthutho Artwork" className="w-40 h-40 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-light text-white sm:text-4xl xl:text-5xl mt-4">
            Meet the Team
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamMember key={member.id} {...member} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AboutUsPage;
