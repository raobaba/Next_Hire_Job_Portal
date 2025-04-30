const Application = require("../models/application.model");
const Job = require("../models/job.model");
const Company = require("../models/company.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const {
  notifyApplicationReceived,
  notifyStatusUpdate,
} = require("../services/openai.service");

const ErrorHandler = require("../utils/errorHandler");

const applyJob = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;
    if (req.user.role !== "student") {
      const error = new ErrorHandler(
        "Only students are allowed to apply. Please update your account role to Student to proceed.",
        403
      );
      return error.sendError(res);
    }
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

    const job = await Job.findById(jobId).populate("company", "companyName");
    if (!job) {
      return new ErrorHandler("Job not found", 404).sendError(res);
    }
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();
    notifyApplicationReceived(req.user, job, job.company.companyName);
    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

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
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

const getApplicants = asyncErrorHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;

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
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 200,
    });
  }
});

const updateStatus = asyncErrorHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.applicationId;
    if (!status) {
      return new ErrorHandler("Status is required", 400).sendError(res);
    }

    const application = await Application.findById(applicationId).populate(
      "applicant"
    ); // Populate to get applicant details
    if (!application) {
      return new ErrorHandler("Application not found", 404).sendError(res);
    }

    const previousStatus = application.status;
    application.status = status.toLowerCase();
    await application.save();

    const job = await Job.findById(application.job);
    if (!job) {
      return new ErrorHandler("Job not found", 404).sendError(res);
    }

    const company = await Company.findById(job.company);
    if (!company) {
      return new ErrorHandler("company not found", 404).sendError(res);
    }

    const applicant = application.applicant;

    await notifyStatusUpdate(
      applicant,
      job.title,
      application.status,
      company.companyName
    ); // Call the function to send email

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
});

module.exports = { applyJob, getAppliedJobs, getApplicants, updateStatus };
