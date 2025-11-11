import DashboardHeader from '../components/DashboardHeader.jsx';
import AnalyticsDashboard from '../components/AnalyticsDashboard.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function AnalyticsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <AnalyticsDashboard />
      </div>
    </ErrorBoundary>
  );
}
