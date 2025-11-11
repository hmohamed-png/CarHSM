import DashboardHeader from '../components/DashboardHeader.jsx';
import AddMaintenanceForm from '../components/AddMaintenanceForm.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function AddMaintenancePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <AddMaintenanceForm />
      </div>
    </ErrorBoundary>
  );
}
