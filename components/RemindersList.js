function RemindersList() {
  try {
    const [reminders, setReminders] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [formData, setFormData] = React.useState({ vehicleId: '', title: '', dueDate: '', type: 'maintenance' });

    const reminderTypes = ['Maintenance', 'Insurance Renewal', 'License Renewal', 'Registration Renewal', 'Inspection', 'Other'];

    React.useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const [remindersData, vehiclesData] = await Promise.all([
          trickleListObjects('reminder', 100, false),
          trickleListObjects('vehicle', 50, true)
        ]);
        setReminders(remindersData.items || []);
        setVehicles(vehiclesData.items || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await trickleCreateObject('reminder', {
          VehicleId: formData.vehicleId,
          Title: formData.title,
          DueDate: formData.dueDate,
          Type: formData.type,
          Status: 'pending'
        });
        setShowAddModal(false);
        setFormData({ vehicleId: '', title: '', dueDate: '', type: 'maintenance' });
        loadData();
      } catch (error) {
        console.error('Error adding reminder:', error);
      }
    };

    const handleDelete = async (id) => {
      try {
        await trickleDeleteObject('reminder', id);
        loadData();
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    };

    const sortedReminders = [...reminders].sort((a, b) => new Date(a.objectData.DueDate) - new Date(b.objectData.DueDate));

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Reminders</h1>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 flex items-center space-x-2">
            <div className="icon-plus text-lg"></div>
            <span>Add Reminder</span>
          </button>
        </div>

        {sortedReminders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="icon-bell text-5xl text-gray-300 mb-4"></div>
            <p className="text-gray-500">No reminders yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedReminders.map(reminder => {
              const dueDate = new Date(reminder.objectData.DueDate);
              const today = new Date();
              const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              const isOverdue = daysLeft < 0;
              const isUrgent = daysLeft <= 7 && daysLeft >= 0;

              return (
                <div key={reminder.objectId} className={`bg-white rounded-xl shadow p-6 border-l-4 ${isOverdue ? 'border-red-500' : isUrgent ? 'border-orange-500' : 'border-green-500'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{reminder.objectData.Title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <div className="icon-calendar text-lg"></div>
                          <span>{dueDate.toLocaleDateString()}</span>
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">{reminder.objectData.Type}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isOverdue ? 'bg-red-100 text-red-800' : isUrgent ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                      </span>
                      <button onClick={() => handleDelete(reminder.objectId)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="icon-trash-2 text-lg text-red-600"></div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Add Reminder</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Vehicle *</label>
                  <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full p-3 border rounded-lg" required>
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.objectId} value={v.objectId}>{v.objectData.Brand} {v.objectData.Model} - {v.objectData.PlateNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Reminder Type *</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 border rounded-lg" required>
                    {reminderTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Oil Change Due" className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Due Date *</label>
                  <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90">Add Reminder</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('RemindersList error:', error);
    return null;
  }
}
