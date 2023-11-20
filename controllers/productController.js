const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Create Prouct
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, description } = req.body;

  //   Validation
  if (!name || !category || !quantity || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }


  // Create Product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    description,
  });

  res.status(201).json(product);
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort("-createdAt");
  res.status(200).json(products);
});

// // Get all Products
// const getProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find({ user: req.user.id }).sort("-createdAt");
//   res.status(200).json(products);
// });

// Get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Item not found");
  }
  // Match product to its user
  // if (product.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }
  res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Item not found");
  }
  // Match product to its user
  // if (product.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }
  await Product.findByIdAndDelete(product._id);
  res.status(200).json({ message: "Item deleted." });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Item not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      description,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
