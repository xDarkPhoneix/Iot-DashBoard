
import React, { useState } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { Zap, Bluetooth, WifiOff, MapPin, Clock, Settings, Trash2, Plus, X, Save, BluetoothOff } from 'lucide-react';
import { useEffect } from 'react';

const DeviceManagement = () => {
  const { devices, updateDevice, removeDevice, addDevice } = useDashboard();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configDevice, setConfigDevice] = useState(null);

  useEffect(()=>{
    console.log("vvv",devices);
    
  },[])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <Bluetooth className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <BluetoothOff className="w-5 h-5 text-red-500" />;
      default:
        return <BluetoothOff className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getDeviceTypeIcon = (type) => {
    return <Zap className="w-6 h-6 text-blue-500" />;
  };

  const handleRemoveDevice = (deviceId) => {
    if (window.confirm('Are you sure you want to remove this device? This action cannot be undone.')) {
      removeDevice(deviceId);
    }
  };

  const handleConfigureDevice = (device) => {
    setConfigDevice({ ...device });
    setShowConfigModal(true);
  };

  const handleSaveConfig = () => {
    if (configDevice) {
      updateDevice(configDevice.id, configDevice);
      setShowConfigModal(false);
      setConfigDevice(null);
    }
  };

  const DeviceConfigModal = () => {
    if (!showConfigModal || !configDevice) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Configure Device: {configDevice.name}
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device Name
                </label>
                <input
                  type="text"
                  value={configDevice.name}
                  onChange={(e) => setConfigDevice({ ...configDevice, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={configDevice.location}
                  onChange={(e) => setConfigDevice({ ...configDevice, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* c */}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={configDevice.status}
                  onChange={(e) => setConfigDevice({ ...configDevice, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>

            {configDevice.controls && configDevice.controls.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Device Controls</h4>
                <div className="space-y-4">
                  {configDevice.controls.map((control, index) => (
                    <div key={control.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Control Name
                          </label>
                          <input
                            type="text"
                            value={control.name}
                            onChange={(e) => {
                              const newControls = [...configDevice.controls];
                              newControls[index] = { ...control, name: e.target.value };
                              setConfigDevice({ ...configDevice, controls: newControls });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                          </label>
                          <select
                            value={control.type}
                            onChange={(e) => {
                              const newControls = [...configDevice.controls];
                              newControls[index] = { ...control, type: e.target.value };
                              setConfigDevice({ ...configDevice, controls: newControls });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="toggle">Toggle</option>
                            <option value="slider">Slider</option>
                            <option value="button">Button</option>
                          </select>
                        </div>
                        {control.type === 'slider' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Min
                              </label>
                              <input
                                type="number"
                                value={control.min || 0}
                                onChange={(e) => {
                                  const newControls = [...configDevice.controls];
                                  newControls[index] = { ...control, min: parseInt(e.target.value) };
                                  setConfigDevice({ ...configDevice, controls: newControls });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max
                              </label>
                              <input
                                type="number"
                                value={control.max || 100}
                                onChange={(e) => {
                                  const newControls = [...configDevice.controls];
                                  newControls[index] = { ...control, max: parseInt(e.target.value) };
                                  setConfigDevice({ ...configDevice, controls: newControls });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              onClick={() => setShowConfigModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConfig}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
       <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Device Management
        </h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Device</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div
            key={device._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Zap/>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {device.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    Sensor
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(device.status)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{device.location}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>
                  Last seen: {new Date(device.lastSeen).toLocaleString()}
                </span>
              </div>

              {device.data && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Current Data
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(device.data.values).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {key}:
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {typeof value === 'boolean' 
                            ? (value ? 'True' : 'False')
                            : typeof value === 'number'
                            ? value.toFixed(2)
                            : String(value)
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {device.controls && device.controls.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Controls Available
                  </h4>
                  <div className="space-y-1">
                    {device.controls.map((control) => (
                      <div key={control.id} className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          {control.name}:
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium capitalize">
                          {control.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium capitalize px-2 py-1 rounded-full ${
                  device.status === 'online' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' :
                  device.status === 'offline' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' :
                  'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {device.status}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleConfigureDevice(device)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configure</span>
                </button>
                <button 
                  onClick={() => handleRemoveDevice(device.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DeviceConfigModal />
    </div>
  );
};

export default DeviceManagement;
