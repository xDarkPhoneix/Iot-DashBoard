import React, { useEffect, useRef } from 'react';
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
  Filler
} from 'chart.js';
import { useDashboard } from '../../contexts/DashboardContext';
import { MoreVertical, TrendingUp } from 'lucide-react';

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

const ChartWidget = ({ widget }) => {
  const { devices } = useDashboard();
  const chartRef = useRef(null);

  const device = devices.find(d => d.id === widget.deviceId);
  const currentValue = device?.data?.values[widget.dataKey || ''];

  const generateHistoricalData = () => {
    const now = new Date();
    const data = [];
    const labels = [];

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      const baseValue = currentValue || 20;
      const variance = baseValue * 0.1;
      const value = baseValue + (Math.random() - 0.5) * variance;
      data.push(Math.round(value * 10) / 10);
    }

    return { labels, data };
  };

  const { labels, data } = generateHistoricalData();

  const chartData = {
    labels,
    datasets: [
      {
        label: widget.title,
        data,
        borderColor: widget.config.color || '#3B82F6',
        backgroundColor:
          widget.config.chartType === 'line'
            ? `${widget.config.color || '#3B82F6'}20`
            : widget.config.color || '#3B82F6',
        fill: widget.config.chartType === 'line',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: widget.config.chartType === 'line' ? 3 : 0,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: widget.config.showLegend || false,
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
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const ChartComponent = widget.config.chartType === 'bar' ? Bar : Line;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {widget.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentValue?.toFixed(1) || '0.0'}
            </span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="h-48">
        <ChartComponent ref={chartRef} data={chartData} options={options} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Last 24 hours</span>
        <span className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${device?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="capitalize">{device?.status || 'offline'}</span>
        </span>
      </div>
    </div>
  );
};

export default ChartWidget;
