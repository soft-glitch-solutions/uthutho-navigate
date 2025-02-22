import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface SettingsPageProps {
  theme: string;
  toggleTheme: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, toggleTheme }) => {
  const [language, setLanguage] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [layout, setLayout] = useState('grid');
  
  // Admin-specific states
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [apiKey, setApiKey] = useState('');  // Example of API key management
  const [logs, setLogs] = useState<string[]>([]);  // Example of system logs (could be fetched from an API)
  const [userCount, setUserCount] = useState(0);  // Example of user management

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleNotificationsChange = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayout(e.target.value);
  };

  const handleMaintenanceModeToggle = () => {
    setIsMaintenanceMode(!isMaintenanceMode);
  };

  const generateApiKey = () => {
    setApiKey(Math.random().toString(36).substr(2, 16));  // Example of API key generation
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handleUserCountUpdate = (newCount: number) => {
    setUserCount(newCount);
  };

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Settings</h2>
      
      {/* Theme Settings */}
      <div className="space-y-4 mb-6">
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

      {/* Language Selection */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Language</span>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="p-2 rounded-md border border-border bg-background"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Enable Notifications</span>
          <Button variant="outline" onClick={handleNotificationsChange}>
            {notificationsEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>

      {/* Font Size Settings */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Font Size</span>
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            className="p-2 rounded-md border border-border bg-background"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* Layout Preferences */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-foreground">Layout</span>
          <select
            value={layout}
            onChange={handleLayoutChange}
            className="p-2 rounded-md border border-border bg-background"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
      </div>

      {/* Admin-specific Settings */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-foreground mb-4">Admin Settings</h3>

        {/* Maintenance Mode */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-foreground">Maintenance Mode</span>
            <Button variant="outline" onClick={handleMaintenanceModeToggle}>
              {isMaintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
            </Button>
          </div>
        </div>

        {/* API Key */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-foreground">API Key</span>
            <Button variant="outline" onClick={generateApiKey}>
              Generate New API Key
            </Button>
          </div>
          {apiKey && <p className="text-sm text-foreground mt-2">Your API Key: {apiKey}</p>}
        </div>

        {/* System Logs */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-foreground">System Logs</span>
            <Button variant="outline" onClick={clearLogs}>
              Clear Logs
            </Button>
          </div>
          {logs.length > 0 ? (
            <ul className="mt-2 text-foreground text-sm">
              {logs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          ) : (
            <p>No logs available.</p>
          )}
        </div>

        {/* User Management */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-foreground">Total Users</span>
            <p className="text-foreground text-lg">{userCount}</p>
          </div>
          <Button variant="outline" onClick={() => handleUserCountUpdate(userCount + 1)}>
            Increment User Count
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
