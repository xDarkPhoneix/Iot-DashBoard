import React from 'react';
import { Activity, AlertTriangle, Zap, TrendingUp } from 'lucide-react';

const QuickStats = ({ onlineDevices, totalDevices, activeAlerts }) => {
  const uptime = Math.round((onlineDevices / totalDevices) * 100);

  const stats = [
    {
      title: 'Online Devices',
      value: `${onlineDevices}/${totalDevices}`,
      change: '+2 from yesterday',
      icon: Activity,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      trend: 'up',
    },
    {
      title: 'System Uptime',
      value: `${uptime}%`,
      change: '+0.5% from last week',
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      trend: 'up',
    },
    {
      title: 'Active Alerts',
      value: activeAlerts.toString(),
      change: activeAlerts > 0 ? 'Requires attention' : 'All clear',
      icon: AlertTriangle,
      color: activeAlerts > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
      bgColor: activeAlerts > 0 ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50',
      trend: activeAlerts > 0 ? 'down' : 'neutral',
    },
    {
      title: 'Power Usage',
      value: '1.2 kW',
      change: '-5% from last hour',
      icon: Zap,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/50',
      trend: 'down',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stat.value}
              </p>
              <p
                className={`text-xs mt-1 ${
                  stat.trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : stat.trend === 'down'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
