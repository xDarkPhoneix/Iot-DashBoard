import express from 'express';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createDevice, getDevicesbyID, getDevices } from '../controllers/device.controllers.js';

const router = express.Router();

router.route('/').post(verifyJWT,createDevice)
router.route('/get').post(verifyJWT,getDevices)
router.route('/deviceById').post(verifyJWT,getDevicesbyID)
//   .get(protect, getDevices)
//   .post(protect, createDevice);

export default router;
