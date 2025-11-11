import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader.jsx';
import FloatingAIButton from '../components/FloatingAIButton.jsx';
import VehicleCard from '../components/VehicleCard.jsx';
import UpcomingReminders from '../components/UpcomingReminders.jsx';
import RecentActivity from '../components/RecentActivity.jsx';
import QuickActions from '../components/QuickActions.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { trickleListObjects } from '../utils/apiClient.js';

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVehicles = async () => {
    try {
      const data = await trickleListObjects('vehicle', 20, true);
      setVehicles(data.items || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-light)]">
        <DashboardHeader />
        <FloatingAIButton />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-[var(--text-light)]">Manage your vehicles and track maintenance</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <>
              <VehicleCard vehicles={vehicles} onUpdate={loadVehicles} />
              <UpcomingReminders />
              <div className="grid lg:grid-cols-3 gap-8 mt-8">
                <div className="lg:col-span-2">
                  <RecentActivity />
                </div>
                <div>
                  <QuickActions />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
