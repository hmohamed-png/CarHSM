import DashboardHeader from '../components/DashboardHeader.jsx';
import ServiceCenterList from '../components/ServiceCenterList.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function ServicesPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <ServiceCenterList />
      </div>
    </ErrorBoundary>
  );
}
