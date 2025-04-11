
import React from 'react';

export interface SettingsPageProps {
  theme: string;
  toggleTheme: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, toggleTheme }) => {
  return (
    <div>
      <h1>Settings</h1>
      <div>
        <h2>Theme</h2>
        <button onClick={toggleTheme}>
          Current theme: {theme}. Click to toggle.
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
