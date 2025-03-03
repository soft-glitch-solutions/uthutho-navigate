import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import OverviewPage from './pages/OverviewPage';
import SettingsPage from './pages/SettingsPage';
import HubsPage from './pages/HubsPage';
import RoutesPage from './pages/RoutesPage';
import StopsPage from './pages/StopsPage';
import HubDetailsPage from './pages/HubDetailsPage';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<ProfilePage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/reports" element={<OverviewPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/hubs" element={<HubsPage />} />
        <Route path="/admin/routes" element={<RoutesPage />} />
        <Route path="/admin/stops" element={<StopsPage />} />
        <Route path="/admin/hubs/:id" element={<HubDetailsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
