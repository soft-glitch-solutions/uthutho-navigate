
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import HubsPage from "./pages/HubsPage";
import HubDetailsPage from "./pages/HubDetailsPage";
import RoutesPage from "./pages/RoutesPage";
import StopsPage from "./pages/StopsPage";
import RequestsPage from "./pages/RequestsPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import Overview from "./components/admin/Overview";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Temporary mock props for pages that require props
const mockProfileProps = {
  onProfileUpdate: (profile: any) => console.log('Profile updated:', profile),
  onAvatarChange: (avatar: string | null) => console.log('Avatar changed:', avatar)
};

const mockUsersProps = {
  users: [],
  onRoleChange: (userId: string, role: string) => console.log(`Changed role for ${userId} to ${role}`)
};

const mockSettingsProps = {
  theme: 'light',
  toggleTheme: () => console.log('Theme toggled')
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminLogin />} />
            
            {/* Admin dashboard layout with nested routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              <Route index element={<Overview />} />
              <Route path="hubs" element={<HubsPage />} />
              <Route path="hubs/:hubId" element={<HubDetailsPage />} />
              <Route path="routes" element={<RoutesPage />} />
              <Route path="stops" element={<StopsPage />} />
              <Route path="requests" element={<RequestsPage />} />
              <Route path="profile" element={<ProfilePage {...mockProfileProps} />} />
              <Route path="users" element={<UsersPage {...mockUsersProps} />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage {...mockSettingsProps} />} />
            </Route>
            
            {/* Redirect old URLs to the new structure */}
            <Route path="/admin/hubs" element={<Navigate to="/admin/dashboard/hubs" replace />} />
            <Route path="/admin/hubs/:hubId" element={<Navigate to="/admin/dashboard/hubs/:hubId" replace />} />
            <Route path="/admin/routes" element={<Navigate to="/admin/dashboard/routes" replace />} />
            <Route path="/admin/stops" element={<Navigate to="/admin/dashboard/stops" replace />} />
            <Route path="/admin/requests" element={<Navigate to="/admin/dashboard/requests" replace />} />
            <Route path="/admin/profile" element={<Navigate to="/admin/dashboard/profile" replace />} />
            <Route path="/admin/users" element={<Navigate to="/admin/dashboard/users" replace />} />
            <Route path="/admin/reports" element={<Navigate to="/admin/dashboard/reports" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/admin/dashboard/settings" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
