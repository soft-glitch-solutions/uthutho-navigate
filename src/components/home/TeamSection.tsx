
import React from 'react';
import TeamMember, { TeamMemberProps } from '../TeamMember';

const teamMembers: TeamMemberProps[] = [
  {
    id: 1,
    name: 'Shaqeel Less',
    title: 'Founder & CEO',
    description: 'Shaqeel is the visionary behind Uthutho, building a smarter way for communities to navigate and access public transport information.',
    image: '/lovable-uploads/97f89484-6b1f-4dcd-ad4b-1136e91da5ab.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/shaqeellink',
      x: 'https://twitter.com/shaqeel',
      github: 'https://github.com/shaqeel',
    },
  },
  {
    id: 2,
    name: 'Delisha-Ann Naicker',
    title: 'Head of Operations & Design',
    description: 'Delisha ensures the Uthutho experience is smooth, functional, and beautifully designed — for every commuter and community.',
    image: '/lovable-uploads/delisha (1).png',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/delishasmith',
      x: 'https://twitter.com/delisha',
      github: 'https://github.com/delisha',
    },
  },
  {
    id: 3,
    name: 'Ishmael Sikhikhi',
    title: 'Quality Assurance & Software Development',
    description: 'Ishmael ensures our applications meet the highest standards through rigorous testing and quality control, while also contributing to our software development.',
    image: '/lovable-uploads/70352247.jpg',
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/ishmael',
      x: 'https://twitter.com/ishmael',
      github: 'https://github.com/ishmael',
    },
  },
];

const TeamSection = () => {
  return (
    <section id="about" className="py-12 md:py-20 bg-black">
      <div className="container px-4 mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-white">Our Team</h2>
        <p className="text-gray-300 text-center mb-8 md:mb-16 max-w-3xl mx-auto">
          Meet the dedicated team behind Uthutho, working tirelessly to transform public transport in South Africa.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member) => (
            <TeamMember
              key={member.id}
              {...member}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
