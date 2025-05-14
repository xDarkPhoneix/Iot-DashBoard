import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useDeviceData } from '../../context/DeviceDataContext';
import { getChartOptions, getBarChartData } from '../../utils/chartConfig';

const BarChartWidget = ({ deviceId, dark }) => {
  const { deviceData, getDeviceHistory } = useDeviceData();
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const deviceHistory = getDeviceHistory(deviceId);
    setHistory(deviceHistory);
    
    const interval = setInterval(() => {
      const updatedHistory = getDeviceHistory(deviceId);
      setHistory(updatedHistory);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [deviceId, getDeviceHistory]);
  
  const device = deviceData.find(d => d.deviceId === deviceId);
  const metricName = device?.metricName || 'Value';
  const unit = device?.unit || '';
  
  const chartData = getBarChartData(history, metricName, unit, dark);
  const chartOptions = getChartOptions(dark, unit);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      {device && (
        <div className="mt-2 text-right">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Latest: </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {device.value.toFixed(1)}{unit}
          </span>
        </div>
      )}
    </div>
  );
};

export default BarChartWidget;
