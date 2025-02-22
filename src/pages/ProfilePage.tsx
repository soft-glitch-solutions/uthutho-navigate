import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProfilePageProps {
  profile: { firstName: string; lastName: string; email: string };
  onProfileUpdate: (profile: { firstName: string; lastName: string }) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onProfileUpdate }) => {
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(updatedProfile);
  };

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
          <input
            type="text"
            value={updatedProfile.firstName}
            onChange={(e) => setUpdatedProfile({ ...updatedProfile, firstName: e.target.value })}
            className="w-full p-2 rounded-md bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
          <input
            type="text"
            value={updatedProfile.lastName}
            onChange={(e) => setUpdatedProfile({ ...updatedProfile, lastName: e.target.value })}
            className="w-full p-2 rounded-md bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input
            type="email"
            value={updatedProfile.email}
            disabled
            className="w-full p-2 rounded-md bg-background/50 border border-border text-foreground/50"
          />
        </div>
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
