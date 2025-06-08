import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderWidgets(items);
  };

  const renderWidget = (widget, index) => {
    const WidgetComponent = () => {
      switch (widget.type) {
        case 'chart':
          return <ChartWidget widget={widget} onRemove={() => removeWidget(widget.id)} />;
        case 'gauge':
          return <GaugeWidget widget={widget} onRemove={() => removeWidget(widget.id)} />;
        case 'stat':
          return <StatWidget widget={widget} onRemove={() => removeWidget(widget.id)} />;
        case 'control':
          return <ControlWidget widget={widget} onRemove={() => removeWidget(widget.id)} />;
        default:
          return null;
      }
    };

    return (
      <Draggable key={widget.id} draggableId={widget.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`transition-all duration-200 ${
              snapshot.isDragging
                ? 'transform rotate-2 scale-105 shadow-2xl z-50'
                : 'hover:shadow-lg'
            }`}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.9 : 1,
            }}
          >
            <WidgetComponent />
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Grid3X3 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dashboard Widgets
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Drag to reorder
          </span>
        </div>
        <button
          onClick={() => setShowAddWidget(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Widget</span>
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[200px] p-4 rounded-xl border-2 border-dashed transition-colors ${
                snapshot.isDraggingOver
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-transparent'
              }`}
            >
              {widgets.map((widget, index) => renderWidget(widget, index))}
              {provided.placeholder}

              {widgets.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
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
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <AddWidgetModal
        isOpen={showAddWidget}
        onClose={() => setShowAddWidget(false)}
      />
    </div>
  );
};

export default WidgetGrid;
