import React, { useState, useCallback } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useDeviceData } from '../context/DeviceDataContext';
import { useTheme } from '../context/ThemeContext';
import WidgetWrapper from './widgets/WidgetWrapper';
import AddWidgetButton from './widgets/AddWidgetButton';
import WidgetPalette from './widgets/WidgetPalette';
import { WidgetSizeMap } from '../types/widgetTypes';

const Dashboard = ({ sidebarOpen }) => {
  const { deviceData } = useDeviceData();
  const { darkMode } = useTheme();

  const [widgets, setWidgets] = useState([
    { id: 'widget-1', type: 'line-chart', deviceId: 'temp-sensor-1', title: 'Temperature Sensor 1', x: 0, y: 0, w: 4, h: 10 },
    { id: 'widget-2', type: 'bar-chart', deviceId: 'humidity-sensor-1', title: 'Humidity Sensor 1', x: 4, y: 0, w: 4, h: 10 },
    { id: 'widget-3', type: 'gauge', deviceId: 'pressure-sensor-1', title: 'Pressure Sensor 1', x: 8, y: 0, w: 4, h: 10 },
    { id: 'widget-4', type: 'stats', deviceId: 'all', title: 'System Overview', x: 0, y: 10, w: 12, h: 6 },
  ]);
  const [nextWidgetId, setNextWidgetId] = useState(5);
  const [showPalette, setShowPalette] = useState(false);

  const handleLayoutChange = useCallback((layout) => {
    setWidgets(prevWidgets => {
      return prevWidgets.map(widget => {
        const layoutItem = layout.find(item => item.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
        return widget;
      });
    });
  }, []);

  const addWidget = useCallback((type, deviceId, title) => {
    const newWidgetId = `widget-${nextWidgetId}`;
    const size = WidgetSizeMap[type] || { w: 4, h: 8 };

    setWidgets(prevWidgets => [
      ...prevWidgets,
      {
        id: newWidgetId,
        type,
        deviceId,
        title,
        x: 0,
        y: Infinity,
        w: size.w,
        h: size.h,
      },
    ]);

    setNextWidgetId(prevId => prevId + 1);
    setShowPalette(false);
  }, [nextWidgetId]);

  const removeWidget = useCallback((widgetId) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== widgetId));
  }, []);

  return (
    <div className={`p-4 h-full transition-all duration-300 ${sidebarOpen ? 'pl-64' : ''}`}>
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Dashboard
        </h1>
        <AddWidgetButton onClick={() => setShowPalette(true)} />
      </div>

      {deviceData.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100%-3rem)] bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">Loading device data...</p>
        </div>
      ) : (
        <div className="h-[calc(100%-3rem)] overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <GridLayout
            className="layout"
            layout={widgets.map(widget => ({
              i: widget.id,
              x: widget.x,
              y: widget.y,
              w: widget.w,
              h: widget.h,
              minW: 3,
              minH: 4,
            }))}
            cols={12}
            rowHeight={30}
            width={1200}
            compactType="vertical"
            preventCollision={false}
            onLayoutChange={handleLayoutChange}
            draggableHandle=".widget-drag-handle"
            resizeHandles={['se']}
          >
            {widgets.map(widget => (
              <div key={widget.id}>
                <WidgetWrapper
                  widget={widget}
                  onRemove={removeWidget}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </GridLayout>
        </div>
      )}

      {showPalette && (
        <WidgetPalette
          onClose={() => setShowPalette(false)}
          onAddWidget={addWidget}
          devices={[...new Set(deviceData.map(d => d.deviceId))]}
        />
      )}
    </div>
  );
};

export default Dashboard;
