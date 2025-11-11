import DashboardHeader from '../components/DashboardHeader.jsx';
import FuelTracker from '../components/FuelTracker.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function FuelTrackingPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <FuelTracker />
      </div>
    </ErrorBoundary>
  );
}
