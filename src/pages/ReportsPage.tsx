
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, ShieldAlert, BarChart, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
}

const ReportsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const navigate = useNavigate();

  // Fetch reports from the database
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      // Here we would fetch real reports from Supabase
      // For now, we'll use these mock reports that include system logs
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

  // Filter reports based on search query and selected type
  const filteredReports = reports?.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    return matchesSearch && matchesType;
  });

  const handleReportAction = (reportId: string) => {
    // For system logs, navigate to the logs page
    if (reportId === 'system-logs') {
      navigate('/admin/dashboard/system-logs');
      return;
    }
    
    // For other reports, handle download or view logic
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
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
    </div>
  );
};

export default ReportsPage;
