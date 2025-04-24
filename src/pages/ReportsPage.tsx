import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, ShieldAlert, BarChart, Clock, Users, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
}

interface DeploymentLog {
  id: string;
  version: string;
  status: string;
  changes: string[];
  deployed_by: string | null;
  completed_at: string;
  created_at: string;
}

const ReportsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const navigate = useNavigate();

  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const mockReports: Report[] = [
        {
          id: 'system-logs',
          title: 'System Logs',
          description: 'Complete log of all user activities and system events',
          date: new Date().toISOString(),
          type: 'system'
        },
        {
          id: '1',
          title: 'Monthly Traffic Summary',
          description: 'Summary of all traffic across hubs for the month',
          date: '2023-04-01',
          type: 'traffic'
        },
        {
          id: '2',
          title: 'User Activity Report',
          description: 'Analysis of user engagement and activity',
          date: '2023-04-10',
          type: 'user'
        },
        {
          id: '3',
          title: 'Route Performance',
          description: 'Performance metrics for all routes',
          date: '2023-04-15',
          type: 'route'
        }
      ];
      return mockReports;
    },
  });

  const { data: deploymentLogs, isLoading: isLoadingDeployments } = useQuery({
    queryKey: ['deployment-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deployment_logs')
        .select(`
          *,
          profiles!deployment_logs_deployed_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching deployment logs:', error);
        throw error;
      }
      
      return data;
    }
  });

  const filteredReports = reports?.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    return matchesSearch && matchesType;
  });

  const handleReportAction = (reportId: string) => {
    if (reportId === 'system-logs') {
      navigate('/admin/dashboard/system-logs');
      return;
    }
    
    console.log(`Accessing report ${reportId}`);
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'system': return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case 'traffic': return <BarChart className="h-5 w-5 text-blue-500" />;
      case 'user': return <Users className="h-5 w-5 text-green-500" />;
      case 'route': return <Clock className="h-5 w-5 text-amber-500" />;
      default: return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'system', label: 'System Logs' },
    { value: 'traffic', label: 'Traffic Reports' },
    { value: 'user', label: 'User Reports' },
    { value: 'route', label: 'Route Reports' }
  ];

  const getDeploymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return 'text-green-500';
      case 'failure': return 'text-red-500';
      case 'in_progress': return 'text-amber-500';
      default: return 'text-blue-500';
    }
  };

  const formatDeploymentDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading && isLoadingDeployments) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <Tabs defaultValue="reports" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="deployments">Deployment Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports">
          <div className="flex items-center space-x-4 mb-8">
            <input
              type="text"
              placeholder="Search reports..."
              className="flex-1 p-2 border border-border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="p-2 border border-border rounded-md"
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports?.map((report) => (
              <Card key={report.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-full">
                      {getReportIcon(report.type)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                    <Button 
                      size="sm" 
                      variant={report.id === 'system-logs' ? 'default' : 'outline'}
                      className="flex items-center gap-1"
                      onClick={() => handleReportAction(report.id)}
                    >
                      {report.id === 'system-logs' ? (
                        <>View Logs</>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredReports?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No reports found matching your criteria
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="deployments">
          <h2 className="text-xl font-semibold mb-4">System Deployment History</h2>
          
          <div className="space-y-4">
            {isLoadingDeployments ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : deploymentLogs && deploymentLogs.length > 0 ? (
              deploymentLogs.map((log: any) => (
                <Card key={log.id} className="overflow-hidden">
                  <div className={`px-4 py-2 ${log.status === 'success' ? 'bg-green-500/10' : log.status === 'failure' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Code className={`h-4 w-4 ${getDeploymentStatusColor(log.status)}`} />
                        <span className="font-medium">Version {log.version || 'Unknown'}</span>
                      </div>
                      <Badge variant="outline" className={getDeploymentStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            Deployed by: {log.profiles ? 
                              `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() || 'Unknown' 
                              : 'Unknown'}
                          </p>
                          <p className="text-muted-foreground">
                            {formatDeploymentDate(log.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          {log.completed_at && (
                            <p className="text-muted-foreground">
                              Completed: {formatDeploymentDate(log.completed_at)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {log.changes && log.changes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Changes:</p>
                          <ul className="text-sm text-muted-foreground pl-5 list-disc">
                            {log.changes.map((change: string, index: number) => (
                              <li key={index} className="mb-1">{change}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No deployment logs found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
