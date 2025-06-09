import SensorData from '../models/sensorDataModel.js';
import Device from '../models/deviceModel.js';

// Create new sensor data (e.g., from a device or external ingestion service)
export const createSensorData = async (req, res) => {
  try {
    const { deviceId, value, unit, quality, metadata, timestamp } = req.body;

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const newData = new SensorData({
      deviceId,
      device: device._id,
      value,
      unit,
      quality,
      metadata,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get recent sensor data for a device
export const getRecentSensorData = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const data = await SensorData.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sensor data within a date range for a device
export const getSensorDataByRange = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { start, end } = req.query;

    const data = await SensorData.find({
      deviceId,
      timestamp: {
        $gte: new Date(start),
        $lte: new Date(end)
      }
    }).sort({ timestamp: 1 });

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: 'Invalid date range or query' });
  }
};

// Delete old data manually (optional)
export const deleteSensorDataByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const result = await SensorData.deleteMany({ deviceId });
    res.json({ message: `Deleted ${result.deletedCount} entries for device ${deviceId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
