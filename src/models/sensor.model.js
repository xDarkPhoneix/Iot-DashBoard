import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  quality: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false
});

// Compound index for efficient time-series queries
sensorDataSchema.index({ deviceId: 1, timestamp: -1 });
sensorDataSchema.index({ device: 1, timestamp: -1 });
sensorDataSchema.index({ timestamp: -1 });

// TTL index to automatically delete old data (optional - 90 days)
sensorDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model('SensorData', sensorDataSchema);