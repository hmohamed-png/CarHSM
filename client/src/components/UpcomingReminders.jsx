import { useEffect, useState } from 'react';
import { trickleListObjects } from '../utils/apiClient.js';

export default function UpcomingReminders() {
  try {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadReminders = async () => {
        try {
          const data = await trickleListObjects('reminder', 5, false);
          const upcoming =
            data.items?.filter((r) => {
              const dueDate = new Date(r.objectData.DueDate);
              return dueDate > new Date();
            }) || [];
          setReminders(upcoming.slice(0, 3));
        } catch (error) {
          console.error('Error loading reminders:', error);
        } finally {
          setLoading(false);
        }
      };

      loadReminders();
    }, []);

    if (loading || reminders.length === 0) return null;

    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="icon-bell text-2xl text-orange-600" />
            <h3 className="text-xl font-bold">Upcoming Reminders</h3>
          </div>
          <a href="/reminders" className="text-sm text-orange-600 font-semibold hover:underline">
            View All
          </a>
        </div>
        <div className="space-y-3">
          {reminders.map((reminder) => {
            const dueDate = new Date(reminder.objectData.DueDate);
            const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
            const urgencyClass =
              daysLeft <= 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';

            return (
              <div key={reminder.objectId} className="bg-white rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{reminder.objectData.Title}</p>
                  <p className="text-sm text-gray-600">{dueDate.toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${urgencyClass}`}>
                  {daysLeft} days
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error('UpcomingReminders error:', error);
    return null;
  }
}
