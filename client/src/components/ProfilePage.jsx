import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trickleListObjects } from '../utils/apiClient.js';

export default function ProfilePage() {
  try {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ vehicles: 0, maintenance: 0, spent: 0 });
    const navigate = useNavigate();

    useEffect(() => {
      const loadUserData = async () => {
        try {
          const users = await trickleListObjects('user', 1, true);
          if (users.items && users.items.length > 0) {
            setUser(users.items[0]);
          }
          const vehicles = await trickleListObjects('vehicle', 100, true);
          const maintenance = await trickleListObjects('maintenance', 100, true);
          const totalSpent =
            maintenance.items?.reduce((sum, record) => sum + (record.objectData.Cost || 0), 0) || 0;
          setStats({
            vehicles: vehicles.items?.length || 0,
            maintenance: maintenance.items?.length || 0,
            spent: totalSpent
          });
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };

      loadUserData();
    }, []);

    const handleLogout = () => {
      navigate('/login');
    };

    if (!user) return <div className="p-8 text-center">Loading...</div>;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-8 mb-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <div className="icon-user text-4xl text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.objectData.Name || 'User'}</h1>
              <p className="text-gray-600">{user.objectData.Phone}</p>
              <p className="text-gray-600">{user.objectData.Email || 'No email'}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              type="button"
              className="px-6 py-2 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-lg font-semibold hover:bg-[var(--primary-color)] hover:text-white transition-all"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.vehicles}</p>
              <p className="text-gray-600">Vehicles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.maintenance}</p>
              <p className="text-gray-600">Services</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--primary-color)]">{stats.spent.toLocaleString()}</p>
              <p className="text-gray-600">Total Spent (EGP)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <div className="icon-bell text-xl text-gray-600" />
                <span className="font-semibold">Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={user.objectData.NotificationsEnabled} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]" />
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <div className="icon-moon text-xl text-gray-600" />
                <span className="font-semibold">Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={user.objectData.DarkMode} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)]" />
              </label>
            </div>
            <a href="#" className="flex items-center justify-between py-3 border-b hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="icon-help-circle text-xl text-gray-600" />
                <span className="font-semibold">Help & Support</span>
              </div>
              <div className="icon-chevron-right text-xl text-gray-400" />
            </a>
            <a href="#" className="flex items-center justify-between py-3 border-b hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="icon-shield text-xl text-gray-600" />
                <span className="font-semibold">Privacy Policy</span>
              </div>
              <div className="icon-chevron-right text-xl text-gray-400" />
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
        >
          Logout
        </button>
      </div>
    );
  } catch (error) {
    console.error('ProfilePage error:', error);
    return null;
  }
}
