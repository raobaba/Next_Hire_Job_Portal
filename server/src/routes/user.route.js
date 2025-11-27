const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getUserSearchHistory,
  clearUserSearchHistory,
  getRecommendedJobs,
  getSearchResult,
  verifyEmail,
  readDocumentContent,
  changePassword,
  forgetPassword,
  resetPassword,
} = require("../controllers/user.controller.js");
const isAuthenticated = require("../middlewares/auth.js");

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/change-password").post(isAuthenticated, changePassword);
userRouter.route("/forget-password").post(forgetPassword);
userRouter.route("/reset-password/:token").post(resetPassword);
userRouter.route("/profile/update").post(isAuthenticated, updateProfile);
userRouter.route("/search-history").get(isAuthenticated, getUserSearchHistory);
userRouter
  .route("/search-history/clear")
  .delete(isAuthenticated, clearUserSearchHistory);
userRouter.route("/recommended-jobs").get(isAuthenticated, getRecommendedJobs);
userRouter.route("/search").get(isAuthenticated, getSearchResult);
userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/read-content").post(readDocumentContent);

module.exports = userRouter;
