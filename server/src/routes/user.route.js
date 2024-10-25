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
  readResumeContent
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
 *         fullname:
 *           type: string
 *           description: Full name of the user
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the user
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
 *         profile:
 *           type: object
 *           properties:
 *             profilePhoto:
 *               type: object
 *               properties:
 *                 public_id:
 *                   type: string
 *                   description: Public ID for the profile photo
 *                 url:
 *                   type: string
 *                   description: URL of the profile photo
 *             bio:
 *               type: string
 *               description: Bio of the user
 *             skills:
 *               type: array
 *               items:
 *                 type: string
 *               description: List of skills of the user
 *             resume:
 *               type: object
 *               properties:
 *                 public_id:
 *                   type: string
 *                   description: Public ID for the resume
 *                 url:
 *                   type: string
 *                   description: URL of the resume
 *                 resumeOriginalName:
 *                   type: string
 *                   description: Original name of the resume file
 *         isVerified:
 *           type: boolean
 *           description: Indicates whether the user's email is verified
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
 *         - fullname
 *         - phoneNumber
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [student, recruiter, admin]
 *                 description: Role of the user in the system
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
 *       500:
 *         description: Internal server error
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
 *                 format: email
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *               role:
 *                 type: string
 *                 enum: [student, recruiter, admin]
 *                 description: Role of the user in the system
 *             required:
 *               - email
 *               - password
 *               - role
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Please enter email and password
 *       401:
 *         description: Incorrect password or account role mismatch
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.route("/login").post(loginUser);

/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Internal server error
 */
userRouter.route("/logout").post(isAuthenticated, logoutUser);

/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the user
 *               bio:
 *                 type: string
 *                 description: Bio of the user
 *               skills:
 *                 type: string
 *                 description: Comma-separated list of skills
 *             required:
 *               - fullname
 *               - email
 *               - phoneNumber
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.route("/profile").put(isAuthenticated, updateProfile);

/**
 * @swagger
 * /api/v1/user/search-history:
 *   get:
 *     summary: Get user's search history
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved search history
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.route("/search-history").get(isAuthenticated, getUserSearchHistory);

/**
 * @swagger
 * /api/v1/user/search-history/clear:
 *   delete:
 *     summary: Clear user's search history
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Search history cleared successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.route("/search-history/clear").delete(isAuthenticated, clearUserSearchHistory);

/**
 * @swagger
 * /api/v1/user/recommended-jobs:
 *   get:
 *     summary: Get recommended jobs for the user
 *     tags: [User]
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Filter by job title
 *         required: false
 *         schema:
 *           type: string
 *       - name: salaryMin
 *         in: query
 *         description: Minimum salary filter
 *         required: false
 *         schema:
 *           type: integer
 *       - name: salaryMax
 *         in: query
 *         description: Maximum salary filter
 *         required: false
 *         schema:
 *           type: integer
 *       - name: experienceLevel
 *         in: query
 *         description: Filter by experience level
 *         required: false
 *         schema:
 *           type: integer
 *       - name: location
 *         in: query
 *         description: Filter by job location
 *         required: false
 *         schema:
 *           type: string
 *       - name: jobType
 *         in: query
 *         description: Filter by job type
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortBy
 *         in: query
 *         description: Sort jobs by a specific field
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Order of sorting (asc or desc)
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved recommended jobs
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.route("/recommended-jobs").get(isAuthenticated, getRecommendedJobs);

/**
 * @swagger
 * /api/v1/user/search:
 *   get:
 *     summary: Get search results based on query
 *     tags: [User]
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search query
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of results per page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *       404:
 *         description: No results found
 *       500:
 *         description: Internal server error
 */
userRouter.route("/search").get(getSearchResult);

/**
 * @swagger
 * /api/v1/user/verify-email:
 *   post:
 *     summary: Verify user email
 *     tags: [User]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         description: Email verification token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/read-content").post(isAuthenticated, readResumeContent)

module.exports = userRouter;
