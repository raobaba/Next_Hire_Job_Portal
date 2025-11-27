const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, // Index for search queries
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      type: Number,
      required: true,
      index: true, // Index for salary filtering
    },
    experienceLevel: {
      type: Number,
      required: true,
      index: true, // Index for experience filtering
    },
    location: {
      type: String,
      required: true,
      index: true, // Index for location filtering
    },
    jobType: {
      type: String,
      required: true,
      index: true, // Index for job type filtering
    },
    position: {
      type: Number,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true, // Index for company queries
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for admin jobs queries
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
jobSchema.index({ company: 1, createdAt: -1 }); // For company jobs sorted by date
jobSchema.index({ created_by: 1, createdAt: -1 }); // For admin jobs sorted by date
jobSchema.index({ title: "text", location: "text" }); // Text search index
jobSchema.index({ salary: 1, experienceLevel: 1, location: 1 }); // Compound filter index

module.exports = mongoose.model("Job", jobSchema);
