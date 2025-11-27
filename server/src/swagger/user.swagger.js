/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management operations - Optimized with database indexes and lean queries
 */

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     description: Creates a new user account. Email verification is required after registration.
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
 *                 description: Password for the user account (minimum 6 characters)
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
 *         description: User registered successfully. Verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: All fields are required or user already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     description: Authenticates a user and returns a JWT token. Email verification is required - login will be rejected if email is not verified. A verification email will be sent automatically if the email is not verified.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Please enter email and password
 *       401:
 *         description: Incorrect password or account role mismatch
 *       403:
 *         description: Email not verified. A verification email has been sent to the user's email address.
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [User]
 *     description: Logs out the current user by clearing the authentication token.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Allows authenticated users to change their password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password of the user
 *               newPassword:
 *                 type: string
 *                 description: New password for the user (minimum 6 characters)
 *                 minLength: 6
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Bad request, current or new password not provided
 *       401:
 *         description: Unauthorized, current password is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/forget-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [User]
 *     description: Sends a password reset email to the user's registered email address.
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
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found with this email
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/reset-password/{token}:
 *   post:
 *     summary: Reset user's password using token
 *     tags: [User]
 *     description: Resets the user's password using a token received via email.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token sent via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password to be set (minimum 6 characters)
 *                 minLength: 6
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/profile/update:
 *   post:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Updates the authenticated user's profile information including photo and resume.
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
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile avatar image file
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume PDF file
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/search-history:
 *   get:
 *     summary: Get user's search history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns the authenticated user's search history. Optimized with indexed queries.
 *     responses:
 *       200:
 *         description: Successfully retrieved search history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 searchHistory:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Software Engineer", "React Developer", "Node.js"]
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/search-history/clear:
 *   delete:
 *     summary: Clear user's search history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Clears all search history for the authenticated user.
 *     responses:
 *       200:
 *         description: Search history cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Search history cleared successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/recommended-jobs:
 *   get:
 *     summary: Get recommended jobs for the user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Returns personalized job recommendations based on user's skills and search history. Optimized with parallel queries and batch processing.
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
 *         description: Filter by experience level (0-5)
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
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Successfully retrieved recommended jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/search:
 *   get:
 *     summary: Get search results based on query
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Performs a search across jobs based on the query string. Search history is updated automatically. Optimized with indexed queries and aggregation pipeline.
 *     parameters:
 *       - name: query
 *         in: query
 *         description: Search query string
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of results per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *                 currentPage:
 *                   type: number
 *                   example: 1
 *                 totalPages:
 *                   type: number
 *                   example: 5
 *                 totalJobs:
 *                   type: number
 *                   example: 50
 *       404:
 *         description: No results found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/verify-email:
 *   post:
 *     summary: Verify user email
 *     tags: [User]
 *     description: Verifies the user's email address using a token sent via email. Verification emails are automatically sent when a user attempts to login with an unverified email.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/read-content:
 *   post:
 *     summary: Extract key information from a user's documents
 *     tags: [User]
 *     description: Extracts text content from uploaded PDF documents using OpenAI service.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: PDF file of the user's document
 *     responses:
 *       200:
 *         description: Successfully extracted content from the document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful
 *                 status:
 *                   type: integer
 *                   description: HTTP status code
 *                 extractedContent:
 *                   type: string
 *                   description: Text content extracted from the document
 *       400:
 *         description: No document file was uploaded
 *       500:
 *         description: Internal server error
 */

