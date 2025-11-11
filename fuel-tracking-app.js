const ChartJS = window.Chart || null;

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
      return <div className="p-8 text-center">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

function FuelTrackingApp() {
  try {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <FuelTracker />
      </div>
    );
  } catch (error) {
    console.error('FuelTrackingApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><FuelTrackingApp /></ErrorBoundary>);