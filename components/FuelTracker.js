function FuelTracker() {
  try {
    const [vehicles, setVehicles] = React.useState([]);
    const [fuelRecords, setFuelRecords] = React.useState([]);
    const [selectedVehicle, setSelectedVehicle] = React.useState(null);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [formData, setFormData] = React.useState({ vehicleId: '', date: '', liters: '', cost: '', mileage: '', fullTank: true });
    const chartRef = React.useRef(null);

    React.useEffect(() => {
      loadData();
    }, []);

    React.useEffect(() => {
      if (selectedVehicle) createChart();
    }, [selectedVehicle, fuelRecords]);

    const loadData = async () => {
      try {
        const [vehiclesData, fuelData] = await Promise.all([
          window.trickleListObjects('vehicle', 50, true),
          window.trickleListObjects('fuel_record', 200, true)
        ]);
        setVehicles(vehiclesData.items || []);
        setFuelRecords(fuelData.items || []);
        if (vehiclesData.items?.length > 0) setSelectedVehicle(vehiclesData.items[0].objectId);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await window.trickleCreateObject('fuel_record', {
          VehicleId: formData.vehicleId,
          Date: formData.date,
          Liters: parseFloat(formData.liters),
          Cost: parseFloat(formData.cost),
          Mileage: parseInt(formData.mileage),
          FullTank: formData.fullTank
        });
        setShowAddModal(false);
        setFormData({ vehicleId: '', date: '', liters: '', cost: '', mileage: '', fullTank: true });
        loadData();
      } catch (error) {
        console.error('Error adding fuel record:', error);
      }
    };

    const createChart = () => {
      const filtered = fuelRecords.filter(r => r.objectData.VehicleId === selectedVehicle).slice(-10);
      const ctx = document.getElementById('fuelChart');
      if (ctx && chartRef.current) chartRef.current.destroy();
      if (ctx && filtered.length > 0) {
        chartRef.current = new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: filtered.map(r => new Date(r.objectData.Date).toLocaleDateString()),
            datasets: [{
              label: 'Cost per Fill (EGP)',
              data: filtered.map(r => r.objectData.Cost),
              borderColor: '#DC143C',
              tension: 0.4
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
    };

    const vehicleRecords = fuelRecords.filter(r => r.objectData.VehicleId === selectedVehicle);
    const totalSpent = vehicleRecords.reduce((sum, r) => sum + (r.objectData.Cost || 0), 0);
    const totalLiters = vehicleRecords.reduce((sum, r) => sum + (r.objectData.Liters || 0), 0);
    const avgCost = vehicleRecords.length > 0 ? totalSpent / vehicleRecords.length : 0;

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Fuel Tracking</h1>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 flex items-center space-x-2">
            <div className="icon-plus text-lg"></div>
            <span>Add Fuel Record</span>
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500">No vehicles found. Add a vehicle first.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <select value={selectedVehicle || ''} onChange={e => setSelectedVehicle(e.target.value)} className="p-3 border rounded-lg">
                {vehicles.map(v => (
                  <option key={v.objectId} value={v.objectId}>{v.objectData.Brand} {v.objectData.Model} - {v.objectData.PlateNumber}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-[var(--primary-color)]">{totalSpent.toFixed(0)} EGP</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Total Liters</p>
                <p className="text-3xl font-bold text-[var(--primary-color)]">{totalLiters.toFixed(1)} L</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-600 text-sm mb-2">Avg Cost/Fill</p>
                <p className="text-3xl font-bold text-[var(--primary-color)]">{avgCost.toFixed(0)} EGP</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Fuel Cost Trend</h2>
              <canvas id="fuelChart"></canvas>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Fill-ups</h2>
              {vehicleRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No fuel records yet</p>
              ) : (
                <div className="space-y-3">
                  {vehicleRecords.slice(0, 10).map(record => (
                    <div key={record.objectId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{new Date(record.objectData.Date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{record.objectData.Liters}L at {record.objectData.Mileage?.toLocaleString()} km</p>
                      </div>
                      <p className="text-lg font-bold text-[var(--primary-color)]">{record.objectData.Cost} EGP</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Add Fuel Record</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Vehicle *</label>
                  <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full p-3 border rounded-lg" required>
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.objectId} value={v.objectId}>{v.objectData.Brand} {v.objectData.Model}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Date *</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 border rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Liters *</label>
                    <input type="number" step="0.01" value={formData.liters} onChange={e => setFormData({...formData, liters: e.target.value})} className="w-full p-3 border rounded-lg" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Cost (EGP) *</label>
                    <input type="number" step="0.01" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full p-3 border rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mileage (km) *</label>
                    <input type="number" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} className="w-full p-3 border rounded-lg" required />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="fullTank" checked={formData.fullTank} onChange={e => setFormData({...formData, fullTank: e.target.checked})} />
                  <label htmlFor="fullTank" className="text-sm">Full tank</label>
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90">Add Record</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('FuelTracker error:', error);
    return null;
  }
}