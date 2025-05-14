import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { DeviceDataProvider } from './context/DeviceDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <DeviceDataProvider>
          <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onAuthClick={() => setAuthModalOpen(true)}
            />
            <main className="flex-1 overflow-hidden">
              <Dashboard sidebarOpen={sidebarOpen} />
            </main>
            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
            />
          </div>
        </DeviceDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
