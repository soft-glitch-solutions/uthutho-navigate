
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupportTickets } from '@/components/admin/SupportTickets';

const SupportPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          <SupportTickets />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportPage;
