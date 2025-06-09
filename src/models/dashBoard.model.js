import mongoose from "mongoose";
const { Schema } = mongoose;

// Widget Sub-Schema
const widgetSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['chart', 'gauge', 'stat', 'control'], required: true },
  title: { type: String, required: true },
  deviceId: { type: String, required: true },
  dataKey: { type: String },
  position: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  config: {
    chartType: String,
    color: String,
    threshold: {
      min: Number,
      max: Number
    },
    timeRange: String,
    showLegend: Boolean
  }
}, { timestamps: true });

// Dashboard Schema
const dashboardSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'My Dashboard'
  },
  widgets: [widgetSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
dashboardSchema.index({ owner: 1, isActive: 1 });
dashboardSchema.index({ 'widgets.id': 1 });
export const Widget = mongoose.model('Widget',widgetSchema)
export const Dashboard = mongoose.model('Dashboard', dashboardSchema);
