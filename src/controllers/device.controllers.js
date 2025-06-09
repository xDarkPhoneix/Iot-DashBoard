import Device from '../models/deviceModel.js';

// Create a new device
export const createDevice = async (req, res) => {
  try {
    const device = new Device({ ...req.body, owner: req.user._id });
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all devices for the logged-in user
export const getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ owner: req.user._id });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single device by ID
export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findOne({ _id: req.params.id, owner: req.user._id });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a device
export const updateDevice = async (req, res) => {
  try {
    const updatedDevice = await Device.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedDevice) return res.status(404).json({ error: 'Device not found' });
    res.json(updatedDevice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a device
export const deleteDevice = async (req, res) => {
  try {
    const deletedDevice = await Device.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!deletedDevice) return res.status(404).json({ error: 'Device not found' });
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update device control (e.g., actuators)
export const updateDeviceControl = async (req, res) => {
  try {
    const { controlId, value } = req.body;

    const device = await Device.findOne({ _id: req.params.id, owner: req.user._id });
    if (!device) return res.status(404).json({ error: 'Device not found' });

    // Assuming you store controls in a separate embedded array
    const control = device.controls?.find(c => c.id === controlId);
    if (!control) return res.status(404).json({ error: 'Control not found' });

    control.value = value;
    await device.save();

    res.json({ message: 'Control updated successfully', device });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
