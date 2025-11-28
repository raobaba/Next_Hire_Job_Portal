const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      index: true, // Already unique, but explicit index for faster lookups
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    logo: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for user's companies queries
    },
    stats: {
      averageResponseDays: { type: Number, default: null },
      decisionsCount: { type: Number, default: 0 },
      applicationsCount: { type: Number, default: 0 },
      hiresCount: { type: Number, default: 0 },
      hiresLast90Days: { type: Number, default: 0 },
      lastCalculatedAt: { type: Date },
    },
    badges: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Company", companySchema);
