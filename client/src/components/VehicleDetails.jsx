import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trickleListObjects } from '../utils/apiClient.js';
import MaintenanceTimeline from './MaintenanceTimeline.jsx';

export default function VehicleDetails() {
  try {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadVehicles = async () => {
        try {
          const data = await trickleListObjects('vehicle', 20, true);
          const items = data.items || [];
          setVehicles(items);
          if (items.length > 0) {
            setSelectedVehicle(items[0]);
          }
        } catch (error) {
          console.error('Error loading vehicles:', error);
        } finally {
          setLoading(false);
        }
      };

      loadVehicles();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    if (vehicles.length === 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 mb-4">No vehicles found</p>
          <a href="/dashboard" className="btn-primary inline-block">
            Add Vehicle
          </a>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Vehicles</h1>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow">
              <h2 className="font-bold mb-4">Select Vehicle</h2>
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <button
                    key={vehicle.objectId}
                    type="button"
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedVehicle?.objectId === vehicle.objectId
                        ? 'bg-[var(--primary-color)] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-semibold">
                      {vehicle.objectData.Brand} {vehicle.objectData.Model}
                    </p>
                    <p className="text-sm opacity-75">{vehicle.objectData.PlateNumber}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            {selectedVehicle && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">
                      {selectedVehicle.objectData.Brand} {selectedVehicle.objectData.Model}
                    </h2>
                    <Link
                      to={`/add-maintenance?vehicleId=${selectedVehicle.objectId}`}
                      className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center space-x-2"
                    >
                      <div className="icon-plus text-lg" />
                      <span>Add Service</span>
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold">Year:</span> {selectedVehicle.objectData.Year}
                    </div>
                    <div>
                      <span className="font-semibold">Plate:</span> {selectedVehicle.objectData.PlateNumber}
                    </div>
                    <div>
                      <span className="font-semibold">Color:</span> {selectedVehicle.objectData.Color}
                    </div>
                    <div>
                      <span className="font-semibold">Mileage:</span>{' '}
                      {selectedVehicle.objectData.Mileage ? selectedVehicle.objectData.Mileage.toLocaleString() : 0} km
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow">
                  <h3 className="text-xl font-bold mb-4">Maintenance History</h3>
                  <MaintenanceTimeline vehicleId={selectedVehicle.objectId} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('VehicleDetails error:', error);
    return null;
  }
}
