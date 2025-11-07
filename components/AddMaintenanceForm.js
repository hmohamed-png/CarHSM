function AddMaintenanceForm() {
  try {
    const [vehicles, setVehicles] = React.useState([]);
    const [formData, setFormData] = React.useState({
      vehicleId: '', serviceType: '', date: '', mileage: '', cost: '', notes: '', nextServiceMileage: ''
    });
    const [success, setSuccess] = React.useState(false);

    const serviceTypes = ['Oil Change', 'Tire Rotation', 'Brake Service', 'Battery Replacement', 'Air Filter', 'Transmission Service', 'Coolant Flush', 'Spark Plugs', 'Inspection', 'Other'];

    React.useEffect(() => {
      loadVehicles();
      const urlParams = new URLSearchParams(window.location.search);
      const vehicleId = urlParams.get('vehicleId');
      if (vehicleId) setFormData(prev => ({...prev, vehicleId}));
    }, []);

    const loadVehicles = async () => {
      try {
        const data = await trickleListObjects('vehicle', 50, true);
        setVehicles(data.items || []);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await trickleCreateObject('maintenance', {
          VehicleId: formData.vehicleId,
          ServiceType: formData.serviceType,
          Date: formData.date,
          Mileage: parseInt(formData.mileage),
          Cost: parseFloat(formData.cost),
          Notes: formData.notes,
          NextServiceMileage: formData.nextServiceMileage ? parseInt(formData.nextServiceMileage) : null
        });
        setSuccess(true);
        setTimeout(() => window.location.href = 'vehicles.html', 2000);
      } catch (error) {
        console.error('Error adding maintenance:', error);
      }
    };

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Add Maintenance Record</h1>
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <p className="text-green-800 font-semibold">Maintenance record added successfully!</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Vehicle *</label>
            <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full p-3 border rounded-lg" required>
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.objectId} value={v.objectId}>{v.objectData.Brand} {v.objectData.Model} - {v.objectData.PlateNumber}</option>
              ))}
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Service Type *</label>
              <select value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full p-3 border rounded-lg" required>
                <option value="">Select Type</option>
                {serviceTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Date *</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 border rounded-lg" required />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Current Mileage (km) *</label>
              <input type="number" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Cost (EGP) *</label>
              <input type="number" step="0.01" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full p-3 border rounded-lg" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Next Service Mileage (km)</label>
            <input type="number" value={formData.nextServiceMileage} onChange={e => setFormData({...formData, nextServiceMileage: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 border rounded-lg h-24" placeholder="Additional details..."></textarea>
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="flex-1 bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90">Add Record</button>
            <a href="vehicles.html" className="flex-1 text-center border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50">Cancel</a>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('AddMaintenanceForm error:', error);
    return null;
  }
}