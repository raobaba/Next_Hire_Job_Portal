const express = require("express");
const {
  getPrepResources,
  createPrepResource,
  updatePrepResource,
  deletePrepResource,
} = require("../controllers/prepResource.controller");
const isAuthenticated = require("../middlewares/auth");

const prepResourceRouter = express.Router();

prepResourceRouter.route("/").get(getPrepResources);
prepResourceRouter.route("/").post(isAuthenticated, createPrepResource);
prepResourceRouter
  .route("/:resourceId")
  .put(isAuthenticated, updatePrepResource)
  .delete(isAuthenticated, deletePrepResource);

module.exports = prepResourceRouter;

