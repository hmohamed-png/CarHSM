import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trickleCreateObject, trickleListObjects } from '../utils/apiClient.js';

const serviceTypes = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Battery Replacement',
  'Air Filter',
  'Transmission Service',
  'Coolant Flush',
  'Spark Plugs',
  'Inspection',
  'Other'
];

export default function AddMaintenanceForm() {
  try {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
      vehicleId: '',
      serviceType: '',
      date: '',
      mileage: '',
      cost: '',
      notes: '',
      nextServiceMileage: ''
    });
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const vehicleFromQuery = useMemo(() => {
      const params = new URLSearchParams(location.search);
      return params.get('vehicleId') || '';
    }, [location.search]);

    useEffect(() => {
      const loadVehicles = async () => {
        try {
          const data = await trickleListObjects('vehicle', 50, true);
          setVehicles(data.items || []);
        } catch (error) {
          console.error('Error loading vehicles:', error);
        }
      };

      loadVehicles();
    }, []);

    useEffect(() => {
      if (vehicleFromQuery) {
        setFormData((prev) => ({ ...prev, vehicleId: vehicleFromQuery }));
      }
    }, [vehicleFromQuery]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        await trickleCreateObject('maintenance', {
          VehicleId: formData.vehicleId,
          ServiceType: formData.serviceType,
          Date: formData.date,
          Mileage: parseInt(formData.mileage, 10),
          Cost: parseFloat(formData.cost),
          Notes: formData.notes,
          NextServiceMileage: formData.nextServiceMileage ? parseInt(formData.nextServiceMileage, 10) : null
        });
        setSuccess(true);
        setTimeout(() => navigate('/vehicles'), 2000);
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
            <select
              value={formData.vehicleId}
              onChange={(event) => setFormData((prev) => ({ ...prev, vehicleId: event.target.value }))}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.objectId} value={vehicle.objectId}>
                  {vehicle.objectData.Brand} {vehicle.objectData.Model} - {vehicle.objectData.PlateNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Service Type *</label>
              <select
                value={formData.serviceType}
                onChange={(event) => setFormData((prev) => ({ ...prev, serviceType: event.target.value }))}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Type</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Current Mileage (km) *</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(event) => setFormData((prev) => ({ ...prev, mileage: event.target.value }))}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Cost (EGP) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(event) => setFormData((prev) => ({ ...prev, cost: event.target.value }))}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Next Service Mileage (km)</label>
            <input
              type="number"
              value={formData.nextServiceMileage}
              onChange={(event) => setFormData((prev) => ({ ...prev, nextServiceMileage: event.target.value }))}
              className="w-full p-3 border rounded-lg"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
              className="w-full p-3 border rounded-lg h-24"
              placeholder="Additional details..."
            />
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="flex-1 bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90">
              Add Record
            </button>
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              className="flex-1 text-center border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    console.error('AddMaintenanceForm error:', error);
    return null;
  }
}
