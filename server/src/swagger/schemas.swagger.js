/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the job
 *         title:
 *           type: string
 *           description: Job title
 *         description:
 *           type: string
 *           description: Job description
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           description: List of job requirements
 *         salary:
 *           type: number
 *           description: Job salary
 *         location:
 *           type: string
 *           description: Job location
 *         jobType:
 *           type: string
 *           enum: [full-time, part-time, contract, internship]
 *           description: Type of job
 *         experienceLevel:
 *           type: number
 *           description: Required experience level (0-5)
 *         position:
 *           type: string
 *           description: Job position
 *         company:
 *           type: string
 *           description: Company ID
 *         companyId:
 *           type: string
 *           description: Company ID (alternative field)
 *         created_by:
 *           type: string
 *           description: User ID who created the job
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Job creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Job last update timestamp
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
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
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
 *         verificationToken:
 *           type: string
 *           description: Email verification token
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
 *
 *     Company:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the company
 *         companyName:
 *           type: string
 *           description: Name of the company
 *         description:
 *           type: string
 *           description: Company description
 *         website:
 *           type: string
 *           format: uri
 *           description: Company website URL
 *         location:
 *           type: string
 *           description: Company location
 *         logo:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               description: Public ID for the company logo
 *             url:
 *               type: string
 *               description: URL of the company logo
 *         userId:
 *           type: string
 *           description: User ID who owns the company
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Company creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Company last update timestamp
 *       required:
 *         - companyName
 *         - userId
 *
 *     Application:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the application
 *         job:
 *           type: string
 *           description: ID of the job the application is for
 *         applicant:
 *           type: string
 *           description: ID of the applicant
 *         status:
 *           type: string
 *           enum: [applied, interview, offered, rejected]
 *           description: Current status of the application
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the application was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the application was last updated
 *       required:
 *         - job
 *         - applicant
 *
 *     Applicant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the applicant
 *         fullname:
 *           type: string
 *           description: Full name of the applicant
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the applicant
 *         profile:
 *           type: object
 *           description: Profile information of the applicant
 *       required:
 *         - _id
 *         - fullname
 *         - email
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         status:
 *           type: number
 *           example: 400
 *         message:
 *           type: string
 *           example: Error message
 */

