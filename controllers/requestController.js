const asyncHandler = require("express-async-handler");
const Request = require("../models/requestModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Create a request
const createRequest = asyncHandler(async (req, res) => {
  const { productId, requestedQuantity } = req.body;
  const userId = req.user.id;

  try {
    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the requested quantity is valid
    if (requestedQuantity <= 0) {
      return res.status(400).json({ message: "Requested quantity must be greater than 0" });
    }

    if (requestedQuantity > product.quantity) {
      return res.status(400).json({ message: "Requested quantity is greater than available quantity" });
    }

    // Find the user to get the user's name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the request
    const request = new Request({
      user: userId,
      userName: user.name,
      productId: productId,
      quantity: requestedQuantity,
      status: "Pending", // Default status
    });

    // Save the request to the database
    const createdRequest = await request.save();

    // Deduct the requested quantity from the product quantity
    product.quantity -= requestedQuantity;
    await product.save();

    res.status(201).json("Request created successfully");

  } catch (error) {
  if (error.name === "ValidationError") {
    res.status(400).json({ message: "Validation error. Please check your input." });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
  }
});
// Approve a request
const approveRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const adminUserId = req.user.id; // Assuming you have admin user authentication

  // Find the request
  const request = await Request.findById(requestId);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // Check if the user is an admin (you may have a role-based authentication system)
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "You are not authorized to approve requests" });
  }

  // Update the request status to "Approved" and set approvedBy
  request.status = "Approved";
  request.approvedBy = adminUserId;
  await request.save();

  // Add the requested quantity back to the product's available quantity
  const product = await Product.findById(request.productId);
  product.quantity += request.quantity;
  await product.save();

  res.status(200).json({ message: "Request approved successfully" });
});

// Reject a request
const rejectRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const adminUserId = req.user.id; // Assuming you have admin user authentication

  // Find the request
  const request = await Request.findById(requestId);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // Check if the user is an admin
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "You are not authorized to reject requests" });
  }

  // Update the request status to "Rejected" and set approvedBy
  request.status = "Rejected";
  request.approvedBy = adminUserId;
  await request.save();

  res.status(200).json({ message: "Request rejected successfully" });
});

// Get all requests
const getAllRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find().sort("-createdAt");
  res.status(200).json(requests);
});

// Get a particular request
const getRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const request = await Request.findById(requestId);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  res.status(200).json(request);
});

// Delete a request
const deleteRequest = asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const request = await Request.findById(requestId);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  await request.remove();

  res.status(200).json({ message: "Request deleted successfully" });
});


module.exports = {
  createRequest,
  approveRequest,
  rejectRequest,
  getAllRequests, 
  getRequest,     
  deleteRequest,
};
