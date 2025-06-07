import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { MoreVertical, AlertTriangle } from 'lucide-react';

const GaugeWidget = ({ widget }) => {
  const { devices } = useDashboard();
  
  const device = devices.find(d => d.id === widget.deviceId);
  const currentValue = device?.data?.values[widget.dataKey || ''] || 0;
  
  const min = widget.config?.threshold?.min || 0;
  const max = widget.config?.threshold?.max || 100;
  const percentage = Math.min(Math.max(((currentValue - min) / (max - min)) * 100, 0), 100);
  
  const isInThreshold = currentValue >= min && currentValue <= max;
  const color = widget.config?.color || '#3B82F6';

  // Arc config
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {widget.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {device?.name || 'Unknown Device'}
            </span>
            {!isInThreshold && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-in-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentValue.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {widget.dataKey}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="w-full mt-4 space-y-2">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Min: {min}</span>
            <span>Max: {max}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: isInThreshold ? color : '#EF4444'
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between w-full text-sm">
          <span className="text-gray-500 dark:text-gray-400">Status:</span>
          <span className={`font-medium ${isInThreshold ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isInThreshold ? 'Normal' : 'Out of Range'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GaugeWidget;
