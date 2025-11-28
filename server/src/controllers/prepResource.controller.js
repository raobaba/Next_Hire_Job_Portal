const PrepResource = require("../models/prepResource.model");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

const ensureAdmin = (user) => user && user.role === "recruiter";

const buildPrepResourceQuery = (query = {}) => {
  const findQuery = {};

  if (query.category) {
    findQuery.category = { $regex: `^${query.category}$`, $options: "i" };
  }

  if (query.tags) {
    const tagsArray = Array.isArray(query.tags)
      ? query.tags
      : String(query.tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
    if (tagsArray.length) {
      findQuery.tags = { $all: tagsArray };
    }
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");
    findQuery.$or = [{ title: searchRegex }, { content: searchRegex }];
  }

  return findQuery;
};

const getPrepResources = asyncErrorHandler(async (req, res) => {
  const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" } = req.query;
  const findQuery = buildPrepResourceQuery(req.query);

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const limitNumber = Math.min(Math.max(parseInt(limit, 10), 1), 50);
  const skip = (pageNumber - 1) * limitNumber;
  const order = sortOrder === "asc" ? 1 : -1;

  const [resources, total] = await Promise.all([
    PrepResource.find(findQuery)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    PrepResource.countDocuments(findQuery),
  ]);

  res.status(200).json({
    success: true,
    status: 200,
    resources,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  });
});

const createPrepResource = asyncErrorHandler(async (req, res, next) => {
  if (!ensureAdmin(req.user)) {
    const error = new ErrorHandler("Only recruiters/admins can create resources", 403);
    return error.sendError(res);
  }

  const { title, category, content, url, tags } = req.body || {};

  if (!title || !category || (!content && !url)) {
    const error = new ErrorHandler(
      "Title, category and either content or url are required.",
      400
    );
    return error.sendError(res);
  }

  const normalizedTags = Array.isArray(tags)
    ? tags.map((tag) => String(tag || "").trim()).filter(Boolean)
    : typeof tags === "string"
    ? tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const resource = await PrepResource.create({
    title,
    category,
    content,
    url,
    tags: normalizedTags,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    status: 201,
    message: "Prep resource created successfully.",
    resource,
  });
});

const updatePrepResource = asyncErrorHandler(async (req, res, next) => {
  if (!ensureAdmin(req.user)) {
    const error = new ErrorHandler("Only recruiters/admins can update resources", 403);
    return error.sendError(res);
  }

  const { resourceId } = req.params;
  const { title, category, content, url, tags } = req.body || {};

  const resource = await PrepResource.findById(resourceId);
  if (!resource) {
    const error = new ErrorHandler("Prep resource not found", 404);
    return error.sendError(res);
  }

  if (title) resource.title = title;
  if (category) resource.category = category;
  if (typeof content !== "undefined") resource.content = content;
  if (typeof url !== "undefined") resource.url = url;
  if (typeof tags !== "undefined") {
    const normalizedTags = Array.isArray(tags)
      ? tags.map((tag) => String(tag || "").trim()).filter(Boolean)
      : typeof tags === "string"
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];
    resource.tags = normalizedTags;
  }
  resource.updatedBy = req.user._id;

  await resource.save();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Prep resource updated successfully.",
    resource,
  });
});

const deletePrepResource = asyncErrorHandler(async (req, res, next) => {
  if (!ensureAdmin(req.user)) {
    const error = new ErrorHandler("Only recruiters/admins can delete resources", 403);
    return error.sendError(res);
  }

  const { resourceId } = req.params;
  const resource = await PrepResource.findById(resourceId);

  if (!resource) {
    const error = new ErrorHandler("Prep resource not found", 404);
    return error.sendError(res);
  }

  await resource.deleteOne();

  res.status(200).json({
    success: true,
    status: 200,
    message: "Prep resource deleted successfully.",
  });
});

module.exports = {
  getPrepResources,
  createPrepResource,
  updatePrepResource,
  deletePrepResource,
};

