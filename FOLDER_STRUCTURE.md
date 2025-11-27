# NextHire Job Portal - Professional Folder Structure

## Client Structure (`client/src/`)

### Components Organization

```
components/
├── features/              # Feature-based components
│   ├── jobs/             # All job-related components
│   │   ├── AppliedJobTable.jsx
│   │   ├── BrowseJobs.jsx
│   │   ├── FilterCard.jsx
│   │   ├── Job.jsx
│   │   ├── JobDescription.jsx
│   │   ├── Jobs.jsx
│   │   └── OtherJobs.jsx
│   ├── companies/        # Company-related components
│   │   └── CompanyDashboard.jsx
│   ├── home/            # Home page components
│   │   ├── CategoryCarousel.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── HeroSection.jsx
│   │   ├── Home.jsx
│   │   ├── LatestJobCards.jsx
│   │   └── LatestJobs.jsx
│   └── profile/         # User profile components
│       ├── Privacy.jsx
│       ├── Profile.jsx
│       ├── Settings.jsx
│       └── UpdateProfileDialog.jsx
├── auth/                 # Authentication components
│   ├── EmailVarification.jsx
│   ├── Login.jsx
│   ├── ResetPassword.jsx
│   └── Signup.jsx
├── admin/                # Admin panel components
│   ├── AdminJob.jsx
│   ├── AdminJobsTable.jsx
│   ├── Applicants.jsx
│   ├── ApplicantsTable.jsx
│   ├── Companies.jsx
│   ├── CompaniesTable.jsx
│   ├── CompanyCreate.jsx
│   ├── CompanySetup.jsx
│   ├── PostJob.jsx
│   └── ProtectedRoute.jsx
├── layout/               # Layout components (Navbar, Footer)
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   └── RegiserNavbar.jsx
├── common/               # Common reusable components
│   ├── Loader.jsx
│   └── ReactHelmet.jsx
└── ui/                   # UI component library (shadcn/ui)
    ├── avatar.jsx
    ├── badge.jsx
    ├── button.jsx
    ├── carousel.jsx
    ├── checkbox.jsx
    ├── dialog.jsx
    ├── input.jsx
    ├── label.jsx
    ├── popover.jsx
    ├── radio-group.jsx
    ├── select.jsx
    ├── skeleton.jsx
    └── table.jsx
```

## Server Structure (`server/src/`)

```
src/
├── config/               # Configuration files
│   └── db.js
├── controllers/          # Request handlers
│   ├── application.controller.js
│   ├── company.controller.js
│   ├── job.controller.js
│   └── user.controller.js
├── middlewares/          # Express middlewares
│   ├── asyncErrorHandler.js
│   └── auth.js
├── models/              # Database models
│   ├── application.model.js
│   ├── company.model.js
│   ├── job.model.js
│   └── user.model.js
├── routes/              # API routes
│   ├── application.route.js
│   ├── company.route.js
│   ├── job.route.js
│   └── user.route.js
├── services/            # Business logic services
│   └── openai.service.js
├── swagger/             # API documentation
│   ├── application.swagger.js
│   ├── company.swagger.js
│   ├── job.swagger.js
│   ├── schemas.swagger.js
│   └── user.swagger.js
├── utils/               # Utility functions
│   ├── errorHandler.js
│   ├── sendEmail.js
│   └── sendToken.js
├── scripts/             # Utility scripts
│   ├── README.md
│   └── seedJobs.js
├── app.js               # Express app configuration
└── server.js            # Server entry point
```

## Benefits of This Structure

1. **Feature-Based Organization**: Components are grouped by feature (jobs, companies, home, profile) making it easier to find and maintain related code.

2. **Clear Separation**: 
   - `layout/` for layout components (Navbar, Footer)
   - `common/` for reusable utilities (Loader, ReactHelmet)
   - `ui/` for UI component library
   - `features/` for business logic components

3. **Scalability**: Easy to add new features by creating new folders in `features/`

4. **Maintainability**: Related components are grouped together, reducing cognitive load when working on features

5. **Professional Standards**: Follows industry best practices for React/Node.js applications

## Import Path Examples

### From features to layout/common:
```javascript
import Navbar from "../../layout/Navbar";
import Loader from "../../common/Loader";
```

### From features to ui:
```javascript
import { Button } from "../../ui/button";
```

### From admin/auth to layout/common:
```javascript
import Navbar from "../layout/Navbar";
import Loader from "../common/Loader";
```

### Using path aliases (@/):
```javascript
import { getAllJobs } from "@/redux/slices/job.slice";
import ReactHelmet from "@/components/common/ReactHelmet";
```

