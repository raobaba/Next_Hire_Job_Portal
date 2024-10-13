const Job = require("../models/job.model");
const User = require("../models/user.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const Company = require("../models/company.model");
const { processJobAndNotifyUsers } = require("../services/openai.service");

// Post Job
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

  // Check if all required fields are present
  if (
    !title ||
    !description ||
    !requirements ||
    !salary ||
    !location ||
    !jobType ||
    !experienceLevel ||
    !position ||
    !companyId
  ) {
    const error = new ErrorHandler("All fields are required", 400);
    return error.sendError(res);
  }

  // Check if company exists
  const company = await Company.findById(companyId);
  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  // Check if the user has permission to post jobs for this company
  if (company.userId.toString() !== userId) {
    const error = new ErrorHandler(
      "You do not have permission to post jobs for this company.",
      403
    );
    return error.sendError(res);
  }

  // Create the job
  const companyName = company.companyName;
  const job = await Job.create({
    title,
    description,
    requirements: Array.isArray(requirements)
      ? requirements.map((req) => req.trim()) // Expecting an array from the frontend
      : requirements.split(",").map((req) => req.trim()), // Fallback if a comma-separated string is passed
    salary: Number(salary),
    location,
    jobType,
    experienceLevel, // Use experienceLevel directly
    position,
    company: companyId,
    created_by: userId,
  });

  // Notify users
  await processJobAndNotifyUsers(job, companyName);

  // Return response
  return res.status(201).json({
    message: "New job created successfully.",
    job,
    success: true,
    status: 200,
  });
});

const getAllJobs = asyncErrorHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    companyName,
    salaryMin,
    salaryMax,
    experienceLevel,
    location,
    jobType,
    sortBy, // Sorting parameter
    sortOrder, // Sorting order: 'asc' or 'desc'
    page = 1, // Default page is 1
    limit = 10, // Default limit is 10
  } = req.query;

  const userId = req.user.id;
  const keyword = title || description || companyName || ""; // Any keyword for search

  if (keyword) {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { searchHistory: keyword } }, // Update search history
      { new: true }
    );
  }

  // Construct the query object
  const query = {};

  // Search by title
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  // Search by description
  if (description) {
    query.description = { $regex: description, $options: "i" };
  }

  // Search by requirements
  if (requirements) {
    query.requirements = {
      $in: requirements.split(",").map((req) => req.trim()),
    };
  }

  // Filter by company name
  if (companyName) {
    const companies = await Company.find({
      companyName: { $regex: companyName, $options: "i" },
    }).select("_id");

    query.company = { $in: companies.map((company) => company._id) };
  }

  // Filter by salary range
  if (salaryMin || salaryMax) {
    query.salary = {};
    if (salaryMin) query.salary.$gte = Number(salaryMin);
    if (salaryMax) query.salary.$lte = Number(salaryMax);
  }

  // Filter by experience level
  if (experienceLevel) {
    query.experienceLevel = Number(experienceLevel);
  }

  // Filter by location
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Filter by job type
  if (jobType) {
    query.jobType = { $regex: jobType, $options: "i" };
  }

  // Pagination logic
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  // Sort logic
  const sortOptions = {};
  if (sortBy) {
    const order = sortOrder === "asc" ? 1 : -1;
    sortOptions[sortBy] = order;
  } else {
    sortOptions.createdAt = -1; // Default sort by newest first
  }

  // Fetch jobs with filters, pagination, and sorting
  const jobs = await Job.find(query)
  .populate({
    path: 'company'
  })
  .populate({
    path: 'applications', // Assuming 'applications' is the field that holds the application references
  })
    .skip(skip) // Skip for pagination
    .limit(limitNumber) // Limit for pagination
    .sort(sortOptions);

  const totalJobs = await Job.countDocuments(query); // Get total jobs for pagination

  if (jobs.length === 0) {
    const error = new ErrorHandler("Jobs Not Found", 404);
    return error.sendError(res);
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalJobs / limitNumber);

  return res.status(200).json({
    jobs,
    currentPage: pageNumber,
    totalPages,
    totalJobs,
    limit: limitNumber,
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
