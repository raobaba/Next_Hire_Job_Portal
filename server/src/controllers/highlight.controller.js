const Highlight = require("../models/highlight.model");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

const ensureAdmin = (user) => user && user.role === "recruiter";

// Public: fetch active highlights for landing page
const getHighlights = asyncErrorHandler(async (req, res) => {
  const { type } = req.query;

  const query = { isActive: true };
  if (type) {
    query.type = type;
  }

  const highlights = await Highlight.find(query)
    .populate({ path: "company", select: "companyName location logo badges" })
    .populate({ path: "job", select: "title company location" })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    status: 200,
    highlights,
  });
});

// Admin / recruiter: create highlight
const createHighlight = asyncErrorHandler(async (req, res, next) => {
  if (!ensureAdmin(req.user)) {
    const error = new ErrorHandler("Only recruiters/admins can create highlights", 403);
    return error.sendError(res);
  }

  const {
    type,
    title,
    subtitle,
    description,
    companyId,
    jobId,
    imageUrl,
    order,
    isActive,
  } = req.body || {};

  if (!title) {
    const error = new ErrorHandler("Title is required", 400);
    return error.sendError(res);
  }

  const payload = {
    type: type || "company",
    title: String(title).trim(),
    subtitle: subtitle ? String(subtitle) : "",
    description: description ? String(description) : "",
    company: companyId || undefined,
    job: jobId || undefined,
    imageUrl: imageUrl ? String(imageUrl) : "",
    isActive: typeof isActive === "boolean" ? isActive : true,
    order: typeof order === "number" ? order : 0,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  };

  const highlight = await Highlight.create(payload);

  res.status(201).json({
    success: true,
    status: 201,
    message: "Highlight created successfully.",
    highlight,
  });
});

// Admin / recruiter: update highlight
const updateHighlight = asyncErrorHandler(async (req, res, next) => {
  if (!ensureAdmin(req.user)) {
    const error = new ErrorHandler("Only recruiters/admins can update highlights", 403);
    return error.sendError(res);
  }

  const { highlightId } = req.params;
  const {
    type,
    title,
    subtitle,
    description,
    companyId,
    jobId,
    imageUrl,
    order,
    isActive,
  } = req.body || {};

  const highlight = await Highlight.findById(highlightId);
  if (!highlight) {
    const error = new ErrorHandler("Highlight not found", 404);
    return error.sendError(res);
  }

  if (typeof type !== "undefined") highlight.type = type;
  if (typeof title !== "undefined") highlight.title = String(title).trim();
  if (typeof subtitle !== "undefined") {
    highlight.subtitle = subtitle ? String(subtitle) : "";
  }
  if (typeof description !== "undefined") {
    highlight.description = description ? String(description) : "";
  }
  if (typeof companyId !== "undefined") highlight.company = companyId || undefined;
  if (typeof jobId !== "undefined") highlight.job = jobId || undefined;
  if (typeof imageUrl !== "undefined") {
    highlight.imageUrl = imageUrl ? String(imageUrl) : "";
  }
  if (typeof order !== "undefined") {
    highlight.order = typeof order === "number" ? order : 0;
  }
  if (typeof isActive !== "undefined") highlight.isActive = Boolean(isActive);
  highlight.updatedBy = req.user._id;

  await highlight.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Highlight updated successfully.",
    highlight,
  });
});

// Admin / recruiter: delete highlight
const deleteHighlight = asyncErrorHandler(async (req, res, next) => {
  if (!ensureAdmin(req.user)) {
    const error = new ErrorHandler("Only recruiters/admins can delete highlights", 403);
    return error.sendError(res);
  }

  const { highlightId } = req.params;
  const highlight = await Highlight.findById(highlightId);
  if (!highlight) {
    const error = new ErrorHandler("Highlight not found", 404);
    return error.sendError(res);
  }

  await highlight.deleteOne();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Highlight deleted successfully.",
  });
});

module.exports = {
  getHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
};


