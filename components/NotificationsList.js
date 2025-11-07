function NotificationsList() {
  try {
    const [notifications, setNotifications] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      loadNotifications();
    }, []);

    const loadNotifications = async () => {
      try {
        const data = await trickleListObjects('notification', 100, true);
        setNotifications(data.items || []);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    const markAsRead = async (id) => {
      try {
        await trickleUpdateObject('notification', id, { Read: true });
        loadNotifications();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    };

    const deleteNotification = async (id) => {
      try {
        await trickleDeleteObject('notification', id);
        loadNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    };

    const filteredNotifications = filter === 'all' 
      ? notifications 
      : notifications.filter(n => n.objectData.Read === (filter === 'read'));

    const unreadCount = notifications.filter(n => !n.objectData.Read).length;

    const getIconByType = (type) => {
      switch(type) {
        case 'reminder': return 'bell';
        case 'success': return 'check-circle';
        case 'alert': return 'alert-circle';
        default: return 'info';
      }
    };

    const getColorByType = (type) => {
      switch(type) {
        case 'reminder': return 'bg-blue-100 text-blue-600';
        case 'success': return 'bg-green-100 text-green-600';
        case 'alert': return 'bg-orange-100 text-orange-600';
        default: return 'bg-gray-100 text-gray-600';
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Notifications</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[var(--primary-color)] text-white' : 'bg-white'}`}>
              All ({notifications.length})
            </button>
            <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-lg ${filter === 'unread' ? 'bg-[var(--primary-color)] text-white' : 'bg-white'}`}>
              Unread ({unreadCount})
            </button>
            <button onClick={() => setFilter('read')} className={`px-4 py-2 rounded-lg ${filter === 'read' ? 'bg-[var(--primary-color)] text-white' : 'bg-white'}`}>
              Read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="icon-bell text-5xl text-gray-300 mb-4"></div>
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div key={notification.objectId} className={`bg-white rounded-xl p-4 shadow hover:shadow-md transition-shadow ${!notification.objectData.Read ? 'border-l-4 border-[var(--primary-color)]' : ''}`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorByType(notification.objectData.Type)}`}>
                    <div className={`icon-${getIconByType(notification.objectData.Type)} text-xl`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{notification.objectData.Title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{notification.objectData.Message}</p>
                    <p className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.objectData.Read && (
                      <button onClick={() => markAsRead(notification.objectId)} className="p-2 hover:bg-gray-100 rounded-lg" title="Mark as read">
                        <div className="icon-check text-lg text-green-600"></div>
                      </button>
                    )}
                    <button onClick={() => deleteNotification(notification.objectId)} className="p-2 hover:bg-gray-100 rounded-lg" title="Delete">
                      <div className="icon-trash-2 text-lg text-red-600"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('NotificationsList error:', error);
    return null;
  }
}