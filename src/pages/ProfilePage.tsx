
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePageProps {
  onProfileUpdate: (profile: { firstName: string; lastName: string; avatar: string | null }) => void;
  onAvatarChange: (avatar: string | null) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onProfileUpdate, onAvatarChange }) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'User', // Default role
    avatar: null as string | null,
  });
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the current user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user:', userError.message);
        setIsLoading(false);
        return;
      }

      if (userData && userData.user) {
        // Fetch user profile data from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          setIsLoading(false);
        } else {
          // Get user role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userData.user.id)
            .single();

          const userRole = roleData?.role || 'User';
          
          setProfile({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            email: userData.user.email || '',
            role: userRole,
            avatar: profileData.avatar_url || null,
          });
          
          setUpdatedProfile({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            email: userData.user.email || '',
            role: userRole,
            avatar: profileData.avatar_url || null,
          });
          
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const avatarUrl = reader.result as string;
        setUpdatedProfile({ ...updatedProfile, avatar: avatarUrl });
        setEditingAvatar(false);
        onAvatarChange(avatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();

    if (userData && userData.user) {
      const updatedData = {
        first_name: updatedProfile.firstName,
        last_name: updatedProfile.lastName,
        avatar_url: updatedProfile.avatar,
      };

      // Update the user profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert([{ ...updatedData, id: userData.user.id }]);

      if (error) {
        console.error('Error updating profile:', error.message);
      } else {
        onProfileUpdate({
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          avatar: updatedProfile.avatar
        });
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-foreground mb-6">Profile Settings</h2>

      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={updatedProfile.avatar || '/default-avatar.png'}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full object-cover border-2 border-primary"
          />
          <Button
            variant="ghost"
            className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full"
            onClick={() => setEditingAvatar(true)}
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-foreground">{updatedProfile.firstName} {updatedProfile.lastName}</h3>
          <p className="text-sm text-foreground/70">{updatedProfile.role}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button type="submit" className="w-full mt-4">
          Save Changes
        </Button>
      </form>

      {/* Modal for Avatar Upload */}
      {editingAvatar && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
          onClick={() => setEditingAvatar(false)} // Close modal on outside click
        >
          <div
            className="bg-white p-6 rounded-md w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Upload Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="block w-full p-2 mb-4"
            />
            <Button
              onClick={() => setEditingAvatar(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
