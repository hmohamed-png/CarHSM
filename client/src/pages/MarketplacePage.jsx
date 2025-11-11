import DashboardHeader from '../components/DashboardHeader.jsx';
import MarketplaceListing from '../components/MarketplaceListing.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export default function MarketplacePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <MarketplaceListing />
      </div>
    </ErrorBoundary>
  );
}
