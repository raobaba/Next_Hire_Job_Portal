const Application = require("../models/application.model");
const Job = require("../models/job.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

// Apply for a job
const applyJob = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    if (!jobId) {
      return new ErrorHandler("Job ID is required", 400).sendError(res);
    }
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return new ErrorHandler(
        "You have already applied for this job",
        400
      ).sendError(res);
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return new ErrorHandler("Job not found", 404).sendError(res);
    }

    // Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // Add the application to the job's applications array
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

// Get all jobs applied for by the user
const getAppliedJobs = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
        },
      });

    if (!applications.length) {
      return new ErrorHandler("No applications found", 404).sendError(res);
    }

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

// Get applicants for a specific job
const getApplicants = asyncErrorHandler(async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return new ErrorHandler("Job not found", 404).sendError(res);
    }

    return res.status(200).json({
      applicants: job.applications,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

// Update the status of an application
const updateStatus = asyncErrorHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return new ErrorHandler("Status is required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

module.exports = { applyJob, getAppliedJobs, getApplicants, updateStatus };
