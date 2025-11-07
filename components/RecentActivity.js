function RecentActivity() {
  try {
    const [activities, setActivities] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      loadActivities();
    }, []);

    const loadActivities = async () => {
      try {
        const data = await trickleListObjects('maintenance', 10, true);
        setActivities(data.items || []);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow" data-name="recent-activity" data-file="components/RecentActivity.js">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="icon-activity text-4xl text-gray-300 mb-2"></div>
            <p className="text-gray-500">No maintenance records yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.objectId} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="icon-check text-lg text-green-600"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{activity.objectData.serviceType}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('RecentActivity error:', error);
    return null;
  }
}