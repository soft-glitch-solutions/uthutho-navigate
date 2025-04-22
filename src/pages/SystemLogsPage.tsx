
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Filter, Search } from 'lucide-react';

interface SystemLog {
  id: string;
  created_at: string;
  user_id?: string;
  action: string;
  details?: Record<string, any>;
  entity_type?: string;
  entity_id?: string;
  status?: string;
  user?: {
    email?: string;
    name?: string;
  };
}

const SystemLogsPage = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['system-logs', filterType, filterStatus, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('system_logs')
        .select(`
          *,
          user:users!user_id (
            email,
            raw_user_meta_data->>'name' as name
          )
        `)
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('entity_type', filterType);
      }
      
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (searchTerm) {
        query = query.or(`details.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%,entity_id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching system logs:', error);
        return [];
      }

      // Convert log data to the correct type
      const typedLogs: SystemLog[] = data.map(log => ({
        id: log.id,
        created_at: log.created_at,
        user_id: log.user_id,
        action: log.action,
        details: log.details,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        status: log.status,
        user: log.user ? {
          email: log.user.email,
          name: log.user.name
        } : undefined
      }));

      return typedLogs;
    },
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['system-logs'] });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-destructive';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">System Activity Logs</CardTitle>
          <Button onClick={handleRefresh} size="icon" variant="ghost">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hub">Hub</SelectItem>
                  <SelectItem value="stop">Stop</SelectItem>
                  <SelectItem value="route">Route</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading logs...</p>
            </div>
          ) : logs && logs.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="w-[80px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>
                        {log.user?.name || log.user?.email || 'System'}
                      </TableCell>
                      <TableCell>
                        {log.entity_type && (
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                              {log.entity_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {log.entity_id}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {log.details && typeof log.details === 'object'
                          ? JSON.stringify(log.details)
                          : log.details || '-'}
                      </TableCell>
                      <TableCell>
                        {log.status && (
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
                                log.status
                              )}`}
                            ></div>
                            <span className="capitalize text-xs">{log.status}</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No logs found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogsPage;
