
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStopsData } from '@/hooks/useStopsData';
import { StopCard } from '@/components/stops/StopCard';
import { EditStopModal } from '@/components/stops/EditStopModal';
import { AddStopModal } from '@/components/stops/AddStopModal';
import { DeleteStopModal } from '@/components/stops/DeleteStopModal';

const StopsPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedStop,
    setSelectedStop,
    isEditModalOpen,
    setIsEditModalOpen,
    isNewStopModalOpen,
    setIsNewStopModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    googleMapsUrl,
    setGoogleMapsUrl,
    selectedRoutes,
    selectedHubs,
    routeOrderNumbers,
    setRouteOrderNumbers,
    hubDistances,
    setHubDistances,
    filteredStops,
    stopsLoading,
    routes,
    hubs,
    handleGoogleMapsUrlChange,
    handleStopEdit,
    handleNewStop,
    toggleRouteSelection,
    toggleHubSelection,
    handleEditStop,
    getRoutesForStop,
    getHubsForStop,
    deleteStop,
    createEmptyStop
  } = useStopsData();

  return (
    <div className="p-8">
      {/* Search Input and Add Button */}
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search Stops"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded-md border border-border w-full"
        />
        <Button
          onClick={createEmptyStop}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Stop
        </Button>
      </div>

      {/* Stops List */}
      <div className="space-y-4">
        {stopsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredStops?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No stops found</div>
        ) : (
          filteredStops?.map((stop) => (
            <StopCard
              key={stop.id}
              stop={stop}
              onEdit={handleEditStop}
              onDelete={(stop) => {
                setSelectedStop(stop);
                setIsDeleteModalOpen(true);
              }}
              getRoutesForStop={getRoutesForStop}
              getHubsForStop={getHubsForStop}
            />
          ))
        )}
      </div>

      {/* Edit Stop Modal */}
      <EditStopModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
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
        onSubmit={handleStopEdit}
      />

      {/* New Stop Modal */}
      <AddStopModal
        isOpen={isNewStopModalOpen}
        onClose={() => setIsNewStopModalOpen(false)}
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
        onSubmit={handleNewStop}
      />

      {/* Delete Confirmation Modal */}
      <DeleteStopModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        stop={selectedStop}
        deleteStop={deleteStop}
      />
    </div>
  );
};

export default StopsPage;
