import AutomationRule from '../models/AutomationRule.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';


export const getAllRules = asyncHandler(async (req, res) => {
  const rules = await AutomationRule.find({ owner: req.user._id });
  return res.json(new ApiResponse(200, rules));
});


export const createRule = asyncHandler(async (req, res) => {
  const { name, trigger, actions } = req.body;

  const newRule = await AutomationRule.create({
    name,
    trigger,
    actions,
    owner: req.user._id,
    enabled: true
  });

  return res.status(201).json(new ApiResponse(201, newRule, 'Automation rule created'));
});


export const updateRule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const rule = await AutomationRule.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    updates,
    { new: true }
  );

  if (!rule) throw new ApiError(404, 'Automation rule not found');

  return res.json(new ApiResponse(200, rule, 'Automation rule updated'));
});


export const toggleRule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { enabled } = req.body;

  const rule = await AutomationRule.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    { enabled },
    { new: true }
  );

  if (!rule) throw new ApiError(404, 'Automation rule not found');

  return res.json(new ApiResponse(200, rule, `Automation rule ${enabled ? 'enabled' : 'disabled'}`));
});


export const deleteRule = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const rule = await AutomationRule.findOneAndDelete({
    _id: id,
    owner: req.user._id
  });

  if (!rule) throw new ApiError(404, 'Automation rule not found');

  return res.json(new ApiResponse(200, rule, 'Automation rule deleted'));
});
