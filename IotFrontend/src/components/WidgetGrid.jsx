import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import ChartWidget from './Widgets/ChartWidget';
import GaugeWidget from './Widgets/GaugeWidget';
import StatWidget from './Widgets/StatWidget';
import ControlWidget from './Widgets/ControlWidget';

const WidgetGrid = () => {
  const { widgets } = useDashboard();

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'chart':
        return <ChartWidget key={widget.id} widget={widget} />;
      case 'gauge':
        return <GaugeWidget key={widget.id} widget={widget} />;
      case 'stat':
        return <StatWidget key={widget.id} widget={widget} />;
      case 'control':
        return <ControlWidget key={widget.id} widget={widget} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {widgets.map(renderWidget)}
    </div>
  );
};

export default WidgetGrid;
