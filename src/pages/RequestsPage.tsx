
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { RequestList } from '@/components/requests/RequestList';
import { useRequestsData } from '@/hooks/useRequestsData';

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState('hub-requests');
  const {
    hubRequests,
    routeRequests,
    priceChangeRequests,
    stopRequests,
    loading,
    handleApproveRequest,
    handleRejectRequest
  } = useRequestsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">Requests Management</h2>
        <p className="text-muted-foreground">Review and manage user-submitted requests</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-4">
          <TabsTrigger value="hub-requests">Hub Requests</TabsTrigger>
          <TabsTrigger value="route-requests">Route Requests</TabsTrigger>
          <TabsTrigger value="stop-requests">Stop Requests</TabsTrigger>
          <TabsTrigger value="price-requests">Price Changes</TabsTrigger>
        </TabsList>
        
        {/* Hub Requests Tab */}
        <TabsContent value="hub-requests" className="mt-6">
          <RequestList 
            type="hub" 
            requests={hubRequests} 
            onApprove={handleApproveRequest} 
            onReject={handleRejectRequest} 
          />
        </TabsContent>
        
        {/* Route Requests Tab */}
        <TabsContent value="route-requests" className="mt-6">
          <RequestList 
            type="route" 
            requests={routeRequests} 
            onApprove={handleApproveRequest} 
            onReject={handleRejectRequest} 
          />
        </TabsContent>
        
        {/* Stop Requests Tab */}
        <TabsContent value="stop-requests" className="mt-6">
          <RequestList 
            type="stop" 
            requests={stopRequests} 
            onApprove={handleApproveRequest} 
            onReject={handleRejectRequest} 
          />
        </TabsContent>
        
        {/* Price Change Requests Tab */}
        <TabsContent value="price-requests" className="mt-6">
          <RequestList 
            type="price" 
            requests={priceChangeRequests} 
            onApprove={handleApproveRequest} 
            onReject={handleRejectRequest} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsPage;
