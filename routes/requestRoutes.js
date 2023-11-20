const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createRequest,
  approveRequest,
  rejectRequest,
  getAllRequests,
  getRequest,
  deleteRequest,
} = require("../controllers/requestController");

router.post("/:id", protect, createRequest);
router.patch("/approve/:id", protect, approveRequest);
router.patch("/reject/:id", protect, rejectRequest);
router.get("/", protect, getAllRequests);        
router.get("/:id", protect, getRequest);        
router.delete("/:id", protect, deleteRequest);  

module.exports = router;
