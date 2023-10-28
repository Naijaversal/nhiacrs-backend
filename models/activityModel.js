const mongoose = require("mongoose");

const activitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Please specify a start date for the task"],
    },
    endDate: {
      type: Date,
      required: [true, "Please specify an end date for the task"],
    },
    status: {
      type: String,
     required: [true, "Please specify a start date for the task"],
    },
   
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
