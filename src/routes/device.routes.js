import express from 'express';

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createDevice } from '../controllers/device.controllers.js';

const router = express.Router();

router.route('/').post(verifyJWT,createDevice)
//   .get(protect, getDevices)
//   .post(protect, createDevice);

export default router;
