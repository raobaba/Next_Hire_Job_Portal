const express = require("express");
const {
  getHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
} = require("../controllers/highlight.controller");
const isAuthenticated = require("../middlewares/auth");

const highlightRouter = express.Router();

// Public endpoint for landing page
highlightRouter.route("/").get(getHighlights);

// Admin / recruiter-only management
highlightRouter.route("/").post(isAuthenticated, createHighlight);

highlightRouter
  .route("/:highlightId")
  .put(isAuthenticated, updateHighlight)
  .delete(isAuthenticated, deleteHighlight);

module.exports = highlightRouter;


