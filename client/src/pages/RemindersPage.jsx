import DashboardHeader from '../components/DashboardHeader.jsx';
import RemindersList from '../components/RemindersList.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function RemindersPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <RemindersList />
      </div>
    </ErrorBoundary>
  );
}
