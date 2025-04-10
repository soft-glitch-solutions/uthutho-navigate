
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  LogIn, 
  LogOut,
  UserCog,
  FileEdit,
  Trash2,
  Plus,
  Clock,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserLog {
  id: string;
  user_id: string;
  action: string;
  action_type: string;
  resource_type: string;
  resource_id: string | null;
  timestamp: string;
  user_email?: string;
  user_name?: string;
  details?: string;
  ip_address?: string;
}

const actionIcons: Record<string, React.ReactNode> = {
  login: <LogIn className="h-4 w-4 mr-1" />,
  logout: <LogOut className="h-4 w-4 mr-1" />,
  create: <Plus className="h-4 w-4 mr-1" />,
  update: <FileEdit className="h-4 w-4 mr-1" />,
  delete: <Trash2 className="h-4 w-4 mr-1" />,
  view: <Clock className="h-4 w-4 mr-1" />,
  admin: <UserCog className="h-4 w-4 mr-1" />
};

const SystemLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logType, setLogType] = useState('all');
  const [dateRange, setDateRange] = useState('7'); // Days
  const { toast } = useToast();

  // Fetch system logs
  const { data: logs, isLoading } = useQuery({
    queryKey: ['system-logs', logType, dateRange],
    queryFn: async () => {
      try {
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(dateRange));
        
        let query = supabase
          .from('system_logs')
          .select(`
            *,
            profiles (
              id,
              first_name,
              last_name
            )
          `)
          .order('timestamp', { ascending: false });
        
        // Apply type filter
        if (logType !== 'all') {
          query = query.eq('action_type', logType);
        }
        
        // Apply date range filter
        query = query.gte('timestamp', startDate.toISOString());
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Format data to include user name
        const logsWithUserInfo = await Promise.all((data || []).map(async (log) => {
          // For email, we need to query a custom function since we can't access auth.users directly
          let userEmail = '';
          if (log.user_id) {
            const { data: emailData } = await supabase
              .rpc('get_user_email', { user_id: log.user_id });
              
            userEmail = emailData || '';
          }
          
          return {
            ...log,
            user_email: userEmail,
            user_name: log.profiles ? `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() : 'Unknown'
          };
        }));
        
        return logsWithUserInfo;
      } catch (error) {
        console.error('Error fetching system logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch system logs.',
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  // Filter logs based on search term
  const filteredLogs = logs?.filter(log => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (log.user_name && log.user_name.toLowerCase().includes(searchTermLower)) ||
      (log.user_email && log.user_email.toLowerCase().includes(searchTermLower)) ||
      log.action.toLowerCase().includes(searchTermLower) ||
      log.resource_type.toLowerCase().includes(searchTermLower) ||
      (log.details && log.details.toLowerCase().includes(searchTermLower))
    );
  });

  const getActionBadgeVariant = (actionType: string) => {
    switch (actionType) {
      case 'create': return 'default';
      case 'update': return 'outline';
      case 'delete': return 'destructive';
      case 'login': return 'secondary';
      case 'logout': return 'secondary';
      case 'admin': return 'destructive';
      case 'view': return 'outline';
      default: return 'secondary';
    }
  };

  const handleExportCsv = () => {
    if (!filteredLogs || filteredLogs.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no logs available to export.',
        variant: 'destructive',
      });
      return;
    }

    // Convert logs to CSV format
    const headers = ['Timestamp', 'User', 'Email', 'Action', 'Type', 'Resource', 'Resource ID', 'Details', 'IP Address'];
    const csvData = filteredLogs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.user_name,
      log.user_email,
      log.action,
      log.action_type,
      log.resource_type,
      log.resource_id || '',
      log.details || '',
      log.ip_address || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">System Logs</h2>
        <p className="text-muted-foreground">Track user activity and system events</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Filter Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Log Type</label>
              <Select value={logType} onValueChange={setLogType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select log type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="admin">Admin Actions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Period</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={handleExportCsv}
              disabled={!filteredLogs || filteredLogs.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all-logs" className="w-full">
        <TabsList className="grid w-full md:w-[500px] grid-cols-3">
          <TabsTrigger value="all-logs">All Logs</TabsTrigger>
          <TabsTrigger value="admin-logs">Admin Logs</TabsTrigger>
          <TabsTrigger value="auth-logs">Authentication</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-logs" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No logs found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs?.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <div className="flex items-center">
                        <Badge variant={getActionBadgeVariant(log.action_type)} className="mr-2 flex items-center">
                          {actionIcons[log.action_type] || <Clock className="h-4 w-4 mr-1" />}
                          {log.action_type}
                        </Badge>
                        <span className="text-sm font-medium">{log.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 md:mt-0">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">User:</span>{' '}
                        {log.user_name} ({log.user_email || 'No email'})
                      </div>
                      <div>
                        <span className="font-medium">Resource:</span>{' '}
                        {log.resource_type} {log.resource_id ? `(${log.resource_id.substring(0, 8)}...)` : ''}
                      </div>
                    </div>
                    
                    {log.details && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Details:</span> {log.details}
                      </div>
                    )}
                    
                    {log.ip_address && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        IP: {log.ip_address}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="admin-logs" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs?.filter(log => log.action_type === 'admin').length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No admin logs found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs?.filter(log => log.action_type === 'admin').map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    {/* Same structure as above, just filtered for admin logs */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <div className="flex items-center">
                        <Badge variant="destructive" className="mr-2 flex items-center">
                          <UserCog className="h-4 w-4 mr-1" />
                          {log.action_type}
                        </Badge>
                        <span className="text-sm font-medium">{log.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 md:mt-0">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">User:</span>{' '}
                        {log.user_name} ({log.user_email || 'No email'})
                      </div>
                      <div>
                        <span className="font-medium">Resource:</span>{' '}
                        {log.resource_type} {log.resource_id ? `(${log.resource_id.substring(0, 8)}...)` : ''}
                      </div>
                    </div>
                    
                    {log.details && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Details:</span> {log.details}
                      </div>
                    )}
                    
                    {log.ip_address && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        IP: {log.ip_address}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="auth-logs" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs?.filter(log => log.action_type === 'login' || log.action_type === 'logout').length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No authentication logs found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs?.filter(log => log.action_type === 'login' || log.action_type === 'logout').map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    {/* Same structure as above, just filtered for auth logs */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <div className="flex items-center">
                        <Badge variant="secondary" className="mr-2 flex items-center">
                          {log.action_type === 'login' ? (
                            <LogIn className="h-4 w-4 mr-1" />
                          ) : (
                            <LogOut className="h-4 w-4 mr-1" />
                          )}
                          {log.action_type}
                        </Badge>
                        <span className="text-sm font-medium">{log.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 md:mt-0">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">User:</span>{' '}
                        {log.user_name} ({log.user_email || 'No email'})
                      </div>
                    </div>
                    
                    {log.details && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Details:</span> {log.details}
                      </div>
                    )}
                    
                    {log.ip_address && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        IP: {log.ip_address}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemLogsPage;
