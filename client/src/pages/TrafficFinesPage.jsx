import DashboardHeader from '../components/DashboardHeader.jsx';
import TrafficFinesList from '../components/TrafficFinesList.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function TrafficFinesPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <TrafficFinesList />
      </div>
    </ErrorBoundary>
  );
}
