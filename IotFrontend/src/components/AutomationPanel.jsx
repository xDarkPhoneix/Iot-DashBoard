import React, { useState } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { Play, Pause, Plus, Trash2, Edit, Zap } from 'lucide-react';
import CreateRuleModal from './modals/CreateRuleModal';
import Toast from './modals/ToastModal';

const AutomationPanel = () => {
  const { automationRules, updateAutomationRule, removeAutomationRule } = useDashboard();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toggleRule = (ruleId, enabled) => {
    updateAutomationRule(ruleId, { enabled });
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this automation rule?')) {
      removeAutomationRule(ruleId);
    }
  };

  const getConditionText = (condition) => {
    switch (condition) {
      case 'greater': return 'is greater than';
      case 'less': return 'is less than';
      case 'equal': return 'equals';
      case 'not_equal': return 'does not equal';
      default: return condition;
    }
  };

  const getActionText = (action) => {
    switch (action.type) {
      case 'alert':
        return `Create alert: ${action.config.title}`;
      case 'control':
        return `Control device ${action.config.deviceId}`;
      case 'email':
        return `Send email notification`;
      case 'webhook':
        return `Trigger webhook`;
      default:
        return `Unknown action: ${action.type}`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Automation Rules
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Rule</span>
        </button>
      </div>

      <div className="grid gap-6">
        {automationRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${rule.enabled ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <Zap className={`w-6 h-6 ${rule.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {rule.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rule.enabled 
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRule(rule.id, !rule.enabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    rule.enabled
                      ? 'text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/50'
                      : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50'
                  }`}
                >
                  {rule.enabled ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
              {/* <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Trigger Condition
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When <span className="font-medium">{rule.trigger.deviceId}</span>'s{' '}
                  <span className="font-medium">{rule.trigger.dataKey}</span>{' '}
                  {getConditionText(rule.trigger.condition)}{' '}
                  <span className="font-medium">{String(rule.trigger.value)}</span>
                </p>
              </div> */}

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Actions ({rule.actions.length})
                </h4>
                <div className="space-y-2">
                  {rule.actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {getActionText(action)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Last triggered: Never</span>
              <span>Executions: 0</span>
            </div>
          </div>
        ))}

        {automationRules.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Automation Rules
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first automation rule to start automating your IoT devices.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Rule</span>
            </button>
          
          </div>
        )}
      </div>

      <CreateRuleModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
};

export default AutomationPanel;
