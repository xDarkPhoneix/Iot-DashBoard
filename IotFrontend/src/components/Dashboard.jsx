import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import WidgetGrid from './WidgetGrid';
import QuickStats from './QuickStats';
import { useEffect } from 'react';


const Dashboard = () => {
  const { devices, alerts } = useDashboard();

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const totalDevices = devices.length;
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <QuickStats
        onlineDevices={onlineDevices}
        totalDevices={totalDevices}
        activeAlerts={activeAlerts}
      />

      <WidgetGrid />
    </div>
  );
};

export default Dashboard;
