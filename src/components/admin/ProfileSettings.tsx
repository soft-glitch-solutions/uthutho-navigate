
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileSettings = () => {
  const [profile, setProfile] = useState<Profile>({
    firstName: '',
    lastName: '',
    email: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: user.email || '',
        });
      }
    }
  };

  const updateProfile = useMutation({
    mutationFn: async (updatedProfile: Profile) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedProfile.firstName,
          last_name: updatedProfile.lastName
        })
        .eq('id', user.id);

      if (error) throw error;
      return updatedProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(profile);
  };

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className="w-full p-2 rounded-md bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="w-full p-2 rounded-md bg-background border border-border text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full p-2 rounded-md bg-background/50 border border-border text-foreground/50"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
