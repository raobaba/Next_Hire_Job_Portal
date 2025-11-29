import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex flex-col flex-1 items-center justify-center text-center px-4 py-16 md:py-24 gap-6 min-h-[60vh]">
        <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wide">
          404 error
        </p>
        <h1 className="text-3xl md:text-5xl font-bold">
          We can’t find the page you’re looking for.
        </h1>
        <p className="max-w-xl text-base text-gray-600">
          The page might have been removed, renamed, or might never have
          existed. Double-check the URL or head back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Go to Homepage
          </Link>
          <Link
            to="/other-jobs"
            className="inline-flex items-center justify-center rounded-md border border-indigo-200 px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Explore Highlights
          </Link>
        </div>

        <section className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-lg p-6 text-left">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Need roles right now?</h2>
          <p className="text-sm text-gray-600 mb-4">
            Jump into our Browse Jobs hub to filter openings by role, company, and experience level.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Updated daily with curated opportunities from verified companies.
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
            >
              Browse Jobs
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;

