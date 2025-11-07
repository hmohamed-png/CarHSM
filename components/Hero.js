function Hero() {
  try {
    return (
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-white to-[var(--bg-light)]" data-name="hero" data-file="components/Hero.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Complete <span className="text-[var(--primary-color)]">Car Management</span> Solution
              </h1>
              <p className="text-xl text-[var(--text-light)] mb-8">
                Track maintenance, find trusted service centers, and manage your vehicle's entire lifecycle in one place. Never miss a service date again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="dashboard.html" className="btn-primary text-center">Start Managing Your Car</a>
                <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="btn-secondary">Learn More</button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-[var(--text-light)]">
                <div className="flex items-center space-x-2">
                  <div className="icon-check-circle text-lg text-green-600"></div>
                  <span>Free to Start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="icon-check-circle text-lg text-green-600"></div>
                  <span>WhatsApp Reminders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="icon-check-circle text-lg text-green-600"></div>
                  <span>Trusted Service Centers</span>
                </div>
              </div>
            </div>
            
            <div className="relative slide-up">
              <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" alt="Car Dashboard" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="icon-calendar-check text-xl text-green-600"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Next Service</p>
                    <p className="text-xs text-[var(--text-light)]">Oil Change in 5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}