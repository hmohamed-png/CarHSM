import { useEffect, useState } from 'react';
import { trickleCreateObject, trickleDeleteObject, trickleListObjects } from '../utils/apiClient.js';

const documentTypes = ['Insurance', 'Registration', 'License', 'Inspection', 'Receipt', 'Other'];

export default function DocumentsManager() {
  try {
    const [documents, setDocuments] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ vehicleId: '', title: '', type: 'Insurance', expiryDate: '', notes: '' });

    const loadData = async () => {
      try {
        const [docsData, vehiclesData] = await Promise.all([
          trickleListObjects('document', 100, true),
          trickleListObjects('vehicle', 50, true)
        ]);
        setDocuments(docsData.items || []);
        setVehicles(vehiclesData.items || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    useEffect(() => {
      loadData();
    }, []);

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        await trickleCreateObject('document', {
          VehicleId: formData.vehicleId,
          Title: formData.title,
          Type: formData.type,
          ExpiryDate: formData.expiryDate || null,
          Notes: formData.notes
        });
        setShowAddModal(false);
        setFormData({ vehicleId: '', title: '', type: 'Insurance', expiryDate: '', notes: '' });
        loadData();
      } catch (error) {
        console.error('Error adding document:', error);
      }
    };

    const deleteDocument = async (id) => {
      try {
        await trickleDeleteObject('document', id);
        loadData();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    };

    const getVehicleName = (vehicleId) => {
      const vehicle = vehicles.find((v) => v.objectId === vehicleId);
      return vehicle ? `${vehicle.objectData.Brand} ${vehicle.objectData.Model}` : 'Unknown';
    };

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Documents</h1>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold hover:opacity-90 flex items-center space-x-2"
          >
            <div className="icon-plus text-lg" />
            <span>Add Document</span>
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="icon-file-text text-5xl text-gray-300 mb-4" />
            <p className="text-gray-500">No documents yet. Add your first document!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.objectId} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="icon-file-text text-xl text-blue-600" />
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteDocument(doc.objectId)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <div className="icon-trash-2 text-lg text-red-600" />
                  </button>
                </div>
                <h3 className="font-bold mb-2">{doc.objectData.Title}</h3>
                <p className="text-sm text-gray-600 mb-2">{getVehicleName(doc.objectData.VehicleId)}</p>
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold mb-2">
                  {doc.objectData.Type}
                </span>
                {doc.objectData.ExpiryDate && (
                  <p className="text-sm text-gray-500">
                    Expires: {new Date(doc.objectData.ExpiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Add Document</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div>
                  <label className="block text-sm font-semibold mb-2">Document Type *</label>
                  <select
                    value={formData.type}
                    onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value }))}
                    className="w-full p-3 border rounded-lg"
                    required
                  >
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="e.g., Car Insurance Policy"
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(event) => setFormData((prev) => ({ ...prev, expiryDate: event.target.value }))}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
                    className="w-full p-3 border rounded-lg h-20"
                    placeholder="Additional information..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:opacity-90">
                    Add Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('DocumentsManager error:', error);
    return null;
  }
}
