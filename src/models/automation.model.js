import mongoose from 'mongoose';

const triggerSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  dataKey: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ['greater', 'less', 'equal', 'not_equal'],
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const actionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['alert', 'control', 'email', 'webhook'],
    required: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const automationRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  trigger: {
    type: triggerSchema,
    required: true
  },
  actions: {
    type: [actionSchema],
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastTriggeredAt: {
    type: Date,
    default: null
  },
  executionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
automationRuleSchema.index({ owner: 1, enabled: 1 });
automationRuleSchema.index({ 'trigger.deviceId': 1 });

const AutomationRule = mongoose.model('AutomationRule', automationRuleSchema);

export default AutomationRule;
