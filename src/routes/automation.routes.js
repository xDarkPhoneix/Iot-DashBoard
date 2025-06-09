import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  validateAutomationRule,
  validateObjectId
} from '../validators/validation.js';
import {
  getAllRules,
  createRule,
  updateRule,
  toggleRule,
  deleteRule
} from '../controllers/automation.controller.js';

const router = express.Router();

router.use(verifyJWT);

router.get('/', getAllRules);
router.post('/', validateAutomationRule, createRule);
router.patch('/:id', validateObjectId('id'), validateAutomationRule, updateRule);
router.patch('/:id/toggle', validateObjectId('id'), toggleRule);
router.delete('/:id', validateObjectId('id'), deleteRule);

export default router;
