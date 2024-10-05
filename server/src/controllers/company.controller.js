const Company = require("../models/company.model");
const asyncErrorHandler = require("./../middlewares/asyncErrorHandler");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorHandler");

// Register Company
const registerCompany = asyncErrorHandler(async (req, res, next) => {
  const { companyName } = req.body;

  // Check if the user is a Recruiter
  if (req.user.role !== "recruiter") {
    const error = new ErrorHandler(
      "Only Recruiters are allowed to register a company. Please update your account role to Recruiter to proceed.",
      403
    ); // 403: Forbidden
    return error.sendError(res);
  }

  if (!companyName) {
    const error = new ErrorHandler("Company name is required", 400);
    return error.sendError(res);
  }

  let company = await Company.findOne({ companyName });
  if (company) {
    const error = new ErrorHandler(
      "A company with this name already exists",
      400
    );
    return error.sendError(res);
  }

  company = await Company.create({
    companyName,
    userId: req.user.id, // Assuming req.user.id contains the logged-in user ID
  });

  return res.status(201).json({
    message: "Company registered successfully.",
    company,
    success: true,
    status:200
  });
});

// Get Companies by User ID
const getCompany = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user.id; // Logged-in user ID
  const companies = await Company.find({ userId });

  if (!companies.length) {
    const error = new ErrorHandler("No companies found for this user", 404);
    return error.sendError(res);
  }

  return res.status(200).json({
    companies,
    success: true,
    status:200
  });
});

// Get Company by ID
const getCompanyById = asyncErrorHandler(async (req, res, next) => {
  const companyId = req.params.id;
  const company = await Company.findById(companyId);

  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({
    company,
    success: true,
    status:200
  });
});

// Update Company
const updateCompany = asyncErrorHandler(async (req, res, next) => {
  const { companyName, description, website, location } = req.body;

  // Prepare the update data
  const updateData = {
    companyName,
    description,
    website,
    location,
  };

  // Check if a new logo file is uploaded
  if (req.files && req.files.logo && req.files.logo.tempFilePath) {
    const myCloud = await cloudinary.uploader.upload(
      req.files.logo.tempFilePath,
      {
        folder: "logos",
        width: 150,
        crop: "scale",
      }
    );

    updateData.logo = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
    new: true, // Return the updated company
  });

  if (!company) {
    const error = new ErrorHandler("Company not found", 404);
    return error.sendError(res);
  }

  return res.status(200).json({
    message: "Company information updated successfully.",
    company,
    success: true,
    status:200
  });
});

module.exports = { registerCompany, getCompany, getCompanyById, updateCompany };
