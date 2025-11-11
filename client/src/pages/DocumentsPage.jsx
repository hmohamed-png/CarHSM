import DashboardHeader from '../components/DashboardHeader.jsx';
import DocumentsManager from '../components/DocumentsManager.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function DocumentsPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <DocumentsManager />
      </div>
    </ErrorBoundary>
  );
}
