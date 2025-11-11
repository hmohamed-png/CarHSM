export default function Features() {
  try {
    const features = [
      {
        icon: 'calendar-clock',
        title: 'Maintenance Tracking',
        description: 'Record all services, repairs, and inspections with photos and receipts. Get automatic reminders.',
        color: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: 'bell-ring',
        title: 'WhatsApp Reminders',
        description: 'Never miss a service date. Get WhatsApp notifications for upcoming maintenance and renewals.',
        color: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      {
        icon: 'map-pin',
        title: 'Find Service Centers',
        description: 'Discover trusted mechanics and service centers near you with ratings and reviews.',
        color: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      {
        icon: 'shopping-bag',
        title: 'Car Marketplace',
        description: 'Buy, sell, or rent vehicles with complete maintenance history transparency.',
        color: 'bg-orange-100',
        iconColor: 'text-orange-600'
      },
      {
        icon: 'file-text',
        title: 'Digital Documents',
        description: 'Store insurance, license, and all car documents securely in one place.',
        color: 'bg-red-100',
        iconColor: 'text-[var(--primary-color)]'
      },
      {
        icon: 'chart-bar',
        title: 'Cost Analytics',
        description: 'Track spending over time and understand your vehicle maintenance costs.',
        color: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      },
      {
        icon: 'bot',
        title: 'AI Assistant',
        description: 'Get instant answers about car maintenance and expert advice 24/7.',
        color: 'bg-indigo-100',
        iconColor: 'text-indigo-600'
      },
      {
        icon: 'fuel',
        title: 'Fuel Tracking',
        description: 'Monitor fuel consumption, costs, and efficiency over time.',
        color: 'bg-green-100',
        iconColor: 'text-green-600'
      }
    ];

    return (
      <section id="features" className="py-20 bg-white" data-name="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Manage Your Car</h2>
            <p className="text-xl text-[var(--text-light)] max-w-2xl mx-auto">
              Comprehensive features to help you maintain your vehicle, save money, and never miss important dates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="feature-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <div className={`icon-${feature.icon} text-2xl ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--text-light)]">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a href="/dashboard" className="btn-primary inline-block">
              Start Free Today
            </a>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Features component error:', error);
    return null;
  }
}
