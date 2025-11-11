import DashboardHeader from '../components/DashboardHeader.jsx';
import ProfileView from '../components/ProfilePage.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function ProfilePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <ProfileView />
      </div>
    </ErrorBoundary>
  );
}
