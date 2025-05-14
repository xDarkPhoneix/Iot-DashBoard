export const DeviceRange = {
  min: 0,
  max: 100,
};

export const DeviceData = {
  deviceId: '',
  name: '',
  type: '',
  value: 0,
  unit: '',
  trend: 0,
  metricName: '',
  status: 'offline', // or 'online'
  battery: 0,
  range: DeviceRange,
  location: '',
  lastUpdated: new Date(),
};
