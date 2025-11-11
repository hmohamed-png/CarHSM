import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vehicles', label: 'My Vehicles' },
  { to: '/fuel-tracking', label: 'Fuel' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/services', label: 'Services' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/documents', label: 'Documents' }
];

export default function DashboardHeader() {
  try {
    return (
      <header className="bg-white shadow-sm" data-name="dashboard-header">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <div className="icon-car text-xl text-white" />
              </div>
              <span className="text-2xl font-bold">UCarX</span>
            </a>

            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative transition-colors ${isActive ? 'text-[var(--primary-color)] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--primary-color)]' : 'hover:text-[var(--primary-color)]'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <NavLink
                to="/notifications"
                className="relative w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <div className="icon-bell text-xl text-gray-700" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary-color)] text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </NavLink>
              <NavLink
                to="/profile"
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <div className="icon-user text-xl text-gray-700" />
              </NavLink>
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
