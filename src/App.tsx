
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            
            {/* Redirects for old paths - preserve these for backward compatibility */}
            <Route path="/admin/hubs" element={<AdminDashboard />}>
              <Route index element={<HubsPage />} />
            </Route>
            <Route path="/admin/hubs/:hubId" element={<AdminDashboard />}>
              <Route index element={<HubDetailsPage />} />
            </Route>
            <Route path="/admin/routes" element={<AdminDashboard />}>
              <Route index element={<RoutesPage />} />
            </Route>
            <Route path="/admin/stops" element={<AdminDashboard />}>
              <Route index element={<StopsPage />} />
            </Route>
            <Route path="/admin/requests" element={<AdminDashboard />}>
              <Route index element={<RequestsPage />} />
            </Route>
            <Route path="/admin/profile" element={<AdminDashboard />}>
              <Route index element={<ProfilePage {...mockProfileProps} />} />
            </Route>
            <Route path="/admin/users" element={<AdminDashboard />}>
              <Route index element={<UsersPage {...mockUsersProps} />} />
            </Route>
            <Route path="/admin/reports" element={<AdminDashboard />}>
              <Route index element={<ReportsPage />} />
            </Route>
            <Route path="/admin/settings" element={<AdminDashboard />}>
              <Route index element={<SettingsPage {...mockSettingsProps} />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
