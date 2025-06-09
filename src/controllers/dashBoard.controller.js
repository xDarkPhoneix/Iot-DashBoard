import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Dashboard } from "../models/dashBoard.model.js";

/**
 * @desc Get all dashboard widgets for the current user
 */
const getAllWidgets = asyncHandler(async (req, res) => {
  const widgets = await Dashboard.find({ user: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, widgets, "Fetched dashboard widgets"));
});

/**
 * @desc Add a new widget to the user's dashboard
 */
// widgetController.js
const addWidget = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    deviceId,
    dataKey,
    position,
    config
  } = req.body;

  if (!type || !title || !deviceId) {
    throw new ApiError(400, 'Missing required fields');
  }

  const newWidget = await Widget.create({
    owner: req.user.id,
    type,
    title,
    deviceId,
    dataKey,
    position,
    config
  });

  res.status(201).json(new ApiResponse(201, newWidget, "Widget created"));
});


/**
 * @desc Update an existing widget
 */
const updateWidget = asyncHandler(async (req, res) => {
  const { widgetId } = req.params;
  const { config } = req.body;

  const updatedWidget = await Dashboard.findOneAndUpdate(
    { _id: widgetId, user: req.user._id },
    { $set: { config } },
    { new: true }
  );

  if (!updatedWidget) {
    throw new ApiError(404, "Widget not found or not owned by user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedWidget, "Widget updated successfully"));
});

/**
 * @desc Delete a widget
 */
const deleteWidget = asyncHandler(async (req, res) => {
  const { widgetId } = req.params;

  const deletedWidget = await Dashboard.findOneAndDelete({
    _id: widgetId,
    user: req.user._id,
  });

  if (!deletedWidget) {
    throw new ApiError(404, "Widget not found or not owned by user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedWidget, "Widget removed successfully"));
});

/**
 * @desc Reorder dashboard widgets
 */
const reorderWidgets = asyncHandler(async (req, res) => {
  const { widgetOrder } = req.body;

  if (!Array.isArray(widgetOrder)) {
    throw new ApiError(400, "widgetOrder must be an array of widget IDs");
  }

  const widgets = await Dashboard.find({ user: req.user._id });

  const updated = await Promise.all(
    widgetOrder.map((id, index) =>
      Dashboard.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { $set: { position: index } },
        { new: true }
      )
    )
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Widget order updated"));
});

export {
  getAllWidgets,
  addWidget,
  updateWidget,
  deleteWidget,
  reorderWidgets,
};
