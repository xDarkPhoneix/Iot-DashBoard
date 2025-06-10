import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { X, Plus, Zap } from 'lucide-react';

const AddDeviceModal = ({ isOpen, onClose }) => {
  const { addDevice } = useDashboard();
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'sensor',
    location: '',
    status: 'online',
    controls: []
  });

  const [showControlForm, setShowControlForm] = useState(false);
  const [newControl, setNewControl] = useState({
    name: '',
    type: 'toggle',
    value: false,
    min: 0,
    max: 100,
    unit: ''
  });

  if (!isOpen) return null;

  const handleAddControl = () => {
    const control = {
      id: `control-${Date.now()}`,
      ...newControl,
      value:
        newControl.type === 'toggle'
          ? false
          : newControl.type === 'slider'
          ? newControl.min
          : null
    };

    setNewDevice(prev => ({
      ...prev,
      controls: [...prev.controls, control]
    }));

    setNewControl({
      name: '',
      type: 'toggle',
      value: false,
      min: 0,
      max: 100,
      unit: ''
    });
    setShowControlForm(false);
  };

  const handleRemoveControl = (controlId) => {
    setNewDevice(prev => ({
      ...prev,
      controls: prev.controls.filter(c => c.id !== controlId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newDevice.name || !newDevice.location) {
      alert('Please fill in all required fields');
      return;
    }

    const deviceToAdd = {
      ...newDevice,
      data: {
        timestamp: new Date(),
        values: {
          ...(newDevice.type === 'sensor' && {
            temperature: 20 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            battery: 80 + Math.random() * 20
          }),
          ...(newDevice.type === 'actuator' && {
            power: Math.random() > 0.5,
            brightness: Math.floor(Math.random() * 100)
          }),
          ...(newDevice.type === 'controller' && {
            temperature: 20 + Math.random() * 5,
            targetTemp: 22,
            power: true
          }),
          ...(newDevice.type === 'camera' && {
            recording: Math.random() > 0.5,
            motion: Math.random() > 0.8,
            storage: 75 + Math.random() * 20
          })
        }
      }
    };

    addDevice(deviceToAdd);
    onClose();
    setNewDevice({
      name: '',
      type: 'sensor',
      location: '',
      status: 'online',
      controls: []
    });
  };

  return (
    // Entire JSX structure remains unchanged
    // Paste your existing return JSX here from the original code
    // It already works in JSX format, no need to alter the structure
    <>
      {/* JSX from your original code remains exactly the same here */}
    </>
  );
};

export default AddDeviceModal;
