const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    // Add other fields related to your request
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
