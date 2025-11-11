import { useEffect, useState } from 'react';
import { trickleDeleteObject, trickleListObjects, trickleUpdateObject } from '../utils/apiClient.js';

export default function NotificationsList() {
  try {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
      loadNotifications();
    }, []);

    const markAsRead = async (id) => {
      try {
        await trickleUpdateObject('notification', id, { Read: true });
        loadNotifications();
      } catch (error) {
        console.error('Error updating notification:', error);
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

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        <div className="bg-white rounded-xl shadow divide-y">
          {loading ? (
            <p className="text-center py-8">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No notifications yet</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.objectId} className="p-4 flex items-start justify-between">
                <div>
                  <p className="font-semibold">{notification.objectData.Title}</p>
                  <p className="text-sm text-gray-600">{notification.objectData.Message}</p>
                </div>
                <div className="flex space-x-2">
                  {!notification.objectData.Read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.objectId)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(notification.objectId)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('NotificationsList error:', error);
    return null;
  }
}
