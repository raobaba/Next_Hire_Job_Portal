const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getUserSearchHistory,
  clearUserSearchHistory,
} = require("../controllers/user.controller.js");
const isAuthenticated = require("../middlewares/auth.js");

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(logoutUser);
userRouter.route("/profile/update").post(isAuthenticated, updateProfile);
userRouter.get("/search-history", isAuthenticated, getUserSearchHistory);
userRouter.delete("/search-history", isAuthenticated, clearUserSearchHistory);

module.exports = userRouter;
