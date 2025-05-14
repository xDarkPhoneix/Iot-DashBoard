import { format, subMinutes } from 'date-fns';

// Generate initial mock data for IoT devices
export const generateMockData = () => {
  const devices = [
    {
      deviceId: 'temp-sensor-1',
      name: 'Temperature Sensor 1',
      type: 'temperature',
      value: 22.5,
      unit: '°C',
      trend: 0.2, // positive trend
      metricName: 'Temperature',
      status: 'online',
      battery: 85,
      range: { min: -10, max: 50 },
      location: 'Living Room',
      lastUpdated: new Date(),
    },
    {
      deviceId: 'temp-sensor-2',
      name: 'Temperature Sensor 2',
      type: 'temperature',
      value: 18.2,
      unit: '°C',
      trend: -0.5, // negative trend
      metricName: 'Temperature',
      status: 'online',
      battery: 72,
      range: { min: -10, max: 50 },
      location: 'Bedroom',
      lastUpdated: new Date(),
    },
    {
      deviceId: 'humidity-sensor-1',
      name: 'Humidity Sensor 1',
      type: 'humidity',
      value: 45.3,
      unit: '%',
      trend: 1.2,
      metricName: 'Humidity',
      status: 'online',
      battery: 90,
      range: { min: 0, max: 100 },
      location: 'Living Room',
      lastUpdated: new Date(),
    },
    {
      deviceId: 'humidity-sensor-2',
      name: 'Humidity Sensor 2',
      type: 'humidity',
      value: 52.1,
      unit: '%',
      trend: -0.8,
      metricName: 'Humidity',
      status: 'online',
      battery: 65,
      range: { min: 0, max: 100 },
      location: 'Bathroom',
      lastUpdated: new Date(),
    },
    {
      deviceId: 'pressure-sensor-1',
      name: 'Pressure Sensor 1',
      type: 'pressure',
      value: 1013.2,
      unit: 'hPa',
      trend: 0.5,
      metricName: 'Pressure',
      status: 'online',
      battery: 78,
      range: { min: 900, max: 1100 },
      location: 'Living Room',
      lastUpdated: new Date(),
    },
    {
      deviceId: 'pressure-sensor-2',
      name: 'Pressure Sensor 2',
      type: 'pressure',
      value: 1012.7,
      unit: 'hPa',
      trend: -0.3,
      metricName: 'Pressure',
      status: 'offline', // One device is offline
      battery: 12, // Low battery - reason for offline?
      range: { min: 900, max: 1100 },
      location: 'Basement',
      lastUpdated: new Date(Date.now() - 120000), // 2 minutes ago
    },
  ];

  return devices;
};

// Generate historical data for a device
export const getDeviceHistoricalData = (device, pointCount = 20) => {
  const data = [];
  const now = new Date();

  // Create data points at 2-minute intervals
  for (let i = pointCount - 1; i >= 0; i--) {
    const timestamp = subMinutes(now, i * 2);

    // Generate a realistic value based on the current value and some randomness
    // Make the historical data follow a pattern but with some noise
    const basePattern = Math.sin(i / 5) * (device.range.max - device.range.min) * 0.1;
    const noise = (Math.random() - 0.5) * (device.range.max - device.range.min) * 0.05;
    let value = device.value + basePattern + noise;

    // Ensure the value stays within the device's range
    value = Math.max(device.range.min, Math.min(device.range.max, value));

    data.push({
      timestamp,
      value,
      formattedTime: format(timestamp, 'HH:mm'),
    });
  }

  return data;
};
