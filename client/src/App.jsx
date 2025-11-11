import { Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import VehiclesPage from './pages/VehiclesPage.jsx';
import AddMaintenancePage from './pages/AddMaintenancePage.jsx';
import FuelTrackingPage from './pages/FuelTrackingPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import MarketplacePage from './pages/MarketplacePage.jsx';
import CreateListingPage from './pages/CreateListingPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import TrafficFinesPage from './pages/TrafficFinesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AIAssistantPage from './pages/AIAssistantPage.jsx';
import WhatsAppSettingsPage from './pages/WhatsAppSettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RemindersPage from './pages/RemindersPage.jsx';
import RequireAuth from './components/RequireAuth.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route
      path="/dashboard"
      element={
        <RequireAuth>
          <DashboardPage />
        </RequireAuth>
      }
    />
    <Route
      path="/vehicles"
      element={
        <RequireAuth>
          <VehiclesPage />
        </RequireAuth>
      }
    />
    <Route
      path="/add-maintenance"
      element={
        <RequireAuth>
          <AddMaintenancePage />
        </RequireAuth>
      }
    />
    <Route
      path="/fuel-tracking"
      element={
        <RequireAuth>
          <FuelTrackingPage />
        </RequireAuth>
      }
    />
    <Route
      path="/analytics"
      element={
        <RequireAuth>
          <AnalyticsPage />
        </RequireAuth>
      }
    />
    <Route
      path="/marketplace"
      element={
        <RequireAuth>
          <MarketplacePage />
        </RequireAuth>
      }
    />
    <Route
      path="/marketplace/create"
      element={
        <RequireAuth>
          <CreateListingPage />
        </RequireAuth>
      }
    />
    <Route
      path="/documents"
      element={
        <RequireAuth>
          <DocumentsPage />
        </RequireAuth>
      }
    />
    <Route
      path="/notifications"
      element={
        <RequireAuth>
          <NotificationsPage />
        </RequireAuth>
      }
    />
    <Route
      path="/services"
      element={
        <RequireAuth>
          <ServicesPage />
        </RequireAuth>
      }
    />
    <Route
      path="/traffic-fines"
      element={
        <RequireAuth>
          <TrafficFinesPage />
        </RequireAuth>
      }
    />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/ai-assistant"
      element={
        <RequireAuth>
          <AIAssistantPage />
        </RequireAuth>
      }
    />
    <Route
      path="/whatsapp-settings"
      element={
        <RequireAuth>
          <WhatsAppSettingsPage />
        </RequireAuth>
      }
    />
    <Route
      path="/profile"
      element={
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      }
    />
    <Route
      path="/reminders"
      element={
        <RequireAuth>
          <RemindersPage />
        </RequireAuth>
      }
    />
    <Route path="*" element={<LandingPage />} />
  </Routes>
);

export default App;
