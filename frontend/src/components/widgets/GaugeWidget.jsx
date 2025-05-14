import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useDeviceData } from '../../context/DeviceDataContext';
import { getGaugeChartData, getGaugeOptions } from '../../utils/chartConfig';

const GaugeWidget = ({ deviceId, dark }) => {
  const { deviceData } = useDeviceData();
  const [value, setValue] = useState(0);
  
  const device = deviceData.find(d => d.deviceId === deviceId);
  const metricName = device?.metricName || 'Value';
  const unit = device?.unit || '';
  const min = device?.range?.min || 0;
  const max = device?.range?.max || 100;
  
  useEffect(() => {
    if (device) {
      setValue(device.value);
    }
    
    const interval = setInterval(() => {
      if (device) {
        setValue(device.value);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [device]);
  
  const percentage = ((value - min) / (max - min)) * 100;
  const chartData = getGaugeChartData(percentage, dark);
  const chartOptions = getGaugeOptions(dark);
  
  const getColorClass = () => {
    if (percentage < 30) return 'text-green-500 dark:text-green-400';
    if (percentage < 70) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };
  
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full h-full relative flex items-center justify-center">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-3xl font-bold ${getColorClass()}`}>
            {value.toFixed(1)}{unit}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {metricName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeWidget;
