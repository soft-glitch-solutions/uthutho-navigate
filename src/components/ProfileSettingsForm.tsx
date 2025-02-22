import { Button } from '@/components/ui/button';

interface ProfileSettingsFormProps {
  profile: { firstName: string; lastName: string; email: string };
  setProfile: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; email: string }>>;
  handleProfileUpdate: (e: React.FormEvent) => void;
}

const ProfileSettingsForm = ({ profile, setProfile, handleProfileUpdate }: ProfileSettingsFormProps) => {
  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Profile Settings</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className="w-full p-2 rounded-md bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="w-full p-2 rounded-md bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full p-2 rounded-md bg-background/50 border border-border text-foreground/50"
          />
        </div>
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </div>
  );
};

export default ProfileSettingsForm;
