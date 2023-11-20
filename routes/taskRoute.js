const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createTask,
  getTasks,
  getTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

router.post("/", protect, createTask);
router.patch("/:id", protect, updateTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
