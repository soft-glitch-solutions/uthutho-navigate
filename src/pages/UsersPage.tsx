
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import UserTable from '@/components/UserTable';
import { useToast } from '@/components/ui/use-toast';
import UsersManagement from '@/components/admin/UsersManagement';

const UsersPage = () => {
  // This component now serves as a wrapper for the UsersManagement component
  return <UsersManagement />;
};

export default UsersPage;
