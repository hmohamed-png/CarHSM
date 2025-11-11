import DashboardHeader from '../components/DashboardHeader.jsx';
import AIAssistant from '../components/AIAssistant.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function AIAssistantPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <AIAssistant />
      </div>
    </ErrorBoundary>
  );
}
