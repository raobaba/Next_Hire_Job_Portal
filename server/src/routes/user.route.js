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
  verifyEmail
} = require("../controllers/user.controller.js");
const isAuthenticated = require("../middlewares/auth.js");

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/profile/update").post(isAuthenticated, updateProfile);
userRouter.route("/search-history").get(isAuthenticated, getUserSearchHistory);
userRouter.route("/search-history").delete(isAuthenticated, clearUserSearchHistory);
userRouter.route("/recommended-jobs").get(isAuthenticated, getRecommendedJobs);
userRouter.route("/search-result").get(isAuthenticated, getSearchResult)
userRouter.route("/verify-email").get(verifyEmail);
module.exports = userRouter;
