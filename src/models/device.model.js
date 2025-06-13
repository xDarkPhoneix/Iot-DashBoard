import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    enum: ['temperature', 'humidity', 'pressure', 'motion', 'light', 'air_quality', 'water', 'energy', 'security', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance', 'error'],
    default: 'offline'
  },
  location: {
    type:String
  },
  configuration: {
    samplingRate: { type: Number, default: 60 }, // seconds
    threshold: {
      min: Number,
      max: Number
    },
    units: String,
    calibration: {
      offset: { type: Number, default: 0 },
      scale: { type: Number, default: 1 }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerID:{
    type:String
  }
}, {
  timestamps: true
});

// Index for efficient queries
deviceSchema.index({ deviceId: 1, owner: 1 });
deviceSchema.index({ status: 1, type: 1 });
deviceSchema.index({ lastSeen: 1 });

export default mongoose.model('Device', deviceSchema);