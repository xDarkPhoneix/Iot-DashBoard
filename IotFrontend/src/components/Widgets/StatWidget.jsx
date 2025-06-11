import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import {
  MoreVertical,
  Activity,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
  GripVertical,
} from 'lucide-react';

const StatWidget = ({ widget, onRemove }) => {
  const { devices, sensor, humid } = useDashboard();
  const [showMenu, setShowMenu] = useState(false);
  const [history, setHistory] = useState([]);

  const device = devices.find((d) => d._id === widget.deviceId); // or d.id based on your schema

  useEffect(() => {
    // console.log(widget);
    
    if (widget.dataKey === 'temperature') {
      console.log("hii",sensor);
      
      setHistory(sensor);
    } else if (widget.dataKey === 'humidity') {
      // console.log("hello",humid);
      
      setHistory(humid);
    }
  }, [widget.dataKey, sensor, humid]);

const lastEntry = history[history.length - 1];
let rawValue = 0;
if (Array.isArray(lastEntry)) {
  rawValue = lastEntry[0];
} else if (typeof lastEntry === 'object' && lastEntry !== null) {
  rawValue = lastEntry.value ?? 0;
} else {
  rawValue = lastEntry ?? 0;
}
const currentValue =
  typeof rawValue === 'number'
    ? rawValue
    : typeof rawValue === 'string'
    ? parseFloat(rawValue)
    : typeof rawValue === 'boolean'
    ? rawValue
    : 0;

  const getStatusIcon = () => {
    if (typeof currentValue === 'boolean') {
      return currentValue ? CheckCircle : AlertCircle;
    }
    return Activity;
  };

  const getStatusColor = () => {
    if (typeof currentValue === 'boolean') {
      return currentValue ? 'text-green-500' : 'text-red-500';
    }
    return widget?.config?.color || 'text-blue-500';
  };

  const getStatusText = () => {
    if (typeof currentValue === 'boolean') {
      return currentValue ? 'Active' : 'Inactive';
    }
    if (typeof currentValue === 'number') {
      return currentValue.toFixed(1);
    }
    return String(currentValue || 'N/A');
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{widget.title}</h3>
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

      {/* Main Stat */}
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <StatusIcon className={`w-8 h-8 ${getStatusColor()}`} />
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {getStatusText()}
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">{widget.dataKey}</div>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
              <div
                className={`w-2 h-2 rounded-full ${
                  device?.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="capitalize">{device?.status || 'offline'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Last updated:</span>
          <span className="text-gray-900 dark:text-white">
            {device?.data?.timestamp
              ? new Date(device.data.timestamp).toLocaleTimeString()
              : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatWidget;