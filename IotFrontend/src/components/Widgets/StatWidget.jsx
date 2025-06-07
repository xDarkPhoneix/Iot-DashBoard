import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { MoreVertical, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const StatWidget = ({ widget }) => {
  const { devices } = useDashboard();
  
  const device = devices.find(d => d.id === widget.deviceId);
  const currentValue = device?.data?.values[widget.dataKey || ''];

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
    return widget.config?.color || 'text-blue-500';
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {widget.title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {device?.name || 'Unknown Device'}
          </span>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <StatusIcon className={`w-8 h-8 ${getStatusColor()}`} />
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {getStatusText()}
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {widget.dataKey}
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
              <div className={`w-2 h-2 rounded-full ${device?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="capitalize">{device?.status || 'offline'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Last updated:</span>
          <span className="text-gray-900 dark:text-white">
            {device?.data?.timestamp ? new Date(device.data.timestamp).toLocaleTimeString() : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatWidget;
