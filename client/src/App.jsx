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

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/vehicles" element={<VehiclesPage />} />
    <Route path="/add-maintenance" element={<AddMaintenancePage />} />
    <Route path="/fuel-tracking" element={<FuelTrackingPage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
    <Route path="/marketplace" element={<MarketplacePage />} />
    <Route path="/marketplace/create" element={<CreateListingPage />} />
    <Route path="/documents" element={<DocumentsPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/traffic-fines" element={<TrafficFinesPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/ai-assistant" element={<AIAssistantPage />} />
    <Route path="/whatsapp-settings" element={<WhatsAppSettingsPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/reminders" element={<RemindersPage />} />
    <Route path="*" element={<LandingPage />} />
  </Routes>
);

export default App;
