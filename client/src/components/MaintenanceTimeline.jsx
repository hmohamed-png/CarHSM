import { useEffect, useState } from 'react';
import { trickleListObjects } from '../utils/apiClient.js';

export default function MaintenanceTimeline({ vehicleId }) {
  try {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadRecords = async () => {
        try {
          const data = await trickleListObjects('maintenance', 50, true);
          const filtered = data.items?.filter((record) => record.objectData.VehicleId === vehicleId) || [];
          setRecords(filtered);
        } catch (error) {
          console.error('Error loading maintenance records:', error);
        } finally {
          setLoading(false);
        }
      };

      if (vehicleId) {
        setLoading(true);
        loadRecords();
      }
    }, [vehicleId]);

    if (loading) return <p className="text-center py-4">Loading...</p>;

    if (records.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="icon-wrench text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500">No maintenance records yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {records.map((record) => (
          <div key={record.objectId} className="flex items-start space-x-4 pb-4 border-b last:border-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="icon-wrench text-xl text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold">{record.objectData.ServiceType}</h4>
                <span className="text-sm font-bold text-[var(--primary-color)]">
                  {record.objectData.Cost ? record.objectData.Cost.toLocaleString() : 0} EGP
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(record.objectData.Date || record.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {record.objectData.Mileage ? record.objectData.Mileage.toLocaleString() : 0} km
              </p>
              {record.objectData.Notes && <p className="text-sm text-gray-600 mt-2">{record.objectData.Notes}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('MaintenanceTimeline error:', error);
    return null;
  }
}
