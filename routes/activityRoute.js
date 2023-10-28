const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createActivity,
  getActivities,
  getActivity,
  deleteActivity,
  updateActivity,
} = require("../controllers/activityController");


router.post("/", protect, createActivity);
router.patch("/:id", protect, updateActivity);
router.get("/", protect, getActivities);
router.get("/:id", protect, getActivity);
router.delete("/:id", protect, deleteActivity);

module.exports = router;

