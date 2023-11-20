const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const isAdmin = require("../middleWare/isAdmin");

router.post("/", protect, createProduct);
router.patch("/:id", protect, updateProduct);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, isAdmin,deleteProduct);

module.exports = router;
