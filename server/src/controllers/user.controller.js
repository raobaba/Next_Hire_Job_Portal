const User = require("../models/user.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const sendToken = require("./../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");
const Job = require("../models/job.model");
const cron = require("node-cron");

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
    status: 200,
    message: "successfully Logged Out",
  });
});

const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const { fullname, email, phoneNumber, bio, skills, resume } = req.body;
  console.log(req.body);
  const userId = req.user.id;
  let user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (fullname) user.fullname = fullname;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (bio) user.profile.bio = bio;
  if (skills) {
    user.profile.skills = skills.split(",").map((skill) => skill.trim());
  }

  if (req.files && req.files.avatar && req.files.avatar.tempFilePath) {
    if (user.profile.profilePhoto && user.profile.profilePhoto.public_id) {
      await cloudinary.uploader.destroy(user.profile.profilePhoto.public_id);
    }
    const result = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath,
      {
        folder: "avatars",
        width: 150,
        crop: "scale",
      }
    );
    user.profile.profilePhoto = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  // Check if a resume file is uploaded
  if (req.files && req.files.resume && req.files.resume.tempFilePath) {
    if (user.profile.resume && user.profile.resume.public_id) {
      await cloudinary.uploader.destroy(user.profile.resume.public_id);
    }
    const resumeUpload = await cloudinary.uploader.upload(
      req.files.resume.tempFilePath,
      {
        folder: "resumes",
      }
    );
    user.profile.resume = {
      public_id: resumeUpload.public_id,
      url: resumeUpload.secure_url,
      resumeOriginalName: req.files.resume.name,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
});

// Retrieve User Search History
const getUserSearchHistory = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("searchHistory"); // Select only searchHistory

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  return res.status(200).json({
    success: true,
    status: 200,
    searchHistory: user.searchHistory,
  });
});

// Clear User Search History
const clearUserSearchHistory = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id; // Get user ID from request

  await User.findByIdAndUpdate(
    userId,
    { searchHistory: [] }, // Clear searchHistory by setting it to an empty array
    { new: true } // Return the updated document
  );

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Search history cleared successfully.",
  });
});

const recommendJobsToUsers = async () => {
  const users = await User.find().populate("jobRecommendations");

  for (const user of users) {
    const keywords = user.searchHistory;

    if (keywords.length > 0) {
      // Use $regex for partial matching of keywords in job fields
      const jobQuery = {
        $or: keywords.map((keyword) => ({
          $or: [
            { title: { $regex: keyword, $options: "i" } }, // Partial match in title
            { description: { $regex: keyword, $options: "i" } }, // Partial match in description
            { requirements: { $regex: keyword, $options: "i" } }, // Partial match in requirements
            { location: { $regex: keyword, $options: "i" } }, // Partial match in location
            { jobType: { $regex: keyword, $options: "i" } }, // Partial match in job type
          ],
        })),
      };

      // Find jobs matching the updated query
      const jobs = await Job.find(jobQuery);

      // Extract job IDs from the retrieved jobs
      const jobIds = jobs.map((job) => job._id);
      console.log(jobIds);
      // Update user's job recommendations
      user.jobRecommendations = Array.from(
        new Set([...user.jobRecommendations, ...jobIds])
      ); // Avoid duplicates
      await user.save(); // Save updated user
    }
  }
};

cron.schedule("0 * * * *", async () => {
  console.log("Running job recommendation task...");
  try {
    await recommendJobsToUsers();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getUserSearchHistory,
  clearUserSearchHistory,
};
