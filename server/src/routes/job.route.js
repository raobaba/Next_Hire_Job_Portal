const express = require("express");
const isAuthenticated = require("../middlewares/auth.js");
const {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} = require("../controllers/job.controller.js");

const jobRouter = express.Router();

jobRouter.route("/post").post(isAuthenticated, postJob);
jobRouter.route("/get").get(isAuthenticated, getAllJobs);
jobRouter.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
jobRouter.route("/get/:id").get(isAuthenticated, getJobById);

module.exports = jobRouter;
