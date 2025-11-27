/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Company management operations - Optimized with database indexes and lean queries
 */

/**
 * @swagger
 * /api/v1/company/register:
 *   post:
 *     summary: Register a new company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new company profile. Only recruiters can register companies. Optimized with lean queries.
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
 *                   example: Company registered successfully
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
 *     summary: Get companies registered by the authenticated user
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     description: Returns all companies registered by the authenticated user. Optimized with lean queries.
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
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
 *     security:
 *       - bearerAuth: []
 *     description: Returns a single company by its ID. Optimized with lean queries and parallel data fetching.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
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
 *     security:
 *       - bearerAuth: []
 *     description: Returns all jobs posted by a specific company. Optimized with lean queries and parallel data fetching.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs for the company retrieved successfully
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
 *     security:
 *       - bearerAuth: []
 *     description: Updates company information including logo. Only the company owner can update. Optimized with lean queries.
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
 *                 description: Name of the company
 *               description:
 *                 type: string
 *                 description: Company description
 *               website:
 *                 type: string
 *                 format: uri
 *                 description: Company website URL
 *               location:
 *                 type: string
 *                 description: Company location
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image file
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
 *                   example: Company updated successfully
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found
 */

