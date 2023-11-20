const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

// Create Task
const createTask = asyncHandler(async (req, res) => {
  const {title, startDate, endDate, description, department, status} = req.body;

  // Validation
  if (!title || !startDate || !endDate || !description || !department || !status) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  const task = await Task.create({
    user: req.user.id,
    title,
    startDate,
    endDate,
    description,
    department,
    status
  });
  res.status(201).json(task);
});

// Get all Tasks
const getTasks = asyncHandler(async (req, res) => {
  // Check the user's role
  if (req.user.role === "Admin") {
    // If the user is an Admin, get all tasks
    const tasks = await Task.find().sort("-createdAt");
    res.status(200).json(tasks);
  } else {
    // For regular users, get tasks related to their user ID
    const tasks = await Task.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json(tasks);
  }
});

// Get single Task
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.status(200).json(task);
});

// Delete Task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
 if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  // if (task.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }
  // Delete the task from the database
  await Task.findByIdAndDelete(task._id);
  res.status(200).json({ message: "Task deleted." });
});

// Update Task
const updateTask = asyncHandler(async (req, res) => {
  const { title, startDate, endDate, description, department, status } = req.body;
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedTaskFields = {
    title,
    startDate,
    endDate,
    description,
    department,
    status,
  };

  const updatedTask = await Task.findByIdAndUpdate(task._id,
    updatedTaskFields,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedTask);
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  deleteTask,
  updateTask,
};
