import React from 'react';
import { Thermometer, Droplets, Gauge, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { useDeviceData } from '../../context/DeviceDataContext';

const StatsWidget = ({ deviceId, dark }) => {
  const { deviceData } = useDeviceData();

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-red-500" />;
      case 'humidity':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'pressure':
        return <Gauge className="h-5 w-5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  // If 'all' is specified, show all devices stats
  const devices = deviceId === 'all' 
    ? deviceData 
    : deviceData.filter(d => d.deviceId === deviceId);

  const getStatusIndicator = (value, trend) => {
    if (trend > 0) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (trend < 0) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map(device => (
          <div 
            key={device.deviceId} 
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {getDeviceIcon(device.type)}
                <h3 className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {device.name}
                </h3>
              </div>
              {getStatusIndicator(device.value, device.trend)}
            </div>

            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {device.value.toFixed(1)}{device.unit}
              </div>
              <div className="text-xs text-gray-500">
                Range: {device.range.min}{device.unit} - {device.range.max}{device.unit}
              </div>
              <div className="mt-2 text-xs">
                <span className="text-gray-500 dark:text-gray-400">Status: </span>
                <span className={device.status === 'online' ? 'text-green-500' : 'text-red-500'}>
                  {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsWidget;
