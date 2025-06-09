import express from 'express';
import {
  getAllWidgets,
  addWidget,
  updateWidget,
  deleteWidget,
  reorderWidgets,
} from '../controllers/dashBoard.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'; // your auth middleware

const router = express.Router();

// Protect all routes with auth
router.use(verifyJWT);

// GET all widgets for current user
router.get('/widgets', getAllWidgets);

// POST add a new widget
router.post('/addWidget', addWidget);

// PUT update a widget config
router.put('widgets/:widgetId', updateWidget);

// DELETE a widget by id
router.delete('widgets/:widgetId', deleteWidget);

// POST reorder widgets (array of widget IDs)
router.post('widgets/reorder', reorderWidgets);

export default router;
