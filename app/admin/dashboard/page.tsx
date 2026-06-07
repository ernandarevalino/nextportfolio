"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { getProjects, createProject, updateProject, deleteProject } from "@/actions/portfolio";
import {
  BsPlusLg,
  BsPencilSquare,
  BsTrash,
  BsBoxArrowRight,
  BsArrowLeft,
  BsFolderSymlink,
  BsGithub
} from "react-icons/bs";

interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  github_url: string;
  details: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Web Development",
    image_url: "",
    github_url: "",
    details: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await getProjects();
      if (!res.success) {
        throw new Error(res.error);
      }
      setProjects(res.data || []);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects from database.");
    } finally {
      setLoading(false);
    }
  }

  // Open modal for adding a new project
  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      category: "Web Development",
      image_url: "",
      github_url: "",
      details: ""
    });
    setError(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing project
  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      image_url: project.image_url,
      github_url: project.github_url || "",
      details: project.details || ""
    });
    setError(null);
    setIsModalOpen(true);
  };

  // Handle save (both insert & update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingProject) {
        // UPDATE operation
        const res = await updateProject(editingProject.id, {
          title: formData.title,
          category: formData.category,
          image_url: formData.image_url,
          github_url: formData.github_url,
          details: formData.details
        });

        if (!res.success) throw new Error(res.error);
      } else {
        // INSERT operation
        const res = await createProject({
          title: formData.title,
          category: formData.category,
          image_url: formData.image_url,
          github_url: formData.github_url,
          details: formData.details
        });

        if (!res.success) throw new Error(res.error);
      }

      setIsModalOpen(false);
      router.refresh();
      await fetchProjects();
    } catch (err: any) {
      console.error("Error saving project:", err);
      setError(err.message || "Failed to save project. Please check fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the project "${title}"? This action is permanent.`);
    if (!confirmed) return;

    try {
      const res = await deleteProject(id);
      if (!res.success) throw new Error(res.error);
      
      router.refresh();
      await fetchProjects();
    } catch (err: any) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project: " + err.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await logoutAction();
      if (res && !res.success) {
        throw new Error(res.error);
      }
      router.push("/login");
    } catch (err: any) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-ubuntu text-white">Project Manager</h1>
            <p className="text-sm text-[#ececec]/60">Manage your portfolio projects dynamically</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 transition-all text-sm font-semibold cursor-pointer"
            >
              <BsArrowLeft /> View Site
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-all text-sm font-semibold cursor-pointer"
            >
              <BsBoxArrowRight /> Logout
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center bg-[#232323] p-6 rounded-2xl border border-white/10">
          <div className="text-lg font-bold font-ubuntu">
            Total Projects: <span className="text-white bg-white/10 px-2.5 py-1 rounded-md text-sm ml-1">{projects.length}</span>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-sm font-bold shadow-lg shadow-[#ececec]/10 cursor-pointer"
          >
            <BsPlusLg className="text-sm" /> Add New Project
          </button>
        </div>

        {/* Projects Listing */}
        {loading ? (
          <div className="bg-[#232323] p-20 rounded-[2rem] text-center border border-white/10 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#ececec] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#ececec]/60">Fetching your project list...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-[#232323] p-16 rounded-[2rem] text-center border border-white/10 space-y-4">
            <BsFolderSymlink className="text-5xl mx-auto text-white/30" />
            <p className="text-[#ececec]/60 text-lg">No projects stored in your database yet.</p>
            <button
              onClick={handleOpenAdd}
              className="px-6 py-2.5 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-sm font-bold cursor-pointer"
            >
              Add First Project
            </button>
          </div>
        ) : (
          <div className="bg-[#232323] rounded-[2rem] border border-white/10 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-sm font-bold text-[#ececec]/80">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">GitHub Link</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Image */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                          <img
                            src={project.image_url || "/assets/img/favicon.png"}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback on missing or invalid image path
                              (e.target as HTMLImageElement).src = "https://placehold.co/100x100/png";
                            }}
                          />
                        </div>
                      </td>
                      {/* Title */}
                      <td className="px-6 py-4 font-semibold text-white truncate max-w-[200px]">
                        {project.title}
                      </td>
                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-[#ececec]">
                        <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs">
                          {project.category}
                        </span>
                      </td>
                      {/* GitHub Link */}
                      <td className="px-6 py-4 text-sm text-[#ececec]/60 max-w-[150px] truncate">
                        {project.github_url && project.github_url !== "#" ? (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-white hover:underline"
                          >
                            <BsGithub /> Code Repo
                          </a>
                        ) : (
                          <span className="text-white/30 italic">No repo</span>
                        )}
                      </td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(project)}
                            className="p-2.5 bg-white/5 border border-white/10 hover:border-[#ececec] text-[#ececec] hover:text-white rounded-xl transition-all cursor-pointer"
                            title="Edit Project"
                          >
                            <BsPencilSquare className="text-base" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id, project.title)}
                            className="p-2.5 bg-red-600/10 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
                            title="Delete Project"
                          >
                            <BsTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal - Add / Edit Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#232323] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative space-y-6">
            
            {/* Modal Title */}
            <div>
              <h3 className="text-2xl font-bold font-ubuntu text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h3>
              <p className="text-xs text-[#ececec]/60 mt-1">
                {editingProject ? "Update existing project details in database" : "Insert a new dynamic project entry"}
              </p>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. My Awesome App Router Website"
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors cursor-pointer"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Etc">Etc</option>
                </select>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Image URL or Local Asset Path</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="e.g. /assets/img/portfolio/Web Development/img.jpg"
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                  required
                />
              </div>

              {/* GitHub Link */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">GitHub Link (optional)</label>
                <input
                  type="text"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="e.g. https://github.com/my-username/repo"
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                />
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Details / Description</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Summarize key features, Tech stack used, role, achievements..."
                  rows={4}
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors resize-none"
                ></textarea>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 transition-all text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving change..." : "Save Project"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
      
    </div>
  );
}
