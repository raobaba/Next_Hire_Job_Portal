const express = require("express");
const isAuthenticated = require("../middlewares/auth.js");
const {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  deleteAdminJobs,
  getSimilarJobs,
  updateJob,
  getJobFilters,
  getJobsForCarousel,
} = require("../controllers/job.controller.js");

const jobRouter = express.Router();

jobRouter.route("/post").post(isAuthenticated, postJob);
jobRouter.route("/get").get(isAuthenticated, getAllJobs);
jobRouter.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
jobRouter.route("/get/:id").get(isAuthenticated, getJobById);
jobRouter.route("/update/:id").put(isAuthenticated, updateJob);
jobRouter.route("/delete/:id").delete(isAuthenticated, deleteAdminJobs);
jobRouter.route("/:id/similar").get(getSimilarJobs);
jobRouter.route("/filters").get(getJobFilters);
jobRouter.route("/carousel").get(getJobsForCarousel);
/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *         salary:
 *           type: number
 *         location:
 *           type: string
 *         jobType:
 *           type: string
 *         experienceLevel:
 *           type: number
 *         position:
 *           type: string
 *         companyId:
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - requirements
 *         - salary
 *         - location
 *         - jobType
 *         - experienceLevel
 *         - position
 *         - companyId
 */

/**
 * @swagger
 * tags:
 *   name: Job
 *   description: Job management operations
 */

/**
 * @swagger
 * /api/v1/job/post:
 *   post:
 *     summary: Create a new job
 *     tags: [Job]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: New job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: All fields are required
 *       404:
 *         description: Company not found
 *       403:
 *         description: Unauthorized to post jobs for this company
 */

/**
 * @swagger
 * /api/v1/job/get:
 *   get:
 *     summary: Get all jobs
 *     tags: [Job]
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Job title to search for
 *         required: false
 *         schema:
 *           type: string
 *       - name: salary
 *         in: query
 *         description: Salary filter
 *         required: false
 *         schema:
 *           type: string
 *       - name: experienceLevel
 *         in: query
 *         description: Experience level filter
 *         required: false
 *         schema:
 *           type: number
 *       - name: location
 *         in: query
 *         description: Job location to filter
 *         required: false
 *         schema:
 *           type: string
 *       - name: jobType
 *         in: query
 *         description: Type of job
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         required: false
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         description: Sort order (asc or desc)
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         description: Number of jobs per page
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 currentPage:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalJobs:
 *                   type: number
 *                 limit:
 *                   type: number
 *       404:
 *         description: Jobs Not Found
 */

/**
 * @swagger
 * /api/v1/job/carousel:
 *   get:
 *     summary: Get unique jobs for carousel (one per title)
 *     tags: [Job]
 *     description: Returns the most recent job for each unique job title, useful for featured or carousel views.
 *     responses:
 *       200:
 *         description: Unique title jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Unique title jobs retrieved successfully.
 *       500:
 *         description: Internal server error while fetching jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error while fetching jobs.
 */

/**
 * @swagger
 * /api/v1/job/filters:
 *   get:
 *     summary: Get job filter options (location, job type, salary ranges)
 *     tags: [Job]
 *     responses:
 *       200:
 *         description: List of filter options for jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filterData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filterType:
 *                         type: string
 *                         example: Location
 *                       array:
 *                         type: array
 *                         items:
 *                           type: string
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/get/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Job]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job Not Found
 */

/**
 * @swagger
 * /api/v1/job/getadminjobs:
 *   get:
 *     summary: Get jobs posted by admin
 *     tags: [Job]
 *     responses:
 *       200:
 *         description: List of admin jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       404:
 *         description: Jobs Not Found
 */
/**
 * @swagger
 * /api/v1/job/update/{id}:
 *   put:
 *     summary: Update an existing job
 *     tags: [Job]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the job to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       403:
 *         description: Unauthorized to update this job
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/delete/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Job]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/job/{id}/similar:
 *   get:
 *     summary: Get similar jobs
 *     tags: [Job]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Number of similar jobs to return
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of similar jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 totalJobs:
 *                   type: number
 *       404:
 *         description: No similar jobs found
 *       500:
 *         description: Internal server error
 */

module.exports = jobRouter;
