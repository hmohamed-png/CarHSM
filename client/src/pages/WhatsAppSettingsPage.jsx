import DashboardHeader from '../components/DashboardHeader.jsx';
import WhatsAppSettings from '../components/WhatsAppSettings.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function WhatsAppSettingsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <WhatsAppSettings />
      </div>
    </ErrorBoundary>
  );
}
