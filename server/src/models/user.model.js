const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Already unique, but explicit index for faster lookups
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
      index: true, // Index for role-based queries
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true, // Index for verification status queries
    },
    verificationToken: {
      type: String,
      index: true, // Index for email verification lookups
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
        resumeOriginalName: { type: String },
      },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    },
    jobRecommendations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    searchHistory: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
