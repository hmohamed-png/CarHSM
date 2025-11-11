import DashboardHeader from '../components/DashboardHeader.jsx';
import CreateListingForm from '../components/CreateListingForm.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function CreateListingPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <CreateListingForm />
      </div>
    </ErrorBoundary>
  );
}
