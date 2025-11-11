import DashboardHeader from '../components/DashboardHeader.jsx';
import NotificationsList from '../components/NotificationsList.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function NotificationsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <NotificationsList />
      </div>
    </ErrorBoundary>
  );
}
