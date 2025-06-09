// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { mockDevices, mockWidgets, mockAlerts, mockAutomationRules, mockLayouts } from '../utils/mockData';

// const DashboardContext = createContext(undefined);

// export const useDashboard = () => {
//   const context = useContext(DashboardContext);
//   if (context === undefined) {
//     throw new Error('useDashboard must be used within a DashboardProvider');
//   }
//   return context;
// };

// export const DashboardProvider = ({ children }) => {
//   const [devices, setDevices] = useState(mockDevices);
//   const [widgets, setWidgets] = useState(mockWidgets);
//   const [alerts, setAlerts] = useState(mockAlerts);
//   const [automationRules, setAutomationRules] = useState(mockAutomationRules);
//   const [layouts, setLayouts] = useState(mockLayouts);
//   const [currentLayout, setCurrentLayoutState] = useState('main');

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDevices(prevDevices =>
//         prevDevices.map(device => ({
//           ...device,
//           data: {
//             timestamp: new Date(),
//             values: {
//               ...device.data?.values,
//               // temperature: 500,
//               temperature: Math.round((20 + Math.random() * 15) * 10) / 10,
//               humidity: Math.round((40 + Math.random() * 30) * 10) / 10,
//               // pressure: Math.round((1013 + (Math.random() - 0.5) * 20) * 10) / 10,
//               motion: Math.random() > 0.8,
//               // power: Math.round((Math.random() * 1000) * 10) / 10,
//             }
//           }
//         }))
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const updateDevice = (deviceId, updates) => {
//     setDevices(prev =>
//       prev.map(device =>
//         device.id === deviceId ? { ...device, ...updates } : device
//       )
//     );
//   };

//   const removeDevice = (deviceId) => {
//     setDevices(prev => prev.filter(device => device.id !== deviceId));
//     setWidgets(prev => prev.filter(widget => widget.deviceId !== deviceId));
//   };

//   const addDevice = (device) => {
//     const newDevice = {
//       ...device,
//       id: `device-${Date.now()}`,
//       lastSeen: new Date()
//     };
//     setDevices(prev => [...prev, newDevice]);
//   };

//   const updateDeviceControl = (deviceId, controlId, value) => {
//     setDevices(prev => prev.map(device => {
//       if (device.id === deviceId && device.controls) {
//         return {
//           ...device,
//           controls: device.controls.map(control =>
//             control.id === controlId ? { ...control, value } : control
//           )
//         };
//       }
//       return device;
//     }));
//   };

//   const addWidget = (widget) => {
//     const newWidget = { ...widget, id: `widget-${Date.now()}` };
//     setWidgets(prev => [...prev, newWidget]);
//   };

//   const updateWidget = (widgetId, updates) => {
//     setWidgets(prev => prev.map(widget =>
//       widget.id === widgetId ? { ...widget, ...updates } : widget
//     ));
//   };

//   const removeWidget = (widgetId) => {
//     setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
//   };

//   const reorderWidgets = (newWidgets) => {
//     setWidgets(newWidgets);
//   };

//   const acknowledgeAlert = (alertId) => {
//     setAlerts(prev => prev.map(alert =>
//       alert.id === alertId ? { ...alert, acknowledged: true } : alert
//     ));
//   };

//   const addAutomationRule = (rule) => {
//     const newRule = { ...rule, id: `rule-${Date.now()}` };
//     setAutomationRules(prev => [...prev, newRule]);
//   };

//   const updateAutomationRule = (ruleId, updates) => {
//     setAutomationRules(prev => prev.map(rule =>
//       rule.id === ruleId ? { ...rule, ...updates } : rule
//     ));
//   };

//   const removeAutomationRule = (ruleId) => {
//     setAutomationRules(prev => prev.filter(rule => rule.id !== ruleId));
//   };

//   const setCurrentLayout = (layoutId) => {
//     setCurrentLayoutState(layoutId);
//     const layout = layouts.find(l => l.id === layoutId);
//     if (layout) {
//       setWidgets(layout.widgets);
//     }
//   };

//   const exportData = (format, dateRange) => {
//     const data = devices.map(device => ({
//       deviceId: device.id,
//       name: device.name,
//       type: device.type,
//       status: device.status,
//       lastSeen: device.lastSeen,
//       location: device.location,
//       data: device.data
//     }));

//     if (format === 'json') {
//       const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `iot-data-${new Date().toISOString().split('T')[0]}.json`;
//       a.click();
//     } else {
//       console.log('CSV export not implemented in this demo');
//     }
//   };

//   return (
//     <DashboardContext.Provider value={{
//       devices,
//       widgets,
//       alerts,
//       automationRules,
//       layouts,
//       currentLayout,
//       updateDevice,
//       removeDevice,
//       addDevice,
//       updateDeviceControl,
//       addWidget,
//       updateWidget,
//       removeWidget,
//       reorderWidgets,
//       acknowledgeAlert,
//       addAutomationRule,
//       updateAutomationRule,
//       removeAutomationRule,
//       setCurrentLayout,
//       exportData
//     }}>
//       {children}
//     </DashboardContext.Provider>
//   );
// };












import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DashboardContext = createContext(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [currentLayout, setCurrentLayoutState] = useState('main');

  // Fetch initial widgets
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await axios.get('/api/v1/dashboard/widgets', { withCredentials: true });
        console.log(response);
        
        setWidgets(response.data.data);
      } catch (error) {
        console.error('Failed to fetch widgets:', error);
      }
    };
    const fetchDevices = async () => {
      try {
        const response = await axios.post('/api/v1/devices/get', { withCredentials: true });
        console.log(response);
        
        setDevices(response.data);
      } catch (error) {
        console.error('Failed to fetch widgets:', error);
      }
    };

    fetchWidgets();
    fetchDevices();
  }, []);

  // Simulate periodic device data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prevDevices =>
        prevDevices.map(device => ({
          ...device,
          data: {
            timestamp: new Date(),
            values: {
              ...device.data?.values,
              temperature: Math.round((20 + Math.random() * 15) * 10) / 10,
              humidity: Math.round((40 + Math.random() * 30) * 10) / 10,
              motion: Math.random() > 0.8,
            }
          }
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateDevice = (deviceId, updates) => {
    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId ? { ...device, ...updates } : device
      )
    );
  };

  const removeDevice = (deviceId) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
    setWidgets(prev => prev.filter(widget => widget.deviceId !== deviceId));
  };

  const addDevice = (device) => {
    const newDevice = {
      ...device,
      id: `device-${Date.now()}`,
      lastSeen: new Date()
    };
    setDevices(prev => [...prev, newDevice]);
  };

  const updateDeviceControl = (deviceId, controlId, value) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId && device.controls) {
        return {
          ...device,
          controls: device.controls.map(control =>
            control.id === controlId ? { ...control, value } : control
          )
        };
      }
      return device;
    }));
  };

  const addWidget = async (widget) => {
    try {
      const response = await axios.post('/api/v1/dashboard/addWidgets', widget, {
        withCredentials: true,
      });
      setWidgets(prev => [...prev, response.data.data]);
    } catch (error) {
      console.error('Failed to add widget:', error);
    }
  };

  const updateWidget = async (widgetId, updates) => {
    try {
      const response = await axios.put(`/api/v1/dashboard/widgets/${widgetId}`, updates, {
        withCredentials: true,
      });
      setWidgets(prev =>
        prev.map(widget =>
          widget._id === widgetId ? response.data.data : widget
        )
      );
    } catch (error) {
      console.error('Failed to update widget:', error);
    }
  };

  const removeWidget = async (widgetId) => {
    try {
      await axios.delete(`/api/v1/dashboard/widgets/${widgetId}`, {
        withCredentials: true,
      });
      setWidgets(prev => prev.filter(widget => widget._id !== widgetId));
    } catch (error) {
      console.error('Failed to delete widget:', error);
    }
  };

  const reorderWidgets = async (orderedWidgets) => {
    try {
      const widgetOrder = orderedWidgets.map(w => w._id);
      await axios.post('/api/v1/dashboard/widgets/reorder', { widgetOrder }, {
        withCredentials: true,
      });
      setWidgets(orderedWidgets);
    } catch (error) {
      console.error('Failed to reorder widgets:', error);
    }
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const addAutomationRule = (rule) => {
    const newRule = { ...rule, id: `rule-${Date.now()}` };
    setAutomationRules(prev => [...prev, newRule]);
  };

  const updateAutomationRule = (ruleId, updates) => {
    setAutomationRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const removeAutomationRule = (ruleId) => {
    setAutomationRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const setCurrentLayout = (layoutId) => {
    setCurrentLayoutState(layoutId);
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setWidgets(layout.widgets);
    }
  };

  const exportData = (format, dateRange) => {
    const data = devices.map(device => ({
      deviceId: device.id,
      name: device.name,
      type: device.type,
      status: device.status,
      lastSeen: device.lastSeen,
      location: device.location,
      data: device.data
    }));

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iot-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else {
      console.log('CSV export not implemented yet.');
    }
  };

  return (
    <DashboardContext.Provider value={{
      devices,
      widgets,
      alerts,
      automationRules,
      layouts,
      currentLayout,
      updateDevice,
      removeDevice,
      addDevice,
      updateDeviceControl,
      addWidget,
      updateWidget,
      removeWidget,
      reorderWidgets,
      acknowledgeAlert,
      addAutomationRule,
      updateAutomationRule,
      removeAutomationRule,
      setCurrentLayout,
      exportData
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

