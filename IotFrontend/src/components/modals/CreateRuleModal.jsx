import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { X, Plus, Zap, AlertTriangle, Mail, Webhook } from 'lucide-react';

const CreateRuleModal = ({ isOpen, onClose }) => {
  const { devices, addAutomationRule } = useDashboard();
  const [ruleName, setRuleName] = useState('');
  const [enabled, setEnabled] = useState(true);

  // Trigger configuration
  const [triggerDevice, setTriggerDevice] = useState('');
  const [triggerDataKey, setTriggerDataKey] = useState('');
  const [triggerCondition, setTriggerCondition] = useState('greater');
  const [triggerValue, setTriggerValue] = useState('');

  // Actions
  const [actions, setActions] = useState([]);
  const [showActionForm, setShowActionForm] = useState(false);
  const [newAction, setNewAction] = useState({
    type: 'alert',
    config: {}
  });

  if (!isOpen) return null;

  const selectedDevice = devices.find((d) => d.id === triggerDevice);
  const availableDataKeys = selectedDevice?.data?.values
    ? Object.keys(selectedDevice.data.values)
    : [];

  const handleAddAction = () => {
    let actionConfig = {};

    switch (newAction.type) {
      case 'alert':
        actionConfig = {
          title: `Alert from ${selectedDevice?.name}`,
          message: `${triggerDataKey} ${triggerCondition} ${triggerValue}`,
          priority: 'medium'
        };
        break;
      case 'control':
        actionConfig = {
          deviceId: '',
          controlId: '',
          value: true
        };
        break;
      case 'email':
        actionConfig = {
          to: '',
          subject: `IoT Alert: ${ruleName}`,
          body: `Automation rule "${ruleName}" has been triggered.`
        };
        break;
      case 'webhook':
        actionConfig = {
          url: '',
          method: 'POST',
          headers: {},
          body: {}
        };
        break;
      default:
        break;
    }

    const action = {
      id: `action-${Date.now()}`,
      type: newAction.type,
      config: actionConfig
    };

    setActions((prev) => [...prev, action]);
    setNewAction({ type: 'alert', config: {} });
    setShowActionForm(false);
  };

  const handleRemoveAction = (actionId) => {
    setActions((prev) => prev.filter((a) => a.id !== actionId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ruleName || !triggerDevice  || !triggerValue || actions.length === 0) {
      alert('Please fill in all required fields and add at least one action');
      return;
    }

    const rule = {
      name: ruleName,
      enabled,
      trigger: {
        deviceId: triggerDevice,
        dataKey: triggerDataKey,
        condition: triggerCondition,
        value: isNaN(Number(triggerValue)) ? triggerValue : Number(triggerValue)
      },
      actions: actions.map(({ id, ...action }) => action)
    };

    addAutomationRule(rule);
    onClose();

    // Reset form
    setRuleName('');
    setEnabled(true);
    setTriggerDevice('');
    setTriggerDataKey('');
    setTriggerCondition('greater');
    setTriggerValue('');
    setActions([]);
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'alert':
        return AlertTriangle;
      case 'control':
        return Zap;
      case 'email':
        return Mail;
      case 'webhook':
        return Webhook;
      default:
        return AlertTriangle;
    }
  };

  const getActionDescription = (action) => {
    switch (action.type) {
      case 'alert':
        return `Create alert: ${action.config.title}`;
      case 'control':
        return `Control device: ${action.config.deviceId}`;
      case 'email':
        return `Send email to: ${action.config.to || 'Not configured'}`;
      case 'webhook':
        return `Call webhook: ${action.config.url || 'Not configured'}`;
      default:
        return 'Unknown action';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Automation Rule
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter rule name"
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Rule
              </label>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Trigger Configuration */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trigger Condition
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device *
                </label>
                <select
                  value={triggerDevice}
                  onChange={(e) => {
                    setTriggerDevice(e.target.value);
                    setTriggerDataKey('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select device</option>
                  {devices.map((device) => (
                    <option key={device._id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data Key *
                </label>
                <select
                  value={triggerDataKey}
                  onChange={(e) => setTriggerDataKey(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={!triggerDevice}
                >
                  <option value="">Select data key</option>
                  {availableDataKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condition *
                </label>
                <select
                  value={triggerCondition}
                  onChange={(e) => setTriggerCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="greater">Greater than</option>
                  <option value="less">Less than</option>
                  <option value="equal">Equals</option>
                  <option value="not_equal">Not equals</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Value *
                </label>
                <input
                  type="text"
                  value={triggerValue}
                  onChange={(e) => setTriggerValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter value"
                  required
                />
              </div>
            </div>

            {triggerDevice && triggerDataKey && triggerValue && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Trigger:</strong> When {selectedDevice?.name}'s {triggerDataKey} is {triggerCondition.replace('_', ' ')} {triggerValue}
                </p>
              </div>
            )}
          </div>

          {/* Actions Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Actions ({actions.length})
              </h4>
              <button
                type="button"
                onClick={() => setShowActionForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Action</span>
              </button>
            </div>

            {/* Existing Actions */}
            {actions.length > 0 && (
              <div className="space-y-3">
                {actions.map((action) => {
                  const ActionIcon = getActionIcon(action.type);
                  return (
                    <div key={action.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <ActionIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {action.type} Action
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getActionDescription(action)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAction(action.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Action Form */}
            {showActionForm && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900 dark:text-white">Add New Action</h5>
                  <button
                    type="button"
                    onClick={() => setShowActionForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { type: 'alert', name: 'Create Alert', icon: AlertTriangle, desc: 'Show notification' },
                    { type: 'control', name: 'Control Device', icon: Zap, desc: 'Trigger device action' },
                    { type: 'email', name: 'Send Email', icon: Mail, desc: 'Email notification' },
                    { type: 'webhook', name: 'Call Webhook', icon: Webhook, desc: 'HTTP request' }
                  ].map((actionType) => (
                    <button
                      key={actionType.type}
                      type="button"
                      onClick={() => setNewAction({ type: actionType.type , config: {} })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        newAction.type === actionType.type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <actionType.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {actionType.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {actionType.desc}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowActionForm(false)}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAction}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                  >
                    Add Action
                  </button>
                </div>
              </div>
            )}

            {actions.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No actions configured. Add at least one action to complete the rule.</p>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {ruleName && triggerDevice && triggerDataKey && triggerValue && actions.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Rule Preview
              </h4>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${enabled ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Zap className={`w-5 h-5 ${enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {ruleName}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>When:</strong> {selectedDevice?.name}'s {triggerDataKey} is {triggerCondition.replace('_', ' ')} {triggerValue}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Then:</strong> Execute {actions.length} action{actions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Rule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRuleModal;