import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { X, Plus, Zap } from 'lucide-react';

const AddDeviceModal = ({ isOpen, onClose }) => {
  const { addDevice, user } = useDashboard();

  const initialDeviceState = {
    deviceId: "",
    name: '',
    category: 'temperature',
    status: 'offline',
    location: '',
    configuration: {
      samplingRate: 60,
      threshold: { min: 0, max: 100 },
      units: '',
      calibration: { offset: 0, scale: 1 }
    },
    isActive: true,
    lastSeen: new Date(),
    owner: user?._id || ''
  };

  const [newDevice, setNewDevice] = useState(initialDeviceState);

  const categoryOptions = ['temperature', 'humidity'];
  const statusOptions = ['online', 'offline'];

  const deviceTypeDescriptions = {
    temperature: 'Measures ambient temperature.',
    humidity: 'Monitors moisture in the air.'
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, location } = newDevice;

    if (!name || !location ) {
      alert('Please fill in all required fields');
      return;
    }

    addDevice({ ...newDevice, lastSeen: new Date(), isActive: true });
    onClose();
    setNewDevice({ ...initialDeviceState });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold">Add New Device</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1">Device ID *</label>
              <input
                type="text"
                value={newDevice.deviceId}
                onChange={(e) => setNewDevice({ ...newDevice, deviceId: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                placeholder="Enter device ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Device Name *</label>
              <input
                type="text"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                placeholder="Enter device name"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Device Category *</label>
              <select
                value={newDevice.category}
                onChange={(e) => setNewDevice({ ...newDevice, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Location *</label>
              <input
                type="text"
                value={newDevice.location}
                onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                placeholder="Enter device location"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Initial Status</label>
              <select
                value={newDevice.status}
                onChange={(e) => setNewDevice({ ...newDevice, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <p className="text-sm text-gray-400">
              <strong>Device Type:</strong> {newDevice.category}
            </p>
            <p className="text-sm mt-1">{deviceTypeDescriptions[newDevice.category]}</p>
          </div>

          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{newDevice.name || 'Device Name'}</p>
                <p className="text-sm text-gray-400">
                  {newDevice.category || 'Category'} • {newDevice.location || 'Location'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 border-t border-gray-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-gray-700 text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Device</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeviceModal;
