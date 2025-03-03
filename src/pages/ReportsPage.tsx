
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const reportData = {
  monthly: [
    { name: 'Jan', users: 400, routes: 240, hubs: 20 },
    { name: 'Feb', users: 500, routes: 280, hubs: 28 },
    { name: 'Mar', users: 600, routes: 320, hubs: 26 },
    { name: 'Apr', users: 800, routes: 380, hubs: 30 },
    { name: 'May', users: 1000, routes: 470, hubs: 32 },
    { name: 'Jun', users: 1200, routes: 520, hubs: 38 },
  ],
  daily: [
    { name: 'Mon', users: 240, routes: 120, hubs: 10 },
    { name: 'Tue', users: 300, routes: 150, hubs: 14 },
    { name: 'Wed', users: 320, routes: 180, hubs: 12 },
    { name: 'Thu', users: 280, routes: 160, hubs: 10 },
    { name: 'Fri', users: 350, routes: 210, hubs: 15 },
    { name: 'Sat', users: 400, routes: 230, hubs: 18 },
    { name: 'Sun', users: 280, routes: 120, hubs: 8 },
  ],
  usage: [
    { name: 'Routes', value: 450 },
    { name: 'Stops', value: 300 },
    { name: 'Hubs', value: 150 },
    { name: 'Requests', value: 100 },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportsPage = () => {
  const [timeframe, setTimeframe] = useState('monthly');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Report</h2>
      </div>

      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Service</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.usage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {reportData.usage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>User Activity</CardTitle>
                <div className="space-x-2">
                  <button
                    onClick={() => setTimeframe('daily')}
                    className={`px-2 py-1 text-xs rounded ${timeframe === 'daily' ? 'bg-primary text-white' : 'bg-secondary'}`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setTimeframe('monthly')}
                    className={`px-2 py-1 text-xs rounded ${timeframe === 'monthly' ? 'bg-primary text-white' : 'bg-secondary'}`}
                  >
                    Monthly
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportData[timeframe as keyof typeof reportData]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="users" fill="#8884d8" />
                      <Bar dataKey="routes" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={reportData.monthly}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="routes" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="hubs" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Traffic analysis data will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
