const Job = require("../models/job.model");
const User = require("../models/user.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const Company = require("../models/company.model");
const { processJobAndNotifyUsers } = require("../services/openai.service");

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
    !experienceLevel ||
    !position ||
    !companyId
  ) {
    const error = new ErrorHandler("All fields are required", 400);
    return error.sendError(res);
  }

  const company = await Company.findById(companyId);
  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  if (company.userId.toString() !== userId) {
    const error = new ErrorHandler(
      "You do not have permission to post jobs for this company.",
      403
    );
    return error.sendError(res);
  }

  const companyName = company.companyName;
  const job = await Job.create({
    title,
    description,
    requirements: Array.isArray(requirements)
      ? requirements.map((req) => req.trim()) 
      : requirements.split(",").map((req) => req.trim()), 
    salary: Number(salary),
    location,
    jobType,
    experienceLevel,
    position,
    company: companyId,
    created_by: userId,
  });

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
    salaryMin,
    salaryMax,
    experienceLevel,
    location,
    jobType,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
  } = req.query;

  const userId = req.user.id;

  const keyword = title || "";
  if (keyword) {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { searchHistory: keyword } },
      { new: true }
    );
  }

  const query = {};

  if (keyword) {
    const companies = await Company.find({
      companyName: { $regex: keyword, $options: "i" }, 
    }).select("_id");

    query.$or = [
      { title: { $regex: keyword, $options: "i" } }, 
      { company: { $in: companies.map((company) => company._id) } },
      {
        requirements: {
          $in: keyword
            .split(" ") 
            .map((term) => new RegExp(term.trim(), "i")),
        }, 
      },
    ];
  }

  if (salaryMin || salaryMax) {
    query.salary = {};
    if (salaryMin) query.salary.$gte = Number(salaryMin);
    if (salaryMax) query.salary.$lte = Number(salaryMax);
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

  const jobs = await Job.find(query)
    .populate({
      path: "company",
    })
    .populate({
      path: "applications",
    })
    .skip(skip)
    .limit(limitNumber)
    .sort(sortOptions);

  const totalJobs = await Job.countDocuments(query);

  if (jobs.length === 0) {
    const error = new ErrorHandler("Jobs Not Found", 404);
    return error.sendError(res);
  }

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

const getJobById = asyncErrorHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId).populate("applications");

  if (!job) {
    const error = new ErrorHandler("Job Not Found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({ job, success: true, status: 200 });
});

const getAdminJobs = asyncErrorHandler(async (req, res) => {
  const adminId = req.user.id; // Use req.user.id
  const jobs = await Job.find({ created_by: adminId }).populate("company");

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

module.exports = { postJob, getAllJobs, getJobById, getAdminJobs };
