import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components and set global defaults
export const registerChartPlugins = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
  // Set global defaults
  ChartJS.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ChartJS.defaults.color = '#64748b'; // slate-500
  ChartJS.defaults.responsive = true;
  ChartJS.defaults.maintainAspectRatio = false;
};

// Common chart options
export const getChartOptions = (dark, unit = '') => {
  const gridColor = dark ? 'rgba(100, 116, 139, 0.2)' : 'rgba(100, 116, 139, 0.1)';
  const textColor = dark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: textColor,
          usePointStyle: true,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: dark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: dark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: dark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        borderColor: dark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(100, 116, 139, 0.2)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toFixed(1)}${unit}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          color: textColor,
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        grid: {
          color: gridColor,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          color: textColor,
          callback: function(value) {
            return `${value}${unit}`;
          },
        },
        beginAtZero: false,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };
};

// Line chart data configuration
export const getLineChartData = (history, metricName, unit, dark) => {
  const labels = history.map(point => point.formattedTime);
  const values = history.map(point => point.value);
  
  const gradientColorStops = dark 
    ? [
        'rgba(59, 130, 246, 0.1)', 
        'rgba(59, 130, 246, 0.05)', 
        'rgba(59, 130, 246, 0)'
      ]
    : [
        'rgba(59, 130, 246, 0.2)', 
        'rgba(59, 130, 246, 0.05)', 
        'rgba(59, 130, 246, 0)'
      ];
  
  return {
    labels,
    datasets: [
      {
        label: `${metricName} (${unit})`,
        data: values,
        fill: true,
        backgroundColor: (context) => {
          if (!context.chart.chartArea) return;
          const { ctx, chartArea } = context.chart;
          const gradient = ctx.createLinearGradient(
            chartArea.left, 
            chartArea.top, 
            chartArea.left, 
            chartArea.bottom
          );
          gradient.addColorStop(0, gradientColorStops[0]);
          gradient.addColorStop(0.5, gradientColorStops[1]);
          gradient.addColorStop(1, gradientColorStops[2]);
          return gradient;
        },
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: dark ? '#1e293b' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.4,
      },
    ],
  };
};

// Bar chart data configuration
export const getBarChartData = (history, metricName, unit, dark) => {
  const labels = history.map(point => point.formattedTime);
  const values = history.map(point => point.value);
  
  return {
    labels,
    datasets: [
      {
        label: `${metricName} (${unit})`,
        data: values,
        backgroundColor: dark ? 'rgba(20, 184, 166, 0.7)' : 'rgba(20, 184, 166, 0.8)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgb(20, 184, 166)',
      },
    ],
  };
};

// Gauge chart data and options
export const getGaugeChartData = (percentage, dark) => {
  let color;
  if (percentage < 30) {
    color = 'rgb(34, 197, 94)';
  } else if (percentage < 70) {
    color = 'rgb(250, 204, 21)';
  } else {
    color = 'rgb(239, 68, 68)';
  }
  
  const remainingColor = dark ? 'rgba(100, 116, 139, 0.1)' : 'rgba(100, 116, 139, 0.1)';
  
  return {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, remainingColor],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };
};

export const getGaugeOptions = (dark) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };
};
