import React from 'react';
// import ReactDOM from 'react-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import './index.css';
import { registerChartPlugins } from './utils/chartConfig';

// Register global Chart.js plugins and defaults
registerChartPlugins();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
