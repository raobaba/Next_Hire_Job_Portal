const Job = require("../models/job.model");
const User = require("../models/user.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const Company = require("../models/company.model");
const { processJobAndNotifyUsers } = require("../services/openai.service");

// Post Job
const postJob = asyncErrorHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    experienceLevel,
    position,
    companyId,
  } = req.body;
  const userId = req.user.id;

  if (
    !title ||
    !description ||
    !requirements ||
    !salary ||
    !location ||
    !jobType ||
    !experienceLevel || // Update here
    !position ||
    !companyId
  ) {
    const error = new ErrorHandler("Something is missing", 400);
    return error.sendError(res);
  }
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }
  const companyName = company.companyName;

  const job = await Job.create({
    title,
    description,
    requirements: requirements.split(",").map((req) => req.trim()),
    salary: Number(salary),
    location,
    jobType,
    experienceLevel, // Use experienceLevel directly
    position,
    company: companyId,
    created_by: userId,
  });
  await processJobAndNotifyUsers(job, companyName);
  return res.status(201).json({
    message: "New job created successfully.",
    job,
    success: true,
    status: 200,
  });
});

const getAllJobs = asyncErrorHandler(async (req, res) => {
  const { title, description } = req.query; // Destructure title and description from query parameters
  const userId = req.user.id; // Get user ID from request
  const keyword = title || description || ""; // Use title or description for search

  if (keyword) {
    // Only update the search history if a keyword is provided
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { searchHistory: keyword } }, // Use $addToSet to avoid duplicates
      { new: true } // Return the updated document
    );
  }

  // Construct the query based on the presence of title and description
  const query = {};
  if (title) {
    query.title = { $regex: title, $options: "i" }; // Match title case-insensitively
  }
  if (description) {
    query.description = { $regex: description, $options: "i" }; // Match description case-insensitively
  }

  const jobs = await Job.find(query)
    .populate("company")
    .sort({ createdAt: -1 });

  if (jobs.length === 0) {
    const error = new ErrorHandler("Jobs Not Found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({
    jobs,
    success: true,
    status: 200,
  });
});

// Get Job by ID
const getJobById = asyncErrorHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId).populate("applications");

  if (!job) {
    const error = new ErrorHandler("Job Not Found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({ job, success: true, status: 200 });
});

// Get Admin Jobs
const getAdminJobs = asyncErrorHandler(async (req, res) => {
  const adminId = req.user.id; // Use req.user.id
  const jobs = await Job.find({ created_by: adminId }).populate("company");

  if (jobs.length === 0) {
    // Change to check length
    const error = new ErrorHandler("Jobs Not Found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({
    jobs,
    success: true,
    status: 200,
  });
});

module.exports = { postJob, getAllJobs, getJobById, getAdminJobs };
