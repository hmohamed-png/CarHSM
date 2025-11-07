function DashboardHeader() {
  try {
    return (
      <header className="bg-white shadow-sm" data-name="dashboard-header" data-file="components/DashboardHeader.js">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="index.html" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <div className="icon-car text-xl text-white"></div>
              </div>
              <span className="text-2xl font-bold">UCarX</span>
            </a>
            
            <div className="flex items-center space-x-6">
              <a href="dashboard.html" className="text-[var(--primary-color)] font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--primary-color)]">Dashboard</a>
              <a href="vehicles.html" className="hover:text-[var(--primary-color)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary-color)] after:transition-all hover:after:w-full">My Vehicles</a>
              <a href="fuel-tracking.html" className="hover:text-[var(--primary-color)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary-color)] after:transition-all hover:after:w-full">Fuel</a>
              <a href="analytics.html" className="hover:text-[var(--primary-color)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary-color)] after:transition-all hover:after:w-full">Analytics</a>
              <a href="services.html" className="hover:text-[var(--primary-color)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary-color)] after:transition-all hover:after:w-full">Services</a>
              <a href="marketplace.html" className="hover:text-[var(--primary-color)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary-color)] after:transition-all hover:after:w-full">Marketplace</a>
              <a href="documents.html" className="hover:text-[var(--primary-color)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary-color)] after:transition-all hover:after:w-full">Documents</a>
              <a href="notifications.html" className="relative w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                <div className="icon-bell text-xl text-gray-700"></div>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary-color)] text-white text-xs rounded-full flex items-center justify-center">3</span>
              </a>
              <a href="profile.html" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                <div className="icon-user text-xl text-gray-700"></div>
              </a>
            </div>
          </div>
        </nav>
      </header>
    );
  } catch (error) {
    console.error('DashboardHeader error:', error);
    return null;
  }
}