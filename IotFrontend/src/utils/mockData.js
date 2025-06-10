export const mockDevices = [
  {
    id: 'device-1',
    name: 'Living Room Sensor',
    type: 'sensor',
    status: 'online',
    lastSeen: new Date(),
    location: 'Living Room',
    data: {
      timestamp: new Date(),
      values: {
        temperature: 8,
        humidity: 45.2,
        // pressure: 1013.2,
        // light: 350
      }
    }
  },
  {
    id: 'device-2',
    name: 'Smart Thermostat',
    type: 'controller',
    status: 'online',
    lastSeen: new Date(),
    location: 'Hallway',
    controls: [
      {
        id: 'temp-control',
        name: 'Target Temperature',
        type: 'slider',
        value: 21,
        min: 15,
        max: 30,
        unit: '°C'
      },
      {
        id: 'power-toggle',
        name: 'Power',
        type: 'toggle',
        value: true
      }
    ],
    data: {
      timestamp: new Date(),
      values: {
        // currentTemp: 21.5,
        targetTemp: 21,
        // power: true
      }
    }
  },
  {
    id: 'device-3',
    name: 'Motion Detector',
    type: 'sensor',
    status: 'online',
    lastSeen: new Date(),
    location: 'Front Door',
    data: {
      timestamp: new Date(),
      values: {
        motion: false,
        // battery: 85
      }
    }
  },
  // {
  //   id: 'device-4',
  //   name: 'Smart Light',
  //   type: 'actuator',
  //   status: 'online',
  //   lastSeen: new Date(),
  //   location: 'Kitchen',
  //   controls: [
  //     {
  //       id: 'brightness',
  //       name: 'Brightness',
  //       type: 'slider',
  //       value: 75,
  //       min: 0,
  //       max: 100,
  //       unit: '%'
  //     },
  //     {
  //       id: 'power',
  //       name: 'Power',
  //       type: 'toggle',
  //       value: true
  //     }
  //   ],
  //   data: {
  //     timestamp: new Date(),
  //     values: {
  //       brightness: 75,
  //       power: true,
  //       colorTemp: 3000
  //     }
  //   }
  // },
  // {
  //   id: 'device-5',
  //   name: 'Energy Monitor',
  //   type: 'sensor',
  //   status: 'online',
  //   lastSeen: new Date(),
  //   location: 'Utility Room',
  //   data: {
  //     timestamp: new Date(),
  //     values: {
  //       power: 1250.5,
  //       voltage: 240.2,
  //       current: 5.2,
  //       energy: 15.8
  //     }
  //   }
  // }
];

export const mockWidgets = [
  {
    id: 'widget-1',
    type: 'chart',
    title: 'Temperature Trend',
    deviceId: 'device-1',
    dataKey: 'temperature',
    position: { x: 0, y: 0, width: 6, height: 3 },
    config: {
      chartType: 'line',
      timeRange: '24h',
      showLegend: true,
      color: '#3B82F6'
    }
  },
  {
    id: 'widget-2',
    type: 'gauge',
    title: 'Humidity',
    deviceId: 'device-1',
    dataKey: 'humidity',
    position: { x: 6, y: 0, width: 3, height: 3 },
    config: {
      threshold: { min: 30, max: 70 },
      color: '#10B981'
    }
  },
  {
    id: 'widget-3',
    type: 'stat',
    title: 'Motion Status',
    deviceId: 'device-3',
    dataKey: 'motion',
    position: { x: 9, y: 0, width: 3, height: 3 },
    config: {
      color: '#F59E0B'
    }
  },
  {
    id: 'widget-4',
    type: 'control',
    title: 'Thermostat Control',
    deviceId: 'device-2',
    position: { x: 0, y: 3, width: 4, height: 3 },
    config: {}
  },

];

export const mockAlerts = [
  {
    id: 'alert-1',
    title: 'High Temperature',
    message: 'Living room temperature exceeded 25°C',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    deviceId: 'device-1',
    acknowledged: false,
    priority: 'medium'
  },
  {
    id: 'alert-2',
    title: 'Motion Detected',
    message: 'Motion detected at front door',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    deviceId: 'device-3',
    acknowledged: false,
    priority: 'low'
  },
  {
    id: 'alert-3',
    title: 'Device Offline',
    message: 'Basement sensor has been offline for 2 hours',
    type: 'error',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    acknowledged: true,
    priority: 'high'
  }
];

export const mockAutomationRules = [
  {
    id: 'rule-1',
    name: 'High Temperature Alert',
    enabled: true,
    trigger: {
      deviceId: 'device-1',
      dataKey: 'temperature',
      condition: 'greater',
      value: 25
    },
    actions: [
      {
        type: 'alert',
        config: {
          title: 'High Temperature',
          message: 'Temperature exceeded 25°C',
          priority: 'medium'
        }
      }
    ]
  },
  {
    id: 'rule-2',
    name: 'Motion Light Control',
    enabled: true,
    trigger: {
      deviceId: 'device-3',
      dataKey: 'motion',
      condition: 'equal',
      value: true
    },
    actions: [
      {
        type: 'control',
        config: {
          deviceId: 'device-4',
          controlId: 'power',
          value: true
        }
      }
    ]
  }
];

export const mockLayouts = [
  {
    id: 'main',
    name: 'Main Dashboard',
    widgets: mockWidgets,
    isDefault: true
  },
  {
    id: 'energy',
    name: 'Energy Monitoring',
    widgets: mockWidgets.filter(w => w.deviceId === 'device-5'),
    isDefault: false
  }
];
