import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Jobs from "./components/Jobs";
import JobDescription from "./components/JobDescription";
import CompanyDashboard from "./components/CompanyDashboard";
import BrowseJobs from "./components/BrowseJobs";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJob";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ResetPassword from "./components/auth/ResetPassword";
import EmailVarification from "./components/EmailVarification";
import OtherJobs from "./components/OtherJobs";
import Settings from "./components/Settings";

// Router setup
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forget-password",
    element: <ResetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/company-dashboard/:id",
    element: <CompanyDashboard />,
  },
  {
    path: "/verify-email",
    element: <EmailVarification />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/browse-jobs",
    element: (
      <ProtectedRoute>
        <BrowseJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/other-jobs",
    element: <OtherJobs />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/admin/jobs/:id",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
]);

// Main App component
function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
