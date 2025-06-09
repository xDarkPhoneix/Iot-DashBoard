import express from 'express';
import {
  getAllWidgets,
  addWidget,
  updateWidget,
  deleteWidget,
  reorderWidgets,
} from '../controllers/dashBoard.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; // your auth middleware
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';

const router = express.Router();

router.use(verifyToken); // Protect all routes with auth

// GET all widgets for current user
router.get('/', getAllWidgets);

// POST add a new widget with validation
router.post(
  '/',
  [
    body('type').notEmpty().withMessage('Widget type is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('deviceId').notEmpty().withMessage('Device ID is required'),
    handleValidationErrors,
  ],
  addWidget
);

// PUT update a widget config with validation
router.put(
  '/:widgetId',
  [
    param('widgetId').isMongoId().withMessage('Invalid widget ID'),
    body('config').notEmpty().withMessage('Config is required'),
    handleValidationErrors,
  ],
  updateWidget
);

// DELETE a widget by id with validation
router.delete(
  '/:widgetId',
  [
    param('widgetId').isMongoId().withMessage('Invalid widget ID'),
    handleValidationErrors,
  ],
  deleteWidget
);

// POST reorder widgets (array of widget IDs)
router.post(
  '/reorder',
  [
    body('widgetOrder').isArray().withMessage('widgetOrder must be an array'),
    handleValidationErrors,
  ],
  reorderWidgets
);

export default router;
