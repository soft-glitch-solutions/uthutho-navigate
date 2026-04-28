
import { Github, Linkedin, Twitter } from 'lucide-react';

interface SocialLinks {
  linkedin?: string;
  x?: string;
  github?: string;
}

export interface TeamMemberProps {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  socialLinks?: SocialLinks;
}

const TeamMember = ({ name, title, description, image, socialLinks }: TeamMemberProps) => {
  return (
    <div className="bg-muted-darker/50 rounded-2xl overflow-hidden group border border-glass hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative w-full h-72">
        <img 
          src={image} 
          alt={`${name} - ${title}`} 
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="text-2xl font-semibold text-white">{name}</h3>
          <p className="text-primary font-medium">{title}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-400 text-sm mb-4 h-24 overflow-hidden">{description}</p>
        
        {socialLinks && (
          <div className="flex space-x-4 mt-4">
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}
            {socialLinks.x && (
              <a 
                href={socialLinks.x} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </a>
            )}
            {socialLinks.github && (
              <a 
                href={socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Github size={20} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMember;
