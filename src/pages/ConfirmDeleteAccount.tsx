
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ConfirmDeleteAccount = () => {
  const [user, setUser] = useState<any>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/delete-account');
        return;
      }
      setUser(data.session.user);
    };
    
    checkUser();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (!confirmed) {
      toast({
        title: 'Confirmation Required',
        description: 'Please confirm that you want to delete your account by checking the box.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (profileError) {
        throw profileError;
      }
      
      // Delete user authentication
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        throw error;
      }
      
      // Sign out the user
      await supabase.auth.signOut();
      
      toast({
        title: 'Account Deleted',
        description: 'Your account and data have been successfully deleted.',
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Deletion Failed',
        description: error.message || 'An error occurred while deleting your account. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link to="/delete-account" className="text-primary hover:underline mb-8 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
        </Link>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-destructive">Confirm Account Deletion</CardTitle>
            <CardDescription>
              This action is permanent and cannot be undone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-3 rounded-md text-muted-foreground">
              <p className="font-medium mb-2">The following will be permanently deleted:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your account ({user.email})</li>
                <li>All your profile information</li>
                <li>All your saved locations and preferences</li>
                <li>Your contribution history</li>
              </ul>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="confirm" 
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked === true)}
              />
              <Label htmlFor="confirm" className="text-sm font-medium leading-none cursor-pointer">
                I understand that this action cannot be undone and I want to permanently delete my account and all associated data
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="destructive" 
              className="w-full" 
              disabled={!confirmed || loading}
              onClick={handleDeleteAccount}
            >
              {loading ? 'Deleting Account...' : 'Permanently Delete My Account'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Cancel and Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmDeleteAccount;
