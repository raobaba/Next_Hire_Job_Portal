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
  let profilePhoto;
  if (req.files && req.files.avatar && req.files.avatar.tempFilePath) {
    const uploaded = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath,
      {
        folder: "avatar",
        width: 150,
        crop: "scale",
      }
    );
    profilePhoto = {
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  }

  const user = await User.create({
    fullname,
    phoneNumber,
    email,
    password,
    role,
    profile: profilePhoto ? { profilePhoto } : {},
  });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;
  await user.save();

  const verificationUrl = `https://nexthire-portal.netlify.app/verify-email?token=${verificationToken}`;

  const emailBody = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to NextHire - Verify Your Email",
    text: `Hello ${fullname},\n\nWelcome to NextHire! Please verify your email by clicking on the following link: ${verificationUrl}\n\nIf you didn't request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a5568;">Welcome to NextHire!</h2>
        <p>Hello <strong>${fullname}</strong>,</p>
        <p>Thank you for registering with NextHire. To complete your registration, please verify your email address.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify My Email</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #4f46e5;">${verificationUrl}</p>
        <p style="color: #718096; font-size: 14px; margin-top: 30px;">If you didn't request this email, please ignore it.</p>
      </div>
    `,
  };

  try {
    await sendMail(emailBody);
    console.log("Registration verification email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send registration verification email:", error);
    // Continue with registration even if email fails
  }
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
  // Optimize: Only select necessary fields for login
  const user = await User.findOne({ email })
    .select("+password fullname email role isVerified verificationToken profile.profilePhoto");
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

  // Check if email is verified, if not, send verification email and reject login
  if (!user.isVerified) {
    // Generate a new verification token (always generate fresh token on login attempt)
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    
    // Save user with new verification token
    await user.save();
    
    // Send verification email if email configuration is available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && email && user.fullname) {
      const verificationUrl = `https://nexthire-portal.netlify.app/verify-email?token=${verificationToken}`;

      const emailBody = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification Required - NextHire",
        text: `Hello ${user.fullname},\n\nPlease verify your email by clicking on the following link: ${verificationUrl}\n\nIf you didn't request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #4a5568;">Email Verification Required</h2>
            <p>Hello <strong>${user.fullname}</strong>,</p>
            <p>Your account is pending verification. Please verify your email address to access all features of NextHire.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify My Email</a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #4f46e5;">${verificationUrl}</p>
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">If you didn't request this email, please ignore it.</p>
          </div>
        `
      };

      // Send email (non-blocking - don't wait for it)
      sendMail(emailBody).catch((err) => {
        // Log error but don't block the error response
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to send verification email:", err.message);
        }
      });
    }
    
    // Reject login - email must be verified first
    const error = new ErrorHandler(
      "Please verify your email address before logging in. A verification email has been sent to your email address.",
      403
    );
    return error.sendError(res);
  }
  
  // If email is verified, proceed with normal login
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
  const user = await User.findById(userId)
    .select("searchHistory")
    .lean(); // Use lean() for read-only query

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Optimize: Use Set for O(1) lookup and filter empty strings
  const cleanedSearchHistory = [
    ...new Set(
      (user.searchHistory || [])
        .map((term) => term.trim().toLowerCase())
        .filter((term) => term.length > 0)
    ),
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
  const user = await User.findById(userId)
    .select("searchHistory")
    .lean(); // Use lean() for read-only query

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  
  const searchKeywords = [
    ...new Set(
      (user.searchHistory || [])
        .map((term) => term.trim().toLowerCase())
        .filter((term) => term.length > 0)
    ),
  ];

  if (searchKeywords.length === 0) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "No search history found",
      jobs: [],
    });
  }
  
  // Optimize: Build regex patterns once
  const regexPatterns = searchKeywords.map((keyword) => new RegExp(keyword, "i"));
  
  const jobQuery = {
    $or: [
      { title: { $in: regexPatterns } },
      { requirements: { $in: regexPatterns } },
    ],
  };

  // Optimize: Use aggregation with lookup for better performance
  const jobs = await Job.aggregate([
    { $match: jobQuery },
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
        pipeline: [
          {
            $project: {
              companyName: 1,
              location: 1,
              logo: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$company" },
    { $limit: 50 }, // Limit results
    { $sort: { createdAt: -1 } },
  ]);

  if (!jobs.length) {
    return res.status(200).json({
      success: true,
      status: 200,
      message: "No jobs found matching the search history",
      jobs: [],
    });
  }

  return res.status(200).json({
    success: true,
    status: 200,
    jobs,
  });
});

const recommendJobsToUsers = async () => {
  // Optimize: Only fetch users with skills or bio, and use lean()
  const users = await User.find({
    $or: [
      { "profile.skills": { $exists: true, $ne: [] } },
      { "profile.bio": { $exists: true, $ne: "" } },
    ],
  })
    .select("profile.skills profile.bio")
    .lean();

  // Optimize: Process users in batches to avoid memory issues
  const batchSize = 10;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (user) => {
        const skills = user.profile?.skills || [];
        const bio = user.profile?.bio || "";
        
        if (skills.length === 0 && !bio) return;

        // Optimize: Build query more efficiently
        const jobQuery = {
          $or: [
            ...(skills.length > 0
              ? skills.map((skill) => ({
                  requirements: { $regex: skill.trim(), $options: "i" },
                }))
              : []),
            ...(bio ? [{ title: { $regex: bio.trim(), $options: "i" } }] : []),
          ],
        };

        const jobs = await Job.find(jobQuery)
          .select("_id")
          .lean()
          .limit(20); // Limit recommendations

        const jobIds = jobs.map((job) => job._id.toString());

        // Update user with recommendations (non-blocking)
        if (jobIds.length > 0) {
          await User.findByIdAndUpdate(user._id, {
            jobRecommendations: jobIds,
          });
        }
      })
    );
  }
};
// Optimize: Run recommendation job every 5 minutes instead of every minute
cron.schedule("*/5 * * * *", async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Running job recommendation task...");
  }
  try {
    await recommendJobsToUsers();
  } catch (error) {
    console.error("Error in cron job:", error.message);
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

  // Optimize: Only select jobRecommendations field
  const user = await User.findById(userId)
    .select("jobRecommendations")
    .lean(); // Use lean() for better performance

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

  const jobIds = user.jobRecommendations;

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

  // Optimize: Use parallel queries and lean()
  const [recommendedJobs, totalJobs] = await Promise.all([
    Job.find(query)
      .populate({
        path: "company",
        select: "companyName location logo", // Only needed fields
      })
      .populate({
        path: "applications",
        select: "status createdAt", // Only needed fields
        options: { limit: 3 }, // Limit applications
      })
      .select("-__v") // Exclude version key
      .lean() // Use lean() for better performance
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOptions),
    Job.countDocuments(query), // Parallel count query
  ]);

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
