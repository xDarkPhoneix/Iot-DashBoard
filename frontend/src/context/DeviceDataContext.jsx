import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { generateMockData, getDeviceHistoricalData } from '../utils/mockDataGenerator';

const DeviceDataContext = createContext({
  deviceData: [],
  getDeviceHistory: () => [],
});

export const useDeviceData = () => useContext(DeviceDataContext);

export const DeviceDataProvider = ({ children }) => {
  const [deviceData, setDeviceData] = useState([]);
  const [deviceHistory, setDeviceHistory] = useState({});

  // Initialize mock data and set up data update interval
  useEffect(() => {
    // Initial data load
    const initialData = generateMockData();
    setDeviceData(initialData);
    
    // Create initial history
    const initialHistory = {};
    initialData.forEach(device => {
      initialHistory[device.deviceId] = getDeviceHistoricalData(device, 20);
    });
    setDeviceHistory(initialHistory);
    
    // Set up interval to update data
    const interval = setInterval(() => {
      setDeviceData(prevData => {
        const updatedData = prevData.map(device => {
          // 1 in 10 chance to simulate a device going offline
          const randomStatus = Math.random() > 0.9 
            ? (device.status === 'online' ? 'offline' : 'online') 
            : device.status;
          
          // Only update values for online devices
          if (randomStatus === 'online') {
            const prevValue = device.value;
            // Random value change based on device type
            let change = 0;
            switch (device.type) {
              case 'temperature':
                change = (Math.random() - 0.5) * 2; // -1 to 1
                break;
              case 'humidity':
                change = (Math.random() - 0.45) * 3; // slightly biased
                break;
              case 'pressure':
                change = (Math.random() - 0.48) * 5; // slightly biased
                break;
              default:
                change = (Math.random() - 0.5) * 1;
            }
            
            // Keep value within range
            let newValue = prevValue + change;
            newValue = Math.max(device.range.min, Math.min(device.range.max, newValue));
            
            return {
              ...device,
              value: newValue,
              trend: newValue - prevValue,
              status: randomStatus,
              lastUpdated: new Date(),
            };
          }
          
          return {
            ...device,
            status: randomStatus,
          };
        });
        
        // Update history
        setDeviceHistory(prevHistory => {
          const newHistory = { ...prevHistory };
          updatedData.forEach(device => {
            if (device.status === 'online') {
              const deviceHistory = prevHistory[device.deviceId] || [];
              newHistory[device.deviceId] = [
                ...deviceHistory,
                {
                  timestamp: new Date(),
                  value: device.value,
                },
              ].slice(-50); // Keep last 50 points
            }
          });
          return newHistory;
        });
        
        return updatedData;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getDeviceHistory = useCallback((deviceId) => {
    return deviceHistory[deviceId] || [];
  }, [deviceHistory]);

  return (
    <DeviceDataContext.Provider value={{ deviceData, getDeviceHistory }}>
      {children}
    </DeviceDataContext.Provider>
  );
};
