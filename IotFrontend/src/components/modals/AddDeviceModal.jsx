import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { X, Plus, Zap } from 'lucide-react';

const AddDeviceModal = ({ isOpen, onClose }) => {
  const { addDevice } = useDashboard();
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'sensor',
    location: '',
    status: 'online',
    controls: []
  });

  const [showControlForm, setShowControlForm] = useState(false);
  const [newControl, setNewControl] = useState({
    name: '',
    type: 'toggle',
    value: false,
    min: 0,
    max: 100,
    unit: ''
  });

  if (!isOpen) return null;

  const handleAddControl = () => {
    const control = {
      id: `control-${Date.now()}`,
      ...newControl,
      value:
        newControl.type === 'toggle'
          ? false
          : newControl.type === 'slider'
          ? newControl.min
          : null
    };

    setNewDevice(prev => ({
      ...prev,
      controls: [...prev.controls, control]
    }));

    setNewControl({
      name: '',
      type: 'toggle',
      value: false,
      min: 0,
      max: 100,
      unit: ''
    });
    setShowControlForm(false);
  };

  const handleRemoveControl = (controlId) => {
    setNewDevice(prev => ({
      ...prev,
      controls: prev.controls.filter(c => c.id !== controlId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (newDevice.name || !newDevice.location) {
      alert('Future Scope ');
      return;
    }

    const deviceToAdd = {
      ...newDevice,
      data: {
        timestamp: new Date(),
        values: {
          ...(newDevice.type === 'sensor' && {
            temperature: 20 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            battery: 80 + Math.random() * 20
          }),
          ...(newDevice.type === 'actuator' && {
            power: Math.random() > 0.5,
            brightness: Math.floor(Math.random() * 100)
          }),
          ...(newDevice.type === 'controller' && {
            temperature: 20 + Math.random() * 5,
            targetTemp: 22,
            power: true
          }),
          ...(newDevice.type === 'camera' && {
            recording: Math.random() > 0.5,
            motion: Math.random() > 0.8,
            storage: 75 + Math.random() * 20
          })
        }
      }
    };

    addDevice(deviceToAdd);
    onClose();
    setNewDevice({
      name: '',
      type: 'sensor',
      location: '',
      status: 'online',
      controls: []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Device
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Device Name *
              </label>
              <input
                type="text"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter device name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Device Type *
              </label>
              <select
                value={newDevice.type}
                onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value  })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="sensor">Sensor</option>
                <option value="actuator">Actuator</option>
                <option value="camera">Camera</option>
                <option value="controller">Controller</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={newDevice.location}
                onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter device location"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Initial Status
              </label>
              <select
                value={newDevice.status}
                onChange={(e) => setNewDevice({ ...newDevice, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          {/* Device Type Description */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Device Type: {newDevice.type.charAt(0).toUpperCase() + newDevice.type.slice(1)}
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              {newDevice.type === 'sensor' && 'Sensors collect and transmit data from the environment (temperature, humidity, motion, etc.)'}
              {newDevice.type === 'actuator' && 'Actuators perform physical actions based on commands (lights, motors, valves, etc.)'}
              {newDevice.type === 'camera' && 'Cameras capture visual data and can detect motion or objects'}
              {newDevice.type === 'controller' && 'Controllers manage and coordinate other devices (thermostats, hubs, etc.)'}
            </p>
          </div>

          {/* Controls Section */}
          {(newDevice.type === 'actuator' || newDevice.type === 'controller') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Device Controls
                </h4>
                <button
                  type="button"
                  onClick={() => setShowControlForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Control</span>
                </button>
              </div>

              {/* Existing Controls */}
              {newDevice.controls.length > 0 && (
                <div className="space-y-3">
                  {newDevice.controls.map((control) => (
                    <div key={control.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {control.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 capitalize">
                          ({control.type})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveControl(control.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Control Form */}
              {showControlForm && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900 dark:text-white">Add New Control</h5>
                    <button
                      type="button"
                      onClick={() => setShowControlForm(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Control Name
                      </label>
                      <input
                        type="text"
                        value={newControl.name}
                        onChange={(e) => setNewControl({ ...newControl, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                        placeholder="e.g., Power, Brightness"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Control Type
                      </label>
                      <select
                        value={newControl.type}
                        onChange={(e) => setNewControl({ ...newControl, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                      >
                        <option value="toggle">Toggle Switch</option>
                        <option value="slider">Slider</option>
                        <option value="button">Button</option>
                      </select>
                    </div>

                    {newControl.type === 'slider' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Min Value
                          </label>
                          <input
                            type="number"
                            value={newControl.min}
                            onChange={(e) => setNewControl({ ...newControl, min: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Max Value
                          </label>
                          <input
                            type="number"
                            value={newControl.max}
                            onChange={(e) => setNewControl({ ...newControl, max: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Unit (optional)
                          </label>
                          <input
                            type="text"
                            value={newControl.unit}
                            onChange={(e) => setNewControl({ ...newControl, unit: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                            placeholder="e.g., %, °C, W"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowControlForm(false)}
                      className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddControl}
                      disabled={!newControl.name}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      Add Control
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Device Preview
            </h4>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {newDevice.name || 'Device Name'}
                  </h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {newDevice.type} • {newDevice.location || 'Location'}
                  </p>
                </div>
              </div>
              {newDevice.controls.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Controls: {newDevice.controls.map(c => c.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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
