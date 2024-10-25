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

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         companyName:
 *           type: string
 *         description:
 *           type: string
 *         website:
 *           type: string
 *         location:
 *           type: string
 *         logo:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *             url:
 *               type: string
 *         userId:
 *           type: string
 *       required:
 *         - companyName
 *         - userId
 *
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
 *   name: Company
 *   description: Company management operations
 */

/**
 * @swagger
 * /api/v1/company/register:
 *   post:
 *     summary: Register a new company
 *     tags: [Company]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       201:
 *         description: Company registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Company name is required or already exists
 *       403:
 *         description: Only Recruiters are allowed to register a company
 */

/**
 * @swagger
 * /api/v1/company/get:
 *   get:
 *     summary: Get companies registered by the user
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       404:
 *         description: No companies found for this user
 */

/**
 * @swagger
 * /api/v1/company/get/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Company]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /api/v1/company/getJob/{id}:
 *   get:
 *     summary: Get jobs posted by a company ID
 *     tags: [Company]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs for the company
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
 *         description: Company not found or no jobs found for this company
 */

/**
 * @swagger
 * /api/v1/company/update/{id}:
 *   put:
 *     summary: Update company information
 *     tags: [Company]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               location:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */

module.exports = companyRouter;
