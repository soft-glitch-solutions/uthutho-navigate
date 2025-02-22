import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface SettingsPageProps {
  theme: string;
  toggleTheme: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Appearance</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Theme</span>
          <Button variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 mr-2" />
            ) : (
              <Moon className="h-5 w-5 mr-2" />
            )}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
