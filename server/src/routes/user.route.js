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
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         name:
 *           type: string
 *           description: Name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password for the user account
 *           minLength: 6
 *         role:
 *           type: string
 *           enum: [student, recruiter, admin]
 *           description: Role of the user in the system
 *         profileCompleted:
 *           type: boolean
 *           description: Indicates whether the user's profile is complete
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last update to the user information
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management operations
 */
/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - fullname
 *               - phoneNumber
 *               - email
 *               - password
 *               - role
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: All fields are required or user already exists
 */
userRouter.route("/register").post(registerUser);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Please enter email and password
 *       404:
 *         description: User does not exist or account doesn't exist with current role
 *       401:
 *         description: Incorrect Password
 */
userRouter.route("/login").post(loginUser);

/**
 * @swagger
 * /api/v1/user/logout:
 *   get:
 *     summary: Logout the user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
userRouter.route("/logout").get(logoutUser);

/**
 * @swagger
 * /api/v1/user/profile/update:
 *   post:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               bio:
 *                 type: string
 *               skills:
 *                 type: string
 *             required: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */
userRouter.route("/profile/update").post(isAuthenticated, updateProfile);

/**
 * @swagger
 * /api/v1/user/search-history:
 *   get:
 *     summary: Get user search history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search history retrieved successfully
 *       404:
 *         description: User not found
 */
userRouter.route("/search-history").get(isAuthenticated, getUserSearchHistory);

/**
 * @swagger
 * /api/v1/user/search-history:
 *   delete:
 *     summary: Clear user search history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search history cleared successfully
 */
userRouter.route("/search-history").delete(isAuthenticated, clearUserSearchHistory);

/**
 * @swagger
 * /api/v1/user/recommended-jobs:
 *   get:
 *     summary: Get recommended jobs for the user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: number
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Recommended jobs retrieved successfully
 *       404:
 *         description: User not found
 */
userRouter.route("/recommended-jobs").get(isAuthenticated, getRecommendedJobs);

/**
 * @swagger
 * /api/v1/user/search-result:
 *   get:
 *     summary: Get search results based on user's search history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       404:
 *         description: User not found
 */
userRouter.route("/search-result").get(isAuthenticated, getSearchResult);

/**
 * @swagger
 * /api/v1/user/verify-email:
 *   get:
 *     summary: Verify user email
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 */
userRouter.route("/verify-email").get(verifyEmail);

module.exports = userRouter;
