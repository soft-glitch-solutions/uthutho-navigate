
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatDateTime } from '@/utils/dateUtils';
import { Download, FileDown, Filter, Calendar as CalendarIcon } from 'lucide-react';

interface SystemLog {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  details: string;
  user_email?: string;
  user_name?: string;
}

const SystemLogsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  
  // Fetch logs from Supabase
  const { data: logs, isLoading } = useQuery({
    queryKey: ['systemLogs'],
    queryFn: async () => {
      // In a real implementation, you would fetch from a system_logs table
      // For this demo, we'll just return a mock data array
      const mockLogs: SystemLog[] = [
        {
          id: '1',
          user_id: 'user1',
          action: 'LOGIN',
          timestamp: new Date().toISOString(),
          details: 'User logged in',
          user_email: 'user1@example.com',
          user_name: 'John Doe'
        },
        {
          id: '2',
          user_id: 'user2',
          action: 'CREATE',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'Created a new hub',
          user_email: 'user2@example.com',
          user_name: 'Jane Smith'
        },
        {
          id: '3',
          user_id: 'user1',
          action: 'UPDATE',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: 'Updated route information',
          user_email: 'user1@example.com',
          user_name: 'John Doe'
        },
        {
          id: '4',
          user_id: 'user3',
          action: 'DELETE',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          details: 'Deleted a stop',
          user_email: 'user3@example.com',
          user_name: 'Alex Johnson'
        }
      ];
      
      return mockLogs;
    }
  });
  
  // Apply filters to logs
  const filteredLogs = logs?.filter(log => {
    // Apply date filter
    if (selectedDate) {
      const logDate = new Date(log.timestamp);
      if (
        logDate.getDate() !== selectedDate.getDate() ||
        logDate.getMonth() !== selectedDate.getMonth() ||
        logDate.getFullYear() !== selectedDate.getFullYear()
      ) {
        return false;
      }
    }
    
    // Apply search filter
    if (searchTerm && !log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.details.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply action filter
    if (actionFilter !== 'all' && log.action !== actionFilter) {
      return false;
    }
    
    return true;
  });
  
  // Export logs as CSV
  const exportLogsAsCSV = () => {
    if (!filteredLogs?.length) return;
    
    const headers = ['Date', 'Time', 'User', 'Email', 'Action', 'Details'];
    const csvData = filteredLogs.map(log => {
      const logDate = new Date(log.timestamp);
      return [
        logDate.toLocaleDateString(),
        logDate.toLocaleTimeString(),
        log.user_name,
        log.user_email,
        log.action,
        log.details
      ];
    });
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">System Logs</h1>
          <p className="text-muted-foreground">Track user activity and system events</p>
        </div>
        <Button variant="outline" onClick={exportLogsAsCSV}>
          <FileDown className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by user or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                {selectedDate ? formatDate(selectedDate.toISOString()) : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={setSelectedDate}
                initialFocus
              />
              {selectedDate && (
                <div className="p-3 border-t border-border">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedDate(null)}>
                    Clear date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="p-1">
          <Card className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs && filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 text-sm">{formatDateTime(log.timestamp)}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{log.user_name}</div>
                        <div className="text-xs text-muted-foreground">{log.user_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-block px-2 py-1 text-xs rounded-full ${
                          log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800' : 
                          log.action === 'CREATE' ? 'bg-green-100 text-green-800' : 
                          log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.action}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{log.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      No logs found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredLogs && filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{log.user_name}</h3>
                      <p className="text-sm text-muted-foreground">{log.user_email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800' : 
                        log.action === 'CREATE' ? 'bg-green-100 text-green-800' : 
                        log.action === 'UPDATE' ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.action}
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDateTime(log.timestamp)}</span>
                    </div>
                  </div>
                  <div className="mt-2 p-3 bg-muted/30 rounded">
                    <p className="text-sm">{log.details}</p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                No logs found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemLogsPage;
