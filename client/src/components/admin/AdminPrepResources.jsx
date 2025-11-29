import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";
import ReactHelmet from "../common/ReactHelmet";
import { useDispatch, useSelector } from "react-redux";
import {
  getPrepResources,
  createPrepResource,
  updatePrepResource,
  deletePrepResource,
} from "@/redux/slices/job.slice";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AdminPrepResources = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { prepResources } = useSelector((state) => state.job);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    url: "",
    tags: "",
  });

  useEffect(() => {
    fetchResources();
  }, [dispatch]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      await dispatch(getPrepResources()).unwrap();
    } catch (error) {
      toast.error("Failed to fetch prep resources");
    } finally {
      setLoading(false);
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
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      if (editingId) {
        await dispatch(
          updatePrepResource({ resourceId: editingId, data })
        ).unwrap();
        toast.success("Prep resource updated successfully!");
      } else {
        await dispatch(createPrepResource(data)).unwrap();
        toast.success("Prep resource created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        category: "",
        content: "",
        url: "",
        tags: "",
      });
      fetchResources();
    } catch (error) {
      toast.error(error?.message || "Failed to save prep resource");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setFormData({
      title: resource.title || "",
      category: resource.category || "",
      content: resource.content || "",
      url: resource.url || "",
      tags: resource.tags?.join(", ") || "",
    });
    setEditingId(resource._id);
    setShowForm(true);
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;

    setLoading(true);
    try {
      await dispatch(deletePrepResource(resourceId)).unwrap();
      toast.success("Prep resource deleted successfully!");
      fetchResources();
    } catch (error) {
      toast.error(error?.message || "Failed to delete prep resource");
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = prepResources?.filter(
    (resource) =>
      resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
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
        title="Prep Resources - Admin - Next_Hire"
        description="Manage interview preparation resources for job seekers"
        canonicalUrl="/admin/prep-resources"
      />

      <div className="max-w-6xl mx-auto pt-24 pb-8 px-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#6A38C2] to-[#F83002] bg-clip-text text-transparent">
            Interview Prep Resources
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
                    title: "",
                    category: "",
                    content: "",
                    url: "",
                    tags: "",
                  });
                }
              }}
              className="bg-gradient-to-r from-[#6A38C2] to-[#5b30a6] hover:from-[#5b30a6] hover:to-[#4a2580] text-white"
            >
              <FaPlus className="mr-2" />
              {showForm ? "Cancel" : "New Resource"}
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200/60 rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingId ? "Edit Resource" : "Create New Resource"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="font-semibold text-gray-900">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., React Interview Questions"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-900">Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Technical, Behavioral, Coding"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-900">Content/Description</Label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Brief description or content..."
                  rows={4}
                  className="mt-1 w-full rounded-xl border-2 border-gray-200/60 p-3 focus:border-[#6A38C2] focus:ring-2 focus:ring-[#6A38C2]/20 outline-none resize-none"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-900">URL</Label>
                <Input
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  placeholder="https://example.com/resource"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-900">Tags (comma-separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="react, javascript, frontend"
                  className="mt-1"
                />
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
                      title: "",
                      category: "",
                      content: "",
                      url: "",
                      tags: "",
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
            placeholder="Search by title, category, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 shadow-lg p-6">
          {filteredResources && filteredResources.length > 0 ? (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  className="p-4 border-2 border-gray-200/60 rounded-xl hover:border-[#6A38C2]/30 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {resource.title}
                      </h3>
                      {resource.category && (
                        <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                          {resource.category}
                        </span>
                      )}
                      {resource.content && (
                        <p className="text-gray-600 mb-2">{resource.content}</p>
                      )}
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6A38C2] hover:text-[#F83002] font-semibold hover:underline"
                        >
                          View Resource →
                        </a>
                      )}
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {resource.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(resource)}
                        className="text-[#6A38C2] hover:text-[#5b30a6]"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(resource._id)}
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
                  ? "No resources found matching your search"
                  : "No prep resources yet. Create one to get started!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPrepResources;

