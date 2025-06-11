import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from "socket.io-client";

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
  const [selectedDataKey, setSelectedDataKey]=useState("")
  const [widgets, setWidgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [currentLayout, setCurrentLayoutState] = useState('main');
  const [sensor ,setSensor] =useState([]);
  const [humid , setHumid]=useState([])

  // const socket = io("http://localhost:8000")
  
  //   useEffect(() => {
  
  //     console.log(devices);
      
  //     socket.on("sensor-data", (payload) => {
  //       console.log("Received:", payload);
        
  //     });
  
  //     return () => {
  //       socket.off("sensor-data");
  //     };
  //   }, []);
  
  // Fetch initial widgets

useEffect(() => {
  const fetchSensorData = async () => {
    try {
      const response = await axios.get('/api/v1/sensor/data', { withCredentials: true });
      console.log("ses", response.data);

      const data = response.data.map(t => t.value); // assuming each `t.value` is [temp, hum]

      const temp = [];
      const hum = [];

      data.forEach(x => {
        console.log("lll", x[0]);
        temp.push(x[0]);
        hum.push(x[1]);
      });

      setSensor(prev => [...prev, temp]);
      setHumid(prev => [...prev, hum]);

    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  fetchSensorData(); // run immediately

  const intervalId = setInterval(fetchSensorData, 6 * 1000); // run every 30 seconds

  return () => clearInterval(intervalId); // cleanup interval on unmount
}, []); // empty dependency array: runs only once on mount

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
        console.log(response.data);
        
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
              temperature:20,
              // temperature: Math.round((20 + Math.random() * 15) * 10) / 10,
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

  const addDevice = async(device) => {
    await axios.post('/api/v1/devices' ,{withCredentials:true})
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
      const response = await axios.post('/api/v1/dashboard/addWidget', widget, {
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
      console.log(orderedWidgets);
      
      const widgetOrder = orderedWidgets.map(w => w._id);
      console.log(widgetOrder);
      
    const response =  await axios.post('/api/v1/dashboard/widgets/reorder', { widgetOrder }, {
        withCredentials: true,
      });
      console.log("aaa",response);
      
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

  const removeAlert = (id) => {
  setAlerts(prev => prev.filter(alert => alert.id !== id));
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
      sensor,
      humid,
      setSelectedDataKey,
      selectedDataKey,
      updateDevice,
      removeDevice,
      addDevice,
      updateDeviceControl,
      addWidget,
      updateWidget,
      removeWidget,
      reorderWidgets,
      acknowledgeAlert,
      removeAlert,
      addAutomationRule,
      updateAutomationRule,
      removeAutomationRule,
      setCurrentLayout,
      exportData,
      
    }}>
      {children}
    </DashboardContext.Provider>
  );
};