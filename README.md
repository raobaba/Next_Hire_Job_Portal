
# Project Title
NextHire Job Portal

## Introduction

### User Management API
-Recruiter Functionality: Recruiters can register, create company profiles, and post job openings.
-Student Registration: Students can register to find jobs that match their skills and interests.
-Job Applications: Students can apply for jobs and track the status of their applications.
-Email Notifications: Users receive notifications via email for job matches, application status changes, and if hiring is halted.
-Advanced Job Filtering: Users can filter jobs based on salary, job type, and location.
-Profile-Based Recommendations: Students receive job recommendations tailored to their profiles and search queries.

## Project Type
Frontend & Backend 

## Deplolyed App
```bash
Frontend: https://user-data-manage-by-rajan.netlify.app/
Backend: https://nexthire.onrender.com/
Database: mongodb+srv://YOUR_USERNAME:YUOR_PASSWORD@cluster0.vvtoxbl.mongodb.net/JobPortal?retryWrites=true&w=majority
```

```
## Directory Structure
```bash
NextHire/
├─ server/
   ├─ src/
   │  ├─ config/
   │  │  └─ db.js
   │  ├─ models/
   │  │  └─ application.model.js
   │  │  └─ company.model.js
   │  │  └─ job.model.js
   │  │  └─ user.model.js
   │  ├─ controllers/
   │  │  └─ application.contorller.js
   │  │  └─ company.contorller.js
   │  │  └─ job.contorller.js
   │  │  └─ user.contorller.js
   │  ├─ routes/
   │  │  └─ application.route.js
   │  │  └─ company.route.js
   │  │  └─ job.route.js
   │  │  └─ user.route.js
   │  ├─ services/
   │  │  └─ openai.services.js
   │  ├─ utils/
   │  │  └─ errorHandler.js
   │  │  └─ sendEmail.route.js
   │  │  └─ sendToken.route.js
   │  ├─ app.js
   │  └─ index.js
├─ client/
  public
 └── assets
     ├── images
     ├── icons
     └── fonts
src
 ├── components
 │   ├── admin
 │   ├── auth
 │   │   ├── Login.jsx
 │   │   ├── Register.jsx
 │   ├── shared
 │   │   ├── Navbar.jsx
 │   │   ├── Footer.jsx
 │   │   └── Loader.jsx
 │   └── ui
 │       └── Modal.jsx
 ├── lib
 ├── redux
 │   ├── store.js
 │   └── slices
 │       ├── authSlice.js
 │       └── jobSlice.js
 ├── services
 │   ├── api.js
 │   └── jobService.js
 └── utils
     ├── constants.js
     └── helpers.js
App.css
App.jsx
index.css
main.jsx
.env.local
.gitignore
components.json
eslint.config.js
index.html
jsconfig.json
package-lock.json
package.json
postcss.config.js
README.md
tailwind.config.js
vite.config.js

```



## Video Walkthrough of the project
Attach a very short video walkthough of all of the features [ 1 - 3 minutes ]

## Video Walkthrough of the codebase
Attach a very short video walkthough of codebase [ 1 - 5 minutes ]

## Features
- NextHire is a job portal that allows users to register, apply for jobs, receive application updates, and access personalized job recommendations while enabling recruiters to post job opportunities.


## Design Decisions & Assumptions:

### React UI
- Use React.js for UI.
- Ensure responsiveness with CSS frameworks.
- Opt for minimalist UI.

### Node.js User Management API:
- Choose Node.js for backend.
- Utilize Express.js for API.
- Implement JWT for authentication.
- Use MongoDB for storage.
- Assume basic security measures.
- Prioritize scalability and performance.


## Installation & Getting started
Detailed instructions on how to install, configure, and get the project running. For BE/FS projects, guide the reviewer how to check mongodb schema etc.

```bash
git clone <complete_repository> 
For Backend:-
cd book_management
npm install 
cd my-project-backend
npm start

For Frontend:-
```bash
cd weather_app
npm install
npm start
```

## Usage
Provide instructions and examples on how to use your project.

```bash
# Example
```

## Credentials
Include screenshots as necessary.
```bash
# MongoURL
mongoURL= YOUR_MONGODB_URL_HERE

```

## APIs Used
If your application relies on external APIs, document them and include any necessary links or references.

## API Endpoints
### Nexthire:
- `POST /api/v1/user/register`: Register a new user.
- `POST /api/v1/user/login`: Login a user.
- `GET /api/v1/user/logout`: Logout a user.
- `PUT /api/v1/user/profile/update`: Update user profile.
- `GET /api/v1/user/search-history`: Get user's search history.
- `DELETE /api/v1/user/search-history/clear`: Clear user's search history.
- `GET /api/v1/user/recommended-jobs`: Get recommended jobs for the user.
- `GET /api/v1/user/search`: Get search results based on query.
- `POST /api/v1/user/verify-email`: Verify user email.
- `POST /api/v1/user/read-content`: Extract key information from a user's documents.

- `POST /api/v1/job/post`: Post a new job.
- `GET /api/v1/job/get`: Get all jobs.
- `GET /api/v1/job/getadminjobs`: Get admin jobs.
- `GET /api/v1/job/get/:id`: Get job by ID.
- `DELETE /api/v1/job/delete/:id`: Delete a job.
- `GET /api/v1/job/:id/similar`: Get similar jobs.

- `POST /api/v1/company/register`: Register a new company.
- `GET /api/v1/company/get`: Get all companies.
- `GET /api/v1/company/get/:id`: Get company by ID.
- `GET /api/v1/company/getJob/:id`: Get jobs by company ID.
- `PUT /api/v1/company/update/:id`: Update company information.

- `POST /api/v1/application/apply/:jobId`: Apply for a job by job ID.
- `GET /api/v1/application/get`: Get all applied jobs.
- `GET /api/v1/application/:jobId/applicants`: Get applicants for a specific job by job ID.
- `POST /api/v1/application/status/:applicationId/update`: Update the status of a job application by application ID.



## UI 

## Technology Stack
- Node.js
- Express.js
- MongoDB
- ReactJS
- Tailwind CSS
- Flowbite
