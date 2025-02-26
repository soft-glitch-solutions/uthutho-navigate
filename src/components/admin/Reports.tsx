
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type ReportStatus = Database['public']['Enums']['report_status'];

interface TrafficReport {
  id: string;
  location: string;
  description: string;
  incident_type: string;
  status: ReportStatus;
  incident_time: string;
  created_at: string;
  reporter: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const Reports = () => {
  const [searchReports, setSearchReports] = useState('');
  const queryClient = useQueryClient();

  const { data: reports } = useQuery({
    queryKey: ['traffic-reports'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('traffic_reports')
        .select(`
          *,
          reporter:profiles(
            first_name,
            last_name
          )
        `)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as TrafficReport[];
    },
  });

  const updateReportStatus = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: ReportStatus }) => {
      const { error } = await supabase
        .from('traffic_reports')
        .update({ status })
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['traffic-reports'] });
    },
  });

  const filteredReports = reports?.filter(report =>
    report.location.toLowerCase().includes(searchReports.toLowerCase()) ||
    report.description.toLowerCase().includes(searchReports.toLowerCase()) ||
    report.incident_type.toLowerCase().includes(searchReports.toLowerCase())
  );

  return (
    <div className="bg-card backdrop-blur-sm rounded-xl border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Today's Traffic Reports</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchReports}
            onChange={(e) => setSearchReports(e.target.value)}
            className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredReports?.length === 0 ? (
          <p className="text-muted-foreground">No traffic reports for today.</p>
        ) : (
          filteredReports?.map((report) => (
            <div
              key={report.id}
              className="bg-background p-4 rounded-lg border border-border"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-foreground">{report.incident_type}</h3>
                  <p className="text-sm text-muted-foreground">{report.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    report.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                  <select
                    value={report.status}
                    onChange={(e) => updateReportStatus.mutate({
                      reportId: report.id,
                      status: e.target.value as ReportStatus
                    })}
                    className="bg-background text-foreground text-sm border border-border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-foreground mb-2">{report.description}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  Reported by: {report.reporter?.first_name} {report.reporter?.last_name}
                </span>
                <span>
                  {format(new Date(report.incident_time), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;
