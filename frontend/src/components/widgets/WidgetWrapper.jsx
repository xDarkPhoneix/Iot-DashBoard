import React from 'react';
import { X, MoreHorizontal, Move, BarChart, LineChart, PieChart, Activity } from 'lucide-react';
import LineChartWidget from './LineChartWidget';
import BarChartWidget from './BarChartWidget';
import GaugeWidget from './GaugeWidget';
import StatsWidget from './StatsWidget';

const WidgetWrapper = ({ widget, onRemove, darkMode }) => {
  const renderWidgetIcon = () => {
    switch (widget.type) {
      case 'line-chart':
        return <LineChart size={16} />;
      case 'bar-chart':
        return <BarChart size={16} />;
      case 'gauge':
        return <PieChart size={16} />;
      case 'stats':
        return <Activity size={16} />;
      default:
        return <BarChart size={16} />;
    }
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'line-chart':
        return <LineChartWidget deviceId={widget.deviceId} dark={darkMode} />;
      case 'bar-chart':
        return <BarChartWidget deviceId={widget.deviceId} dark={darkMode} />;
      case 'gauge':
        return <GaugeWidget deviceId={widget.deviceId} dark={darkMode} />;
      case 'stats':
        return <StatsWidget deviceId={widget.deviceId} dark={darkMode} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden flex flex-col">
      <div className="widget-drag-handle px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-move">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500 dark:text-gray-400">
            {renderWidgetIcon()}
          </div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {widget.title}
          </h3>
        </div>
        <div className="flex items-center space-x-1">
          <Move size={14} className="text-gray-400 dark:text-gray-500" />
          <button
            type="button"
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
          >
            <MoreHorizontal size={14} />
          </button>
          <button
            type="button"
            className="p-1 rounded-md text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 focus:outline-none"
            onClick={() => onRemove(widget.id)}
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        {renderWidgetContent()}
      </div>
    </div>
  );
};

export default WidgetWrapper;
