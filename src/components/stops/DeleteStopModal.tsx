
import React from 'react';
import { Stop } from '@/types/stops';
import { Button } from '@/components/ui/button';
import { UseMutationResult } from '@tanstack/react-query';

interface DeleteStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: Stop | null;
  deleteStop: UseMutationResult<any, Error, string, unknown>;
}

export const DeleteStopModal = ({ isOpen, onClose, stop, deleteStop }: DeleteStopModalProps) => {
  if (!isOpen || !stop) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background p-6 rounded-md w-full md:w-[500px] mx-auto mt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p>Are you sure you want to delete the stop "{stop.name}"?</p>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          This action cannot be undone. All associated route and hub relationships will also be deleted.
        </p>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={() => deleteStop.mutate(stop.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
