const express = require("express");
const isAuthenticated = require("../middlewares/auth.js");
const {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} = require("../controllers/application.controller.js");

const applicationRouter = express.Router();

applicationRouter.route("/apply/:jobId").post(isAuthenticated, applyJob);
applicationRouter.route("/get").get(isAuthenticated, getAppliedJobs);
applicationRouter.route("/:jobId/applicants").get(isAuthenticated, getApplicants);
applicationRouter
  .route("/status/:applicationId/update")
  .post(isAuthenticated, updateStatus);

/**
* @swagger
* components:
*   schemas:
*     Application:
*       type: object
*       properties:
*         job:
*           type: string
*           description: ID of the job the application is for.
*         applicant:
*           type: string
*           description: ID of the applicant.
*         status:
*           type: string
*           enum: [applied, interview, offered, rejected]
*           description: Current status of the application.
*         createdAt:
*           type: string
*           format: date-time
*           description: Timestamp when the application was created.
*       required:
*         - job
*         - applicant
*
*     Job:
*       type: object
*       properties:
*         title:
*           type: string
*         company:
*           type: string
*         description:
*           type: string
*         location:
*           type: string
*         salary:
*           type: number
*       required:
*         - title
*         - company
*         - description
*         - location
*         - salary
*
*     Applicant:
*       type: object
*       properties:
*         id:
*           type: string
*         name:
*           type: string
*         email:
*           type: string
*       required:
*         - id
*         - name
*         - email
*/

/**
 * @swagger
 * tags:
 *   name: Application
 *   description: Job application management operations
 */

/**
 * @swagger
 * /api/v1/application/apply/{jobId}:
 *   post:
 *     summary: Apply for a job
 *     tags: [Application]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID of the job to apply for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicantId:
 *                 type: string
 *                 description: The ID of the applicant.
 *             required:
 *               - applicantId
 *     responses:
 *       201:
 *         description: Job applied successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job applied successfully."
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/application/get:
 *   get:
 *     summary: Get applied jobs
 *     tags: [Application]
 *     responses:
 *       200:
 *         description: List of applied jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *       404:
 *         description: No applications found
 */

/**
 * @swagger
 * /api/v1/application/{jobId}/applicants:
 *   get:
 *     summary: Get applicants for a job
 *     tags: [Application]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID of the job to get applicants for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of applicants for the job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applicants:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Applicant'
 *       404:
 *         description: Job not found or no applicants found
 */

/**
 * @swagger
 * /api/v1/application/status/{applicationId}/update:
 *   post:
 *     summary: Update application status
 *     tags: [Application]
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         description: ID of the application to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [applied, interview, offered, rejected]
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Status updated successfully."
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Application not found
 */


module.exports = applicationRouter;
