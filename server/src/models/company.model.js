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
  },
  { timestamps: true }
);
module.exports = mongoose.model("Company", companySchema);
