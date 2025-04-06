
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/50 transition-all overflow-hidden">
      <div className="relative">
        <div className="relative w-full h-64 overflow-hidden">
          <img 
            src={image} 
            alt={`${name} - ${title}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
      </div>
      <CardContent className="p-6 relative z-10">
        <h3 className="text-xl font-semibold mb-1 text-white">{name}</h3>
        <p className="text-primary font-medium mb-3">{title}</p>
        <p className="text-gray-300 text-sm mb-4">{description}</p>
        
        {socialLinks && (
          <div className="flex space-x-3 mt-4">
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
            {socialLinks.x && (
              <a 
                href={socialLinks.x} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter size={18} />
              </a>
            )}
            {socialLinks.github && (
              <a 
                href={socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Github size={18} />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMember;
