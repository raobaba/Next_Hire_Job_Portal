const Job = require("../models/job.model");
const User = require("../models/user.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const Company = require("../models/company.model");
const Application = require('../models/application.model')
const { processJobAndNotifyUsers, notifyJobDeletion } = require("../services/openai.service");
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
  const keyword = title || "";

  // Update search history if keyword exists
  if (keyword) {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { searchHistory: keyword } },
      { new: true }
    );
  }

  const query = {};

  // Handle title search with company names or requirements
  if (keyword) {
    const companies = await Company.find({
      companyName: { $regex: keyword, $options: "i" },
    }).select("_id");

    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { company: { $in: companies.map((company) => company._id) } },
      {
        requirements: {
          $in: keyword.split(" ").map((term) => new RegExp(term.trim(), "i")),
        },
      },
    ];
  }

  // Handle salary filtering based on a range
  if (salary) {
    const [minSalary, maxSalary] = salary.split('-').map((s) => s.replace(/,/g, '').trim());
    query.salary = {};
    if (minSalary) query.salary.$gte = Number(minSalary);
    if (maxSalary) query.salary.$lte = Number(maxSalary);
  }

  // Handle experience level filter
  if (experienceLevel) {
    query.experienceLevel = Number(experienceLevel);
  }

  // Handle location filter with case-insensitive regex
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Handle job type filter with case-insensitive regex
  if (jobType) {
    query.jobType = { $regex: jobType, $options: "i" };
  }

  // Pagination settings
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  // Sorting settings
  const sortOptions = {};
  if (sortBy) {
    const order = sortOrder === "asc" ? 1 : -1;
    sortOptions[sortBy] = order;
  } else {
    sortOptions.createdAt = -1;
  }

  // Retrieve jobs based on the constructed query
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
  const totalPages = Math.ceil(totalJobs / limitNumber);

  // Return a response even if no jobs are found
  return res.status(200).json({
    jobs,
    currentPage: pageNumber,
    totalPages,
    totalJobs,
    limit: limitNumber,
    success: true,
    status: 200,
    message: jobs.length === 0 ? "No jobs found matching your criteria" : "Jobs retrieved successfully",
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

const deleteAdminJobs = asyncErrorHandler(async (req, res) => {
  const jobId = req.params.id;
  try {
    const job = await Job.findById(jobId)
      .populate("applications")
      .populate("company");

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const companyName = job.company.companyName;
    const jobTitle = job.title;
    const applicantIds = job.applications.map(application => application.applicant);
    const applicants = await User.find({ _id: { $in: applicantIds } });

    await Job.findByIdAndDelete(jobId);
    await notifyJobDeletion(jobTitle, companyName, applicants);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Job deleted successfully and applicants notified.",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


const getSimilarJobs = asyncErrorHandler(async (req, res) => {
  const jobId = req.params.id;
  const limit = parseInt(req.query.limit, 10) || 5;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      const error = new ErrorHandler("Job not found", 404);
      return error.sendError(res);
    }

    const query = {
      _id: { $ne: jobId },
      $or: [
        { title: { $regex: job.title, $options: "i" } },
        { location: { $regex: job.location, $options: "i" } },
        { jobType: job.jobType },
        { experienceLevel: job.experienceLevel },
      ],
    };

    const similarJobs = await Job.find(query)
      .populate({
        path: "company",
        select: "companyName",
      })
      .limit(limit);

    if (similarJobs.length === 0) {
      const error = new ErrorHandler("No similar jobs found", 404);
      return error.sendError(res);
    }

    return res.status(200).json({
      success: true,
      jobs: similarJobs,
      totalJobs: similarJobs.length,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching similar jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { postJob, getAllJobs, getJobById, getAdminJobs, deleteAdminJobs, getSimilarJobs };

