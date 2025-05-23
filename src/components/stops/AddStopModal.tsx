
import React, { useEffect } from 'react';
import { Stop, Route, Hub } from '@/types/stops';
import { StopForm } from './StopForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStop: Stop | null;
  setSelectedStop: React.Dispatch<React.SetStateAction<Stop | null>>;
  googleMapsUrl: string;
  setGoogleMapsUrl: React.Dispatch<React.SetStateAction<string>>;
  handleGoogleMapsUrlChange: (url: string) => void;
  routes?: Route[];
  hubs?: Hub[];
  selectedRoutes: string[];
  selectedHubs: string[];
  toggleRouteSelection: (routeId: string) => void;
  toggleHubSelection: (hubId: string) => void;
  routeOrderNumbers: Record<string, number>;
  setRouteOrderNumbers: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  hubDistances: Record<string, number>;
  setHubDistances: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddStopModal = ({
  isOpen,
  onClose,
  selectedStop,
  setSelectedStop,
  googleMapsUrl,
  setGoogleMapsUrl,
  handleGoogleMapsUrlChange,
  routes = [],
  hubs = [],
  selectedRoutes,
  selectedHubs,
  toggleRouteSelection,
  toggleHubSelection,
  routeOrderNumbers,
  setRouteOrderNumbers,
  hubDistances,
  setHubDistances,
  onSubmit
}: AddStopModalProps) => {
  const { toast } = useToast();

  // Log activity when stop is added or edited
  useEffect(() => {
    if (isOpen) {
      const action = selectedStop ? 'view_stop_edit' : 'view_stop_add';
      logUserActivity(action, {
        stop_id: selectedStop?.id || null,
        timestamp: new Date().toISOString()
      });
    }
  }, [isOpen, selectedStop]);

  // Function to log user activity
  const logUserActivity = async (action: string, details: any) => {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert([
          { 
            action, 
            details,
            page_url: window.location.href,
            user_agent: navigator.userAgent
          }
        ]);
      
      if (error) {
        console.error('Failed to log activity:', error);
      }
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  // Enhanced submit handler with activity logging
  const handleSubmit = async (e: React.FormEvent) => {
    onSubmit(e);
    
    // Log the submission activity
    await logUserActivity(
      selectedStop ? 'edit_stop_submit' : 'add_stop_submit', 
      {
        stop_data: {
          id: selectedStop?.id || null,
          selected_routes: selectedRoutes,
          selected_hubs: selectedHubs,
          timestamp: new Date().toISOString()
        }
      }
    );

    toast({
      title: `Stop ${selectedStop ? 'Updated' : 'Added'}`,
      description: `The stop has been successfully ${selectedStop ? 'updated' : 'added'}.`,
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[700px] bg-background shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedStop ? 'Edit Stop' : 'Add New Stop'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <StopForm
            selectedStop={selectedStop}
            setSelectedStop={setSelectedStop}
            googleMapsUrl={googleMapsUrl}
            setGoogleMapsUrl={setGoogleMapsUrl}
            handleGoogleMapsUrlChange={handleGoogleMapsUrlChange}
            routes={routes}
            hubs={hubs}
            selectedRoutes={selectedRoutes}
            selectedHubs={selectedHubs}
            toggleRouteSelection={toggleRouteSelection}
            toggleHubSelection={toggleHubSelection}
            routeOrderNumbers={routeOrderNumbers}
            setRouteOrderNumbers={setRouteOrderNumbers}
            hubDistances={hubDistances}
            setHubDistances={setHubDistances}
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitButtonText={selectedStop ? 'Update Stop' : 'Add Stop'}
          />
        </div>
      </div>
    </>
  );
};
