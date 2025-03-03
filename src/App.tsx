
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
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/hubs" element={<HubsPage />} />
            <Route path="/admin/hubs/:hubId" element={<HubDetailsPage />} />
            <Route path="/admin/routes" element={<RoutesPage />} />
            <Route path="/admin/stops" element={<StopsPage />} />
            <Route path="/admin/requests" element={<RequestsPage />} />
            <Route path="/admin/profile" element={<ProfilePage {...mockProfileProps} />} />
            <Route path="/admin/users" element={<UsersPage {...mockUsersProps} />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<SettingsPage {...mockSettingsProps} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
