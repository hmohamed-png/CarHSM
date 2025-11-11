import DashboardHeader from '../components/DashboardHeader.jsx';
import VehicleDetails from '../components/VehicleDetails.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function VehiclesPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <VehicleDetails />
      </div>
    </ErrorBoundary>
  );
}
