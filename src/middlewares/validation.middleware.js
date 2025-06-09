import { body, query, param, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

export const validateRegister = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['admin', 'operator', 'viewer'])
    .withMessage('Invalid role'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateDevice = [
  body('deviceId')
    .notEmpty()
    .withMessage('Device ID is required')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Device ID can only contain letters, numbers, hyphens, and underscores'),
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Device name must be between 1 and 100 characters'),
  body('type')
    .isIn(['sensor', 'actuator', 'gateway', 'controller'])
    .withMessage('Invalid device type'),
  body('category')
    .optional()
    .isIn(['temperature', 'humidity', 'pressure', 'motion', 'light', 'air_quality', 'water', 'energy', 'security', 'other'])
    .withMessage('Invalid device category'),
  handleValidationErrors
];

export const validateSensorData = [
  body('deviceId')
    .notEmpty()
    .withMessage('Device ID is required'),
  body('value')
    .notEmpty()
    .withMessage('Value is required'),
  body('unit')
    .notEmpty()
    .withMessage('Unit is required'),
  body('quality')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Quality must be between 0 and 100'),
  handleValidationErrors
];

export const validateAutomationRule = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Rule name must be between 1 and 100 characters'),
  body('conditions')
    .isArray({ min: 1 })
    .withMessage('At least one condition is required'),
  body('actions')
    .isArray({ min: 1 })
    .withMessage('At least one action is required'),
  handleValidationErrors
];

export const validateTimeRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Limit must be between 1 and 10000'),
  handleValidationErrors
];

export const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  handleValidationErrors
];