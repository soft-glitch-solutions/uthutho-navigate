
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
import RouteDetailsPage from "./pages/RouteDetailsPage";
import StopsPage from "./pages/StopsPage";
import StopDetailsPage from "./pages/StopDetailsPage";
import NearbySpots from "./pages/NearbySpots";
import RequestsPage from "./pages/RequestsPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import DeleteAccountLogin from "./pages/DeleteAccountLogin";
import ConfirmDeleteAccount from "./pages/ConfirmDeleteAccount";
import Overview from "./components/admin/Overview";
import UserProfilePage from "./pages/UserProfilePage";
import SystemLogsPage from "./pages/SystemLogsPage";
import HelpDocumentation from "./components/admin/HelpDocumentation";

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

import { useState } from "react";

const App = () => {
  const [theme, setTheme] = useState("light");
  
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/delete-account" element={<DeleteAccountLogin />} />
              <Route path="/confirm-delete" element={<ConfirmDeleteAccount />} />
              <Route path="/admin" element={<AdminLogin />} />
              
              {/* Admin dashboard layout with nested routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />}>
                <Route index element={<Overview />} />
                <Route path="hubs" element={<HubsPage />} />
                <Route path="hubs/:hubId" element={<HubDetailsPage />} />
                <Route path="routes" element={<RoutesPage />} />
                <Route path="routes/:routeId" element={<RouteDetailsPage />} />
                <Route path="stops" element={<StopsPage />} />
                <Route path="stops/:stopId" element={<StopDetailsPage />} />
                <Route path="nearby-spots" element={<NearbySpots />} />
                <Route path="requests" element={<RequestsPage />} />
                <Route path="profile" element={<ProfilePage {...mockProfileProps} />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="users/:userId" element={<UserProfilePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="logs" element={<SystemLogsPage />} />
                <Route path="help" element={<HelpDocumentation />} />
                <Route path="settings" element={<SettingsPage theme={theme} toggleTheme={toggleTheme} />} />
              </Route>
              
              {/* Redirect old URLs to the new structure */}
              <Route path="/admin/hubs" element={<Navigate to="/admin/dashboard/hubs" replace />} />
              <Route path="/admin/hubs/:hubId" element={<Navigate to="/admin/dashboard/hubs/:hubId" replace />} />
              <Route path="/admin/routes" element={<Navigate to="/admin/dashboard/routes" replace />} />
              <Route path="/admin/routes/:routeId" element={<Navigate to="/admin/dashboard/routes/:routeId" replace />} />
              <Route path="/admin/stops" element={<Navigate to="/admin/dashboard/stops" replace />} />
              <Route path="/admin/stops/:stopId" element={<Navigate to="/admin/dashboard/stops/:stopId" replace />} />
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
};

export default App;
