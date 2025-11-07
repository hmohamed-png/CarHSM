function VehicleCard({ vehicles, onUpdate }) {
  try {
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [formData, setFormData] = React.useState({
      brand: '', model: '', year: '', plateNumber: '', color: '', mileage: ''
    });
    const [availableModels, setAvailableModels] = React.useState([]);

    const handleBrandChange = (brand) => {
      setFormData({...formData, brand, model: ''});
      setAvailableModels(getModels(brand));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await trickleCreateObject('vehicle', {
          Brand: formData.brand,
          Model: formData.model,
          Year: parseInt(formData.year),
          PlateNumber: formData.plateNumber,
          Color: formData.color,
          Mileage: parseInt(formData.mileage)
        });
        setShowAddModal(false);
        setFormData({ brand: '', model: '', year: '', plateNumber: '', color: '', mileage: '' });
        onUpdate();
      } catch (error) {
        console.error('Error adding vehicle:', error);
      }
    };

    return (
      <div data-name="vehicle-card" data-file="components/VehicleCard.js">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Vehicles</h2>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center space-x-2">
            <div className="icon-plus text-lg"></div>
            <span>Add Vehicle</span>
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center">
            <div className="icon-car text-5xl text-gray-300 mb-4"></div>
            <p className="text-gray-500 mb-4">No vehicles yet. Add your first vehicle to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.objectId} className="bg-white p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slideUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{vehicle.objectData.Brand} {vehicle.objectData.Model}</h3>
                    <p className="text-gray-500">{vehicle.objectData.Year}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="icon-car text-xl text-blue-600"></div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Plate:</span> {vehicle.objectData.PlateNumber}</p>
                  <p><span className="font-semibold">Mileage:</span> {vehicle.objectData.Mileage?.toLocaleString()} km</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Add New Vehicle</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Brand</label>
                  <select value={formData.brand} onChange={e => handleBrandChange(e.target.value)} className="w-full p-3 border rounded-lg" required>
                    <option value="">Select Brand</option>
                    {getBrands().map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Model</label>
                  <select value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-3 border rounded-lg" required disabled={!formData.brand}>
                    <option value="">Select Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Year</label>
                  <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full p-3 border rounded-lg" required>
                    <option value="">Select Year</option>
                    {getYears().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Plate Number</label>
                  <input type="text" placeholder="ABC 1234" value={formData.plateNumber} onChange={e => setFormData({...formData, plateNumber: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Color</label>
                  <input type="text" placeholder="White" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Current Mileage (km)</label>
                  <input type="number" placeholder="50000" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} className="w-full p-3 border rounded-lg" required />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 btn-primary">Add Vehicle</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('VehicleCard error:', error);
    return null;
  }
}
