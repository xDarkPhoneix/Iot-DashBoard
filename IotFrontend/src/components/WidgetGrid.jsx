import React, { useCallback, useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useDashboard } from '../contexts/DashboardContext';
import ChartWidget from './Widgets/ChartWidget';
import GaugeWidget from './Widgets/GaugeWidget';
import StatWidget from './Widgets/StatWidget';
import ControlWidget from './Widgets/ControlWidget';
import AddWidgetModal from './AddWidgetModal';
import { Plus, Grid3X3 } from 'lucide-react';

const WidgetGrid = () => {
  const { widgets, reorderWidgets, removeWidget } = useDashboard();
  const [showAddWidget, setShowAddWidget] = useState(false);

  const layout = widgets.map((widget, index) => ({
    i: widget._id, // use _id consistently
    x: (index % 4) * 6,
    y: Math.floor(index / 4) * 10,
    w: 6,
    h: 10,
    minW: 5,
    minH: 7,
  }));

  const handleLayoutChange = useCallback(
    (newLayout) => {
      const sortedLayout = [...newLayout].sort((a, b) => (a.y * 100 + a.x) - (b.y * 100 + b.x));
      const newOrder = sortedLayout.map((item) => widgets.find((w) => w._id === item.i));
      reorderWidgets(newOrder);
    },
    [widgets, reorderWidgets]
  );

  const renderWidget = (widget) => {
    const commonProps = {
      widget,
      onRemove: () => removeWidget(widget._id),
    };
    switch (widget.type) {
      case 'chart':
        return <ChartWidget {...commonProps} />;
      case 'gauge':
        return <GaugeWidget {...commonProps} />;
      case 'stat':
        return <StatWidget {...commonProps} />;
      case 'control':
        return <ControlWidget {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Grid3X3 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Widgets</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Drag to reorder</span>
        </div>
        <button
          onClick={() => setShowAddWidget(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Widget</span>
        </button>
      </div>

      {/* Widget Grid */}
      <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-transparent overflow-x-auto w-full">
        {widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <Grid3X3 className="w-12 h-12 mb-4 opacity-50" />
            <h4 className="text-lg font-medium mb-2">No widgets yet</h4>
            <p className="text-sm text-center mb-4">
              Add your first widget to start monitoring your IoT devices
            </p>
            <button
              onClick={() => setShowAddWidget(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Widget</span>
            </button>
          </div>
        ) : (
          <GridLayout
            className="layout"
            layout={layout}
            cols={24}
            rowHeight={30}
            width={1200}
            compactType={null}
            preventCollision={false}
            onLayoutChange={handleLayoutChange}
            autoSize={true}
            draggableHandle=".widget-drag-handle"
            resizeHandles={['se']}
            isResizable
          >
            {widgets.map((widget) => (
              <div
                key={widget._id}
                className="widget-drag-handle"
                style={{ minHeight: '220px', minWidth: '200px' }} // fallback min size
              >
                <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  {renderWidget(widget)}
                </div>
              </div>
            ))}
          </GridLayout>
        )}
      </div>

      {/* Modal */}
      <AddWidgetModal isOpen={showAddWidget} onClose={() => setShowAddWidget(false)} />
    </div>
  );
};

export default WidgetGrid;