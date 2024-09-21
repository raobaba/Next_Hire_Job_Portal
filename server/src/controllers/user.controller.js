const User = require("../models/user.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const sendToken = require("./../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// Register User
const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { fullname, phoneNumber, email, password, role } = req.body;
  // Ensure required fields are provided
  if (!fullname || !phoneNumber || !email || !password || !role) {
    const error = new ErrorHandler("All fields are required", 400);
    return error.sendError(res);
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    const error = new ErrorHandler("User with this email already exists", 400);
    return error.sendError(res);
  }
  const myCloud = await cloudinary.uploader.upload(
    req.files.avatar.tempFilePath,
    {
      folder: "avatars",
      width: 150,
      crop: "scale",
    }
  );
  const user = await User.create({
    fullname,
    phoneNumber,
    email,
    password,
    role,
    profile: {
      profilePhoto: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    },
  });
  sendToken(user, 200, res);
});

// Login User
const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    const error = new ErrorHandler("Please Enter Email And Password", 400);
    return error.sendError(res);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new ErrorHandler("Invalid Email", 401);
    return error.sendError(res);
  }

  // check role is correct or not
  if (role !== user.role) {
    const error = new ErrorHandler(
      "Account doesn't exist with current role.",
      400
    );
    return error.sendError(res);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    const error = new ErrorHandler("Incorrect Password", 401);
    return error.sendError(res);
  }

  sendToken(user, 200, res);
});

// Logout User
const logoutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "successfully Logged Out",
  });
});

const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const { fullname, email, phoneNumber, bio, skills } = req.body;
  console.log(req.body);
  const userId = req.user.id;

  // Find the user by their ID
  let user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Update basic user information
  if (fullname) user.fullname = fullname;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (bio) user.profile.bio = bio;

  // Update skills (convert comma-separated string to array)
  if (skills) {
    user.profile.skills = skills.split(",").map((skill) => skill.trim());
  }

  // Check if an avatar file is uploaded
  if (req.files && req.files.avatar && req.files.avatar.tempFilePath) {
    // If user already has a profile photo, delete the old one from Cloudinary
    if (user.profile.profilePhoto && user.profile.profilePhoto.public_id) {
      await cloudinary.uploader.destroy(user.profile.profilePhoto.public_id);
    }

    // Upload new profile photo to Cloudinary
    const result = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath,
      {
        folder: "avatars",
        width: 150,
        crop: "scale",
      }
    );

    // Update user's profile photo information
    user.profile.profilePhoto = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  // Save the updated user data
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
};
