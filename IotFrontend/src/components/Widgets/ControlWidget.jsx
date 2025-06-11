import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { MoreVertical, Power, Settings, X, GripVertical } from 'lucide-react';

const ControlWidget = ({ widget, onRemove }) => {
  const { devices, updateDeviceControl } = useDashboard();
  const [showMenu, setShowMenu] = useState(false);

  const device = devices.find(d => d.id === widget.deviceId);

  const handleControlChange = (controlId, value) => {
    if (device) {
      updateDeviceControl(device.id, controlId, value);
    }
  };

  const renderControl = (control) => {
    switch (control.type) {
      case 'toggle':
        return (
          <div key={control.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Power className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {control.name}
              </span>
            </div>
            <button
              onClick={() => handleControlChange(control.id, !control.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                control.value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  control.value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        );

      case 'slider':
        return (
          <div key={control.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {control.name}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {control.value}{control.unit}
              </span>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              value={control.value}
              onChange={(e) => handleControlChange(control.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{control.min}{control.unit}</span>
              <span>{control.max}{control.unit}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {widget.title}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {device?.name || 'Unknown Device'}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </button>
              <button
                onClick={onRemove}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {device?.controls?.map(renderControl)}

        {(!device?.controls || device.controls.length === 0) && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No controls available for this device
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${device?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-500 dark:text-gray-400 capitalize">
              {device?.status || 'offline'}
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-500">
            {device?.location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlWidget;