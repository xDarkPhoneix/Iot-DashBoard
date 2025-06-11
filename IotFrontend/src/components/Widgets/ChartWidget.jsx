import React, { useEffect, useRef, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useDashboard } from '../../contexts/DashboardContext';
import { MoreVertical, TrendingUp, X, Settings, GripVertical } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartWidget = ({ widget, onRemove }) => {
  const { devices, sensor, humid } = useDashboard();
  const chartRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(0); // <-- Active dataset index

  const device = devices.find(d => d._id === widget.deviceId);

  useEffect(() => {
    const selectedHistory = widget.dataKey === 'temperature' ? sensor : humid;
    setHistory(selectedHistory);
    setIndex(0); // reset index when dataKey changes
  }, [widget.dataKey, sensor, humid]);

  useEffect(() => {
    if (!history.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % history.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [history]);

  const generateLabels = (count) => {
    const now = new Date();
    return Array.from({ length: count }).map((_, i) => {
      const time = new Date(now.getTime() - (count - 1 - i) * 5000);
      return time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    });
  };

  const currentDataset = history[index] || [];
  const labels = generateLabels(currentDataset.length);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${widget.title || 'Data'} ${index + 1}`,
        data: currentDataset,
        borderColor: widget.config?.color || '#3B82F6',
        backgroundColor:
          widget.config?.chartType === 'line'
            ? `${widget.config?.color || '#3B82F6'}20`
            : widget.config?.color || '#3B82F6',
        fill: widget.config?.chartType === 'line',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: widget.config?.chartType === 'line' ? 3 : 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const currentValue = currentDataset.at(-1) ?? 0;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: widget.config?.showLegend,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
      },
      y: {
        display: true,
        grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const ChartComponent = widget.config?.chartType === 'bar' ? Bar : Line;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {widget.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {typeof currentValue === 'number' ? currentValue.toFixed(1) : currentValue}
              </span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </button>
              <button
                onClick={onRemove}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-48">
        <ChartComponent ref={chartRef} data={chartData} options={options} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Live Data (3s interval)</span>
        <span className="flex items-center space-x-1">
          <div
            className={`w-2 h-2 rounded-full ${device?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="capitalize">{device?.status || 'offline'}</span>
        </span>
      </div>
    </div>
  );
};

export default ChartWidget;
