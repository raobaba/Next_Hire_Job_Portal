import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useNavigate } from "react-router-dom";
import ReactHelmet from "../common/ReactHelmet";
import { useDispatch, useSelector } from "react-redux";
import {
  getHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
} from "@/redux/slices/job.slice";
import { getCompanies } from "@/redux/slices/company.slice";
import { getAllJobs } from "@/redux/slices/job.slice";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AdminHighlights = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { highlights } = useSelector((state) => state.job);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    type: "company",
    title: "",
    subtitle: "",
    description: "",
    company: "",
    job: "",
    imageUrl: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchHighlights();
    fetchCompanies();
    fetchJobs();
  }, [dispatch]);

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      await dispatch(getHighlights()).unwrap();
    } catch (error) {
      toast.error("Failed to fetch highlights");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await dispatch(getCompanies()).unwrap();
      if (res?.status === 200) {
        setCompanies(res?.companies || []);
      }
    } catch (error) {
      console.error("Failed to fetch companies");
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await dispatch(getAllJobs({ limit: 100 })).unwrap();
      if (res?.jobs) {
        setJobs(res.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch jobs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        company: formData.company || undefined,
        job: formData.job || undefined,
        order: Number(formData.order) || 0,
      };

      if (editingId) {
        await dispatch(
          updateHighlight({ highlightId: editingId, data })
        ).unwrap();
        toast.success("Highlight updated successfully!");
      } else {
        await dispatch(createHighlight(data)).unwrap();
        toast.success("Highlight created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        type: "company",
        title: "",
        subtitle: "",
        description: "",
        company: "",
        job: "",
        imageUrl: "",
        isActive: true,
        order: 0,
      });
      fetchHighlights();
    } catch (error) {
      toast.error(error?.message || "Failed to save highlight");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (highlight) => {
    setFormData({
      type: highlight.type || "company",
      title: highlight.title || "",
      subtitle: highlight.subtitle || "",
      description: highlight.description || "",
      company: highlight.company?._id || highlight.company || "",
      job: highlight.job?._id || highlight.job || "",
      imageUrl: highlight.imageUrl || "",
      isActive: highlight.isActive !== undefined ? highlight.isActive : true,
      order: highlight.order || 0,
    });
    setEditingId(highlight._id);
    setShowForm(true);
  };

  const handleDelete = async (highlightId) => {
    if (!window.confirm("Are you sure you want to delete this highlight?"))
      return;

    setLoading(true);
    try {
      await dispatch(deleteHighlight(highlightId)).unwrap();
      toast.success("Highlight deleted successfully!");
      fetchHighlights();
    } catch (error) {
      toast.error(error?.message || "Failed to delete highlight");
    } finally {
      setLoading(false);
    }
  };

  const filteredHighlights = highlights?.filter(
    (highlight) =>
      highlight.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      highlight.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6A38C2]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F83002]/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />
      {loading && <Loader />}

      <ReactHelmet
        title="Highlights - Admin - Next_Hire"
        description="Manage featured employers and success stories for the landing page"
        canonicalUrl="/admin/highlights"
      />

      <div className="max-w-6xl mx-auto pt-24 pb-8 px-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">
            Landing Page Highlights
          </h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  setEditingId(null);
                  setFormData({
                    type: "company",
                    title: "",
                    subtitle: "",
                    description: "",
                    company: "",
                    job: "",
                    imageUrl: "",
                    isActive: true,
                    order: 0,
                  });
                }
              }}
              className="bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white"
            >
              <FaPlus className="mr-2" />
              {showForm ? "Cancel" : "New Highlight"}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingId ? "Edit Highlight" : "Create New Highlight"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="font-semibold text-gray-900">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="story">Success Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-semibold text-gray-900">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Featured Employer: TechCorp"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-900">Subtitle</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Short subtitle or tagline"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-900">Description</Label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description or story content..."
                  rows={4}
                  className="mt-1 w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none resize-none"
                />
              </div>

              {formData.type === "company" && (
                <div>
                  <Label className="font-semibold text-gray-900">Company</Label>
                  <Select
                    value={formData.company}
                    onValueChange={(value) =>
                      setFormData({ ...formData, company: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company._id}>
                          {company.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.type === "story" && (
                <div>
                  <Label className="font-semibold text-gray-900">Job</Label>
                  <Select
                    value={formData.job}
                    onValueChange={(value) =>
                      setFormData({ ...formData, job: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job._id} value={job._id}>
                          {job.title} - {job.company?.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="font-semibold text-gray-900">Image URL</Label>
                <Input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold text-gray-900">Order</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-[#6A38C2]"
                  />
                  <Label className="font-semibold text-gray-900">Active</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white"
                >
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      type: "company",
                      title: "",
                      subtitle: "",
                      description: "",
                      company: "",
                      job: "",
                      imageUrl: "",
                      isActive: true,
                      order: 0,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <Input
            className="bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-xl focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20"
            placeholder="Search by title or subtitle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 shadow-lg p-6">
          {filteredHighlights && filteredHighlights.length > 0 ? (
            <div className="space-y-4">
              {filteredHighlights.map((highlight) => (
                <div
                  key={highlight._id}
                  className="p-4 border-2 border-gray-200/60 rounded-xl hover:border-[#6A38C2]/30 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          {highlight.title}
                        </h3>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          {highlight.type}
                        </span>
                        {highlight.isActive ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                            Inactive
                          </span>
                        )}
                      </div>
                      {highlight.subtitle && (
                        <p className="text-gray-600 font-semibold mb-2">
                          {highlight.subtitle}
                        </p>
                      )}
                      {highlight.description && (
                        <p className="text-gray-600 mb-2">{highlight.description}</p>
                      )}
                      {highlight.imageUrl && (
                        <img
                          src={highlight.imageUrl}
                          alt={highlight.title}
                          className="w-32 h-32 object-cover rounded-lg mt-2"
                        />
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Order: {highlight.order}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(highlight)}
                        className="text-[#6A38C2] hover:text-[#5b30a6]"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(highlight._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "No highlights found matching your search"
                  : "No highlights yet. Create one to get started!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHighlights;

