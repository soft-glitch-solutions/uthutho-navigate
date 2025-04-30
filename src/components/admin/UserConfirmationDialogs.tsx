
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserConfirmationDialogsProps {
  userToDelete: string | null;
  userToBan: {id: string, email: string, isBanned: boolean} | null;
  onCloseDeleteDialog: () => void;
  onCloseBanDialog: () => void;
  onConfirmDelete: () => void;
  onConfirmBan: () => void;
}

const UserConfirmationDialogs = ({
  userToDelete,
  userToBan,
  onCloseDeleteDialog,
  onCloseBanDialog,
  onConfirmDelete,
  onConfirmBan
}: UserConfirmationDialogsProps) => {
  return (
    <>
      {/* Delete User Confirmation Dialog */}
      <AlertDialog 
        open={!!userToDelete} 
        onOpenChange={onCloseDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete} 
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban User Confirmation Dialog */}
      <AlertDialog 
        open={!!userToBan} 
        onOpenChange={onCloseBanDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToBan?.isBanned ? 'Unban User' : 'Ban User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToBan ? 
                (userToBan.isBanned 
                  ? `Are you sure you want to unban ${userToBan.email || 'this user'}?`
                  : `Are you sure you want to ban ${userToBan.email || 'this user'}?`) 
                : 'Are you sure you want to update this user?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmBan}
              className={userToBan?.isBanned ? '' : 'bg-destructive'}
            >
              {userToBan?.isBanned ? 'Unban' : 'Ban'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserConfirmationDialogs;
