const User = require("../models/user.model");
const { sendMail } = require("../utils/sendEmail");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const sendToken = require("./../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");
const Job = require("../models/job.model");
const cron = require("node-cron");
const crypto = require("crypto");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const readDocumentContent = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || !req.files.document) {
    const error = new ErrorHandler("Please upload a document file.", 400);
    return error.sendError(res);
  }

  const documentFilePath = req.files.document.tempFilePath;
  const documentData = fs.readFileSync(documentFilePath);

  const prompt = `Extract key information from the following document. Identify and return the relevant sections and headings based on the content. Format the response in JSON.`;

  const image = {
    inlineData: {
      data: Buffer.from(documentData).toString("base64"),
      mimeType: req.files.document.mimetype,
    },
  };

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([prompt, image]);

  const responseText = result.response ? result.response.text() : "";

  const cleanedText = responseText.replace(/`/g, "");
  const cleanedTextWithoutLeadingComments = cleanedText.replace(/^.*?\{/s, "{");

  try {
    const formattedContent = JSON.parse(cleanedTextWithoutLeadingComments);

    return res.status(200).json({
      success: true,
      status: 200,
      extractedContent: formattedContent,
    });
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Failed to parse extracted content.",
      error: error.message,
    });
  }
});

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { fullname, phoneNumber, email, password, role } = req.body;
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
      folder: "avatar",
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

  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;
  await user.save();

  const verificationUrl = `https://nexthire-portal.netlify.app/verify-email?token=${verificationToken}`;

  const emailBody = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    html: `
      <p>Hello,</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" style="color:blue;">Verify Email</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  await sendMail(emailBody);
  sendToken(user, 200, res);
});

const verifyEmail = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.query;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    const error = new ErrorHandler(
      "Invalid or expired verification token",
      400
    );
    return error.sendError(res);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Email verified successfully",
  });
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    const error = new ErrorHandler("Please Enter Email And Password", 400);
    return error.sendError(res);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new ErrorHandler("User does not exist. Please sign up.", 404);
    return error.sendError(res);
  }
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

const changePassword = asyncErrorHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    const error = new ErrorHandler(
      "Both current and new password are required",
      400
    );
    return error.sendError(res);
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    const error = new ErrorHandler("User not found", 404);
    return error.sendError(res);
  }

  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    const error = new ErrorHandler("Current password is incorrect", 401);
    return error.sendError(res);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Password updated successfully",
  });
});

const forgetPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    const error = new ErrorHandler("Email is required", 400);
    return error.sendError(res);
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = new ErrorHandler("User not found with this email", 404);
    return error.sendError(res);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `https://nexthire-portal.netlify.app/reset-password?token=${resetToken}`;

  const emailBody = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `You requested to reset your password. Click the link to reset: ${resetUrl}`,
    html: `
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="color:blue;">Reset Password</a>
      <p>This link is valid for 15 minutes.</p>
    `,
  };

  try {
    await sendMail(emailBody);
    return res.status(200).json({
      success: true,
      status: 200,
      message: `Reset password link sent to ${email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    const error = new ErrorHandler(
      "Failed to send email. Try again later.",
      500
    );
    return error.sendError(res);
  }
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  console.log("token", token, newPassword);

  if (!token || !newPassword) {
    const error = new ErrorHandler("Token and new password are required", 400);
    return error.sendError(res);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    const error = new ErrorHandler("Invalid or expired reset token", 400);
    return error.sendError(res);
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Password reset successfully",
  });
});

const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const { fullname, email, phoneNumber, bio, skills } = req.body;
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

const getUserSearchHistory = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("searchHistory");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const cleanedSearchHistory = [
    ...new Set(user.searchHistory.map((term) => term.trim().toLowerCase())),
  ];

  return res.status(200).json({
    success: true,
    status: 200,
    searchHistory: cleanedSearchHistory,
  });
});

const clearUserSearchHistory = asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;

  await User.findByIdAndUpdate(userId, { searchHistory: [] }, { new: true });

  return res.status(200).json({
    success: true,
    status: 200,
    message: "Search history cleared successfully.",
  });
});

const getSearchResult = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("searchHistory");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const searchKeywords = [
    ...new Set(user.searchHistory.map((term) => term.trim().toLowerCase())),
  ];

  if (searchKeywords.length === 0) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "No search history found",
      jobs: [],
    });
  }
  const jobQuery = {
    $or: [
      {
        title: {
          $in: searchKeywords.map((keyword) => new RegExp(keyword, "i")),
        },
      },
      {
        companyName: {
          $in: searchKeywords.map((keyword) => new RegExp(keyword, "i")),
        },
      },
      {
        requirements: {
          $in: searchKeywords.map((keyword) => new RegExp(keyword, "i")),
        },
      },
    ],
  };

  const jobs = await Job.find(jobQuery)
    .populate("company")
    .populate("applications");

  if (!jobs.length) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "No jobs found matching the search history",
      jobs: [],
    });
  }

  const uniqueJobs = jobs.reduce(
    (acc, job) => {
      if (!acc.jobIds.has(job._id.toString())) {
        acc.jobIds.add(job._id.toString());
        acc.jobs.push(job);
      }
      return acc;
    },
    { jobIds: new Set(), jobs: [] }
  );
  return res.status(200).json({
    success: true,
    status: 200,
    jobs: uniqueJobs.jobs,
  });
});

const recommendJobsToUsers = async () => {
  const users = await User.find().populate("jobRecommendations");

  for (const user of users) {
    const skills = user.profile.skills || [];
    const bio = user.profile.bio || "";
    user.jobRecommendations = [];
    if (skills.length > 0 || bio) {
      const jobQuery = {
        $or: [
          ...skills.map((skill) => ({
            requirements: { $regex: skill, $options: "i" },
          })),
          { title: { $regex: bio, $options: "i" } },
        ],
      };

      const jobs = await Job.find(jobQuery);
      const jobIds = jobs.map((job) => job._id);

      user.jobRecommendations = Array.from(
        new Set([...user.jobRecommendations, ...jobIds])
      );

      await user.save();
    }
  }
};
cron.schedule("* * * * *", async () => {
  console.log("Running job recommendation task every minute...");
  try {
    await recommendJobsToUsers();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

const getRecommendedJobs = asyncErrorHandler(async (req, res, next) => {
  const {
    title,
    salary,
    experienceLevel,
    location,
    jobType,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
  } = req.query;

  const userId = req.user.id;

  const user = await User.findById(userId).populate("jobRecommendations");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (!user.jobRecommendations || user.jobRecommendations.length === 0) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "No recommended jobs found",
      recommendedJobs: [],
    });
  }

  const jobIds = user.jobRecommendations.map((job) => job._id);

  const query = {
    _id: { $in: jobIds },
  };

  if (title) {
    const keyword = title.trim();
    query.title = { $regex: keyword, $options: "i" };
  }

  if (salary) {
    const [minSalary, maxSalary] = salary
      .split("-")
      .map((s) => s.replace(/,/g, "").trim());
    query.salary = {};
    if (minSalary) query.salary.$gte = Number(minSalary);
    if (maxSalary) query.salary.$lte = Number(maxSalary);
  }

  if (experienceLevel) {
    query.experienceLevel = Number(experienceLevel);
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = { $regex: jobType, $options: "i" };
  }

  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const sortOptions = {};
  if (sortBy) {
    const order = sortOrder === "asc" ? 1 : -1;
    sortOptions[sortBy] = order;
  } else {
    sortOptions.createdAt = -1;
  }

  const recommendedJobs = await Job.find(query)
    .populate({ path: "company" })
    .populate({ path: "applications" })
    .skip(skip)
    .limit(limitNumber)
    .sort(sortOptions);

  const totalJobs = await Job.countDocuments(query);

  if (recommendedJobs.length === 0) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "No recommended jobs found matching your criteria",
      recommendedJobs: [],
    });
  }

  const totalPages = Math.ceil(totalJobs / limitNumber);

  return res.status(200).json({
    jobs: recommendedJobs,
    currentPage: pageNumber,
    totalPages,
    totalJobs,
    limit: limitNumber,
    success: true,
    status: 200,
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getUserSearchHistory,
  clearUserSearchHistory,
  getRecommendedJobs,
  getSearchResult,
  verifyEmail,
  readDocumentContent,
  changePassword,
  forgetPassword,
  resetPassword,
};
