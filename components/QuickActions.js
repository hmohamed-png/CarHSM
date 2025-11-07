function QuickActions() {
  try {
    const actions = [
      { icon: 'plus', title: 'Add Maintenance', color: 'bg-blue-500', link: 'add-maintenance.html' },
      { icon: 'fuel', title: 'Track Fuel', color: 'bg-green-500', link: 'fuel-tracking.html' },
      { icon: 'chart-bar', title: 'View Analytics', color: 'bg-purple-500', link: 'analytics.html' },
      { icon: 'bot', title: 'AI Assistant', color: 'bg-indigo-500', link: 'ai-assistant.html' },
      { icon: 'map-pin', title: 'Find Service', color: 'bg-emerald-500', link: 'services.html' },
      { icon: 'alert-triangle', title: 'Traffic Fines', color: 'bg-red-500', link: 'traffic-fines.html' }
    ];

    return (
      <div className="bg-white rounded-xl p-6 shadow" data-name="quick-actions" data-file="components/QuickActions.js">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <a key={index} href={action.link} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200">
              <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center shadow-md`}>
                <div className={`icon-${action.icon} text-lg text-white`}></div>
              </div>
              <span className="font-semibold">{action.title}</span>
            </a>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('QuickActions error:', error);
    return null;
  }
}