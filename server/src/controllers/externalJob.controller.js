const axios = require("axios");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

const getExternalJobs = asyncErrorHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const baseUrl =
    process.env.ARBEITNOW_API_URL || "https://arbeitnow.com/api/job-board-api";

  try {
    const { data } = await axios.get(`${baseUrl}?page=${page}`, {
      timeout: 10000,
      headers: {
        Accept: "application/json",
      },
    });

    return res.status(200).json({
      success: true,
      status: 200,
      jobs: data?.data || [],
      links: data?.links || {},
      meta: data?.meta || {},
    });
  } catch (error) {
    console.error("Error fetching external jobs:", error.message);
    return next(new ErrorHandler("Unable to load external jobs at this time.", 502));
  }
});

module.exports = { getExternalJobs };

