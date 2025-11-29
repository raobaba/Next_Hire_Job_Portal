import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { FaBook, FaMagic, FaUserTie, FaCheckCircle } from "react-icons/fa";

const guideBlocks = [
  {
    title: "Interview Readiness",
    description:
      "Structured prep checklists, behavioral prompts, and whiteboard drills to help you walk into interviews with confidence.",
    to: "/other-jobs",
    action: "Explore Practice Sets",
    icon: <FaUserTie className="text-indigo-500 text-2xl" />,
  },
  {
    title: "ATS-Friendly Resume Tips",
    description:
      "Learn how to tailor your profile for every submission, with examples that score well across the top ATS scanners.",
    to: "/profile",
    action: "Review My Profile",
    icon: <FaCheckCircle className="text-emerald-500 text-2xl" />,
  },
  {
    title: "Career Playbooks",
    description:
      "Step-by-step pathways for popular roles so you can upskill, benchmark compensation, and target the right companies.",
    to: "/jobs",
    action: "See Matching Roles",
    icon: <FaBook className="text-purple-500 text-2xl" />,
  },
];

const workflowCards = [
  {
    title: "AI Resume Refiner",
    body: "Upload a draft and get tailored bullet suggestions aligned to the role you’re exploring on NextHire.",
  },
  {
    title: "1:1 Mock Interviews",
    body: "Book 30-minute sessions with vetted mentors from FAANG, top startups, and hyper-growth SaaS companies.",
  },
  {
    title: "Offer Navigator",
    body: "Track stages, compare offers, and generate polite negotiation emails in one place.",
  },
];

function CareerResources() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="pt-28 pb-16 bg-gradient-to-b from-indigo-50/80 to-white">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
            <span className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-white rounded-full border border-indigo-100 inline-flex items-center gap-2 justify-center">
              <FaMagic className="text-indigo-500" />
              Job-Seeker Playbook
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Tools that make the job search less overwhelming.
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From resume polish to interview practice, this workspace brings together curated
              workflows, templates, and quick actions to keep you moving forward on NextHire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
              >
                Jump to Open Roles
              </Link>
              <Link
                to="/browse-jobs"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
              >
                Use Filters & Alerts
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 px-4">
          <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
            {guideBlocks.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition group bg-white"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <Link
                  to={item.to}
                  className="text-indigo-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition"
                >
                  {item.action}
                  <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 grid gap-6 md:grid-cols-3">
            {workflowCards.map((card) => (
              <article
                key={card.title}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl text-white space-y-4"
              >
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="text-sm text-slate-200">{card.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CareerResources;

