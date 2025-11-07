class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary:', error, errorInfo.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-center">Something went wrong. <button onClick={() => window.location.reload()} className="text-[var(--primary-color)]">Reload</button></div>;
    }
    return this.props.children;
  }
}

function DashboardApp() {
  try {
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      loadVehicles();
    }, []);

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

    return (
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
    );
  } catch (error) {
    console.error('DashboardApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><DashboardApp /></ErrorBoundary>);