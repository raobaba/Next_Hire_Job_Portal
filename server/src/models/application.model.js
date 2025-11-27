const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true, // Index for job queries
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for applicant queries
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true, // Index for status filtering
    },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
applicationSchema.index({ applicant: 1, createdAt: -1 }); // For user's applications sorted by date
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ job: 1, status: 1 }); // For job applications filtered by status

module.exports = mongoose.model("Application", applicationSchema);
