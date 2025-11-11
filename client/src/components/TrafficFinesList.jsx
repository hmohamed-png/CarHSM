import { useEffect, useState } from 'react';
import { trickleListObjects, trickleUpdateObject } from '../utils/apiClient.js';

export default function TrafficFinesList() {
  try {
    const [fines, setFines] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedFine, setSelectedFine] = useState(null);

    const loadData = async () => {
      try {
        const [finesData, vehiclesData] = await Promise.all([
          trickleListObjects('traffic_fine', 100, true),
          trickleListObjects('vehicle', 50, true)
        ]);
        setFines(finesData.items || []);
        setVehicles(vehiclesData.items || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    useEffect(() => {
      loadData();
    }, []);

    const handlePayment = (fine) => {
      setSelectedFine(fine);
      setShowPayModal(true);
    };

    const processPayment = async () => {
      if (!selectedFine) return;
      try {
        await trickleUpdateObject('traffic_fine', selectedFine.objectId, {
          Status: 'Paid',
          PaymentReference: `FWR${Date.now()}`
        });
        setShowPayModal(false);
        loadData();
      } catch (error) {
        console.error('Payment error:', error);
      }
    };

    const getVehicleName = (vehicleId) => {
      const vehicle = vehicles.find((v) => v.objectId === vehicleId);
      return vehicle ? `${vehicle.objectData.Brand} ${vehicle.objectData.Model}` : 'Unknown';
    };

    const totalPending = fines
      .filter((fine) => fine.objectData.Status === 'Pending')
      .reduce((sum, fine) => sum + (fine.objectData.Amount || 0), 0);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Traffic Fines</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Fines</p>
            <p className="text-3xl font-bold text-[var(--primary-color)]">{fines.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Pending Amount</p>
            <p className="text-3xl font-bold text-orange-600">{totalPending} EGP</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Paid This Year</p>
            <p className="text-3xl font-bold text-green-600">
              {fines.filter((fine) => fine.objectData.Status === 'Paid').length}
            </p>
          </div>
        </div>

        {fines.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="icon-shield-check text-5xl text-green-500 mb-4" />
            <p className="text-gray-500">No traffic fines. Keep driving safely!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fines.map((fine, index) => {
              const isPending = fine.objectData.Status === 'Pending';
              const dueDate = new Date(fine.objectData.DueDate);
              const isOverdue = isPending && dueDate < new Date();

              return (
                <div
                  key={fine.objectId}
                  className={`bg-white rounded-xl shadow hover:shadow-lg p-6 border-l-4 transition-all duration-300 ${
                    isPending ? (isOverdue ? 'border-red-500' : 'border-orange-500') : 'border-green-500'
                  }`}
                  style={{ animation: 'slideUp 0.5s ease-out', animationDelay: `${index * 0.05}s`, animationFillMode: 'backwards' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold">{fine.objectData.FineType}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            fine.objectData.Status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : fine.objectData.Status === 'Appealed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {fine.objectData.Status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{getVehicleName(fine.objectData.VehicleId)}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <p>
                          <span className="font-semibold">Location:</span> {fine.objectData.Location}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span> {new Date(fine.objectData.Date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold">Due:</span> {dueDate.toLocaleDateString()}
                        </p>
                        {fine.objectData.PaymentReference && (
                          <p>
                            <span className="font-semibold">Ref:</span> {fine.objectData.PaymentReference}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[var(--primary-color)] mb-4">{fine.objectData.Amount} EGP</p>
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => handlePayment(fine)}
                          className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90"
                        >
                          Pay with Fawry
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showPayModal && selectedFine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Pay with Fawry</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">{selectedFine.objectData.FineType}</p>
                <p className="text-3xl font-bold text-[var(--primary-color)]">{selectedFine.objectData.Amount} EGP</p>
              </div>
              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600">Pay at any Fawry location or through the Fawry app using this reference:</p>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-600 mb-1">Reference Number</p>
                  <p className="text-2xl font-bold text-blue-600">FWR{selectedFine.objectId.slice(-8)}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={processPayment}
                  className="flex-1 bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90"
                >
                  Mark as Paid
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('TrafficFinesList error:', error);
    return null;
  }
}
