
import React from 'react';
import { Stop, Route, Hub } from '@/types/stops';
import { StopForm } from './StopForm';

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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background p-6 rounded-md w-full md:w-[700px] mx-auto mt-20 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Add New Stop</h3>
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
          onSubmit={onSubmit}
          onCancel={onClose}
          submitButtonText="Add Stop"
        />
      </div>
    </div>
  );
};
