import React, { useState } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { X, Plus, BarChart3, Gauge, Activity, Settings } from 'lucide-react';

const AddWidgetModal = ({ isOpen, onClose }) => {
  const { devices, addWidget } = useDashboard();
  const [selectedType, setSelectedType] = useState('chart');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedDataKey, setSelectedDataKey] = useState('');
  const [widgetTitle, setWidgetTitle] = useState('');
  const [chartType, setChartType] = useState('line');
  const [color, setColor] = useState('#3B82F6');
  const [thresholdMin, setThresholdMin] = useState(0);
  const [thresholdMax, setThresholdMax] = useState(100);

  if (!isOpen) return null;

  const widgetTypes = [
    {
      type: 'chart',
      name: 'Chart Widget',
      description: 'Display data trends over time',
      icon: BarChart3,
      color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
    },
    {
      type: 'gauge',
      name: 'Gauge Widget',
      description: 'Show current values with thresholds',
      icon: Gauge,
      color: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
    },
    {
      type: 'stat',
      name: 'Stat Widget',
      description: 'Display single value statistics',
      icon: Activity,
      color: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
    },
    {
      type: 'control',
      name: 'Control Widget',
      description: 'Interactive device controls',
      icon: Settings,
      color: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400'
    }
  ];

  const selectedDeviceObj = devices.find(d => d.id === selectedDevice);
  const availableDataKeys = selectedDeviceObj?.data?.values ? Object.keys(selectedDeviceObj.data.values) : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!widgetTitle || !selectedDevice) {
      alert('Please fill in all required fields');
      return;
    }

    if ((selectedType === 'chart' || selectedType === 'gauge' || selectedType === 'stat') && !selectedDataKey) {
      alert('Please select a data key for this widget type');
      return;
    }

    const newWidget = {
      type: selectedType,
      title: widgetTitle,
      deviceId: selectedDevice,
      dataKey: selectedType !== 'control' ? selectedDataKey : undefined,
      position: { x: 0, y: 0, width: 1, height: 1 },
      config: {
        chartType: selectedType === 'chart' ? chartType : undefined,
        color,
        threshold: selectedType === 'gauge' ? { min: thresholdMin, max: thresholdMax } : undefined,
        timeRange: selectedType === 'chart' ? '24h' : undefined,
        showLegend: selectedType === 'chart' ? true : undefined
      }
    };

    addWidget(newWidget);
    onClose();

    setWidgetTitle('');
    setSelectedDevice('');
    setSelectedDataKey('');
    setSelectedType('chart');
    setChartType('line');
    setColor('#3B82F6');
    setThresholdMin(0);
    setThresholdMax(100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Widget</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Widget Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {widgetTypes.map((type) => (
                <button
                  key={type.type}
                  type="button"
                  onClick={() => setSelectedType(type.type)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedType === type.type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{type.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Widget Title *</label>
              <input
                type="text"
                value={widgetTitle}
                onChange={(e) => setWidgetTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter widget title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Device *</label>
              <select
                value={selectedDevice}
                onChange={(e) => {
                  setSelectedDevice(e.target.value);
                  setSelectedDataKey('');
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select a device</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedType !== 'control' && selectedDevice && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Key *</label>
              <select
                value={selectedDataKey}
                onChange={(e) => setSelectedDataKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select data to display</option>
                {availableDataKeys.map((key) => (
                  <option key={key} value={key}>
                    {key} ({typeof selectedDeviceObj?.data?.values[key]})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedType === 'chart' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chart Type</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {selectedType === 'gauge' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Threshold</label>
                <input
                  type="number"
                  value={thresholdMin}
                  onChange={(e) => setThresholdMin(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maximum Threshold</label>
                <input
                  type="number"
                  value={thresholdMax}
                  onChange={(e) => setThresholdMax(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {selectedDevice && widgetTitle && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900 dark:text-white">{widgetTitle}</h5>
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Device: {selectedDeviceObj?.name}</p>
                {selectedDataKey && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data: {selectedDataKey}</p>
                )}
              </div>
            </div>
          )}

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
              <span>Add Widget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWidgetModal;
