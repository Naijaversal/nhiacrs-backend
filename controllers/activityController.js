const asyncHandler = require("express-async-handler");
const Activity = require("../models/activityModel");

// Create Activity
const createActivity = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, status } = req.body;

  // Validation
  if (!title || !description || !startDate || !endDate || !status) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Create Activity
  const activity = await Activity.create({
    user: req.user._id,
    title,
    description,
    startDate,
    endDate,
    status,
  });

  res.status(201).json(activity);
});

// Get all Activities
const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(activities);
});

// Get single activity
const getActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  if (activity.user.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.status(200).json(activity);
});

// Delete Activity
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  if (activity.user.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await activity.remove();
  res.status(200).json({ message: "Activity deleted" });
});

// Update Activity
const updateActivity = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, status } = req.body;
  const { id } = req.params;

  const activity = await Activity.findById(id);

  if (!activity) {
    res.status(404);
    throw new Error("Activity not found");
  }

  if (activity.user.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedActivity = await Activity.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
      startDate,
      endDate,
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedActivity);
});

module.exports = {
  createActivity,
  getActivities,
  getActivity,
  deleteActivity,
  updateActivity,
};
