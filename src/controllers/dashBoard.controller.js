import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Dashboard } from "../models/dashBoard.model.js";
import { Widget } from "../models/dashBoard.model.js";


const getAllWidgets = asyncHandler(async (req, res) => {
  const widgets = await Widget.find({ owner: req.user._id });


  return res
    .status(200)
    .json(new ApiResponse(200, widgets, "Fetched dashboard widgets"));
});


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



const updateWidget = asyncHandler(async (req, res) => {
  const { widgetId } = req.params;
  const { config } = req.body;

  const updatedWidget = await Widget.findOneAndUpdate(
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


const deleteWidget = asyncHandler(async (req, res) => {
  const { widgetId } = req.params;

  const deletedWidget = await Widget.findOneAndDelete({
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


const reorderWidgets = asyncHandler(async (req, res) => {
  const { widgetOrder } = req.body;

  if (!Array.isArray(widgetOrder)) {
    throw new ApiError(400, "widgetOrder must be an array of widget IDs");
  }

  // Fetch existing widgets of the user
  const userWidgets = await Widget.find({ owner: req.user._id }).select('_id');

  const validWidgetIds = new Set(userWidgets.map((widget) => String(widget._id)));

  const invalidIds = widgetOrder.filter((id) => !validWidgetIds.has(String(id)));

  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid widget IDs: ${invalidIds.join(', ')}`);
  }

  // Update positions
  const updates = await Promise.all(
    widgetOrder.map((id, index) =>
      Widget.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        { $set: { position: index } },
        { new: true }
      )
    )
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updates, "Widget order updated successfully"));
});


export {
  getAllWidgets,
  addWidget,
  updateWidget,
  deleteWidget,
  reorderWidgets,
};
