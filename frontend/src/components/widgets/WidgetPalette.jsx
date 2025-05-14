import React, { useState } from 'react';
import { X, BarChart, LineChart, PieChart, Activity } from 'lucide-react';

const widgetTypes = [
  { id: 'line-chart', name: 'Line Chart', icon: LineChart, description: 'Real-time line chart for time series data' },
  { id: 'bar-chart', name: 'Bar Chart', icon: BarChart, description: 'Bar chart for comparing values' },
  { id: 'gauge', name: 'Gauge Chart', icon: PieChart, description: 'Gauge for displaying a single value' },
  { id: 'stats', name: 'Stats Card', icon: Activity, description: 'Statistics overview of multiple metrics' },
];

const WidgetPalette = ({ onClose, onAddWidget, devices }) => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [widgetTitle, setWidgetTitle] = useState('');

  const handleAddWidget = () => {
    if (selectedType && selectedDevice && widgetTitle) {
      onAddWidget(selectedType, selectedDevice, widgetTitle);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Add New Widget</h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Widget Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {widgetTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`p-3 border rounded-md flex flex-col items-center text-center transition ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <type.icon
                    className={`h-5 w-5 ${
                      selectedType === type.id
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500'
                    } mb-1`}
                  />
                  <span className="text-sm font-medium">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="widget-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Widget Title
            </label>
            <input
              type="text"
              id="widget-title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter widget title"
              value={widgetTitle}
              onChange={(e) => setWidgetTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="device-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Device
            </label>
            <select
              id="device-select"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              <option value="">Select a device</option>
              {devices.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
              {selectedType === 'stats' && (
                <option value="all">All Devices</option>
              )}
            </select>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                selectedType && selectedDevice && widgetTitle
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={handleAddWidget}
              disabled={!selectedType || !selectedDevice || !widgetTitle}
            >
              Add Widget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetPalette;
