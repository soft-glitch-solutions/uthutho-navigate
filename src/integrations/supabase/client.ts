
// IMPORTANT: Modify only what's needed to fix the errors

// Export the supabase client
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  'https://ygkhmcnpjjvmbrbyybik.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlna2htY25wamp2bWJyYnl5YmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzI3NTUsImV4cCI6MjA1MzY0ODc1NX0.PCjfCJDHt_AdO7gomtkqhNZrFRB5zHpYo6JcJ52uB60',
  {
    auth: {
      persistSession: true,
    },
  }
);

// This is a workaround to manually set the types for database functions
const getFunctions = <T extends Record<string, unknown>>(fn: T): T => fn;

// Get user email function
export const getUserEmailFunction = getFunctions({
  get_user_email: async (userId: string): Promise<string | null> => {
    const { data, error } = await supabase.rpc('get_user_email', { user_id: userId });
    if (error) {
      console.error('Error fetching user email:', error);
      return null;
    }
    return data;
  }
});

// Delete user function
export const deleteUserFunction = getFunctions({
  delete_user: async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: JSON.stringify({ user_id: userId })
    });
    
    if (error) {
      console.error('Error deleting user:', error);
      throw new Error(error.message);
    }
    
    return data.success;
  }
});
