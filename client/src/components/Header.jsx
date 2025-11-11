import { useState } from 'react';

export default function Header() {
  try {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigateToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = sectionId;
      }
      setMobileMenuOpen(false);
    };

    return (
      <header className="bg-white shadow-sm sticky top-0 z-50" data-name="header">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                <div className="icon-car text-xl text-white" />
              </div>
              <span className="text-2xl font-bold text-[var(--secondary-color)]">UCarX</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                type="button"
                onClick={() => navigateToSection('features')}
                className="text-[var(--text-dark)] hover:text-[var(--primary-color)] transition-colors"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('how-it-works')}
                className="text-[var(--text-dark)] hover:text-[var(--primary-color)] transition-colors"
              >
                How It Works
              </button>
              <a href="/dashboard" className="btn-primary">
                Get Started
              </a>
            </div>

            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              <div className={`icon-${mobileMenuOpen ? 'x' : 'menu'} text-2xl text-[var(--secondary-color)]`} />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 animate-fadeIn">
              <button
                type="button"
                onClick={() => navigateToSection('features')}
                className="block w-full text-left py-3 px-4 text-[var(--text-dark)] hover:bg-gray-100 rounded-lg transition-colors"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('how-it-works')}
                className="block w-full text-left py-3 px-4 text-[var(--text-dark)] hover:bg-gray-100 rounded-lg transition-colors"
              >
                How It Works
              </button>
              <a href="/dashboard" className="block btn-primary text-center mt-4">
                Get Started
              </a>
            </div>
          )}
        </nav>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
