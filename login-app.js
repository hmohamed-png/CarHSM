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

function LoginApp() {
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
        <LoginForm />
      </div>
    );
  } catch (error) {
    console.error('LoginApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><LoginApp /></ErrorBoundary>);