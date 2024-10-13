const express = require("express");
const {
  getCompany,
  getCompanyById,
  getJobsByCompanyId,
  registerCompany,
  updateCompany,
} = require("../controllers/company.controller.js");
const isAuthenticated = require("../middlewares/auth.js");

const companyRouter = express.Router();

companyRouter.route("/register").post(isAuthenticated, registerCompany);
companyRouter.route("/get").get(isAuthenticated, getCompany);
companyRouter.route("/get/:id").get(isAuthenticated, getCompanyById);
companyRouter.route("/getJob/:id").get(isAuthenticated, getJobsByCompanyId);
companyRouter.route("/update/:id").put(isAuthenticated, updateCompany);

module.exports = companyRouter;
