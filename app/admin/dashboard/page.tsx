"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { getProjects, createProject, updateProject, deleteProject, getProfile, updateProfile, getSkills, createSkill, updateSkill, deleteSkill, getResumeData, updateResumeProfile, createResumeSkill, updateResumeSkill, deleteResumeSkill, createResumeItem, updateResumeItem, deleteResumeItem } from "@/actions/portfolio";
import { supabase } from "@/lib/supabase";
import {
  BsPlusLg,
  BsPencilSquare,
  BsTrash,
  BsBoxArrowRight,
  BsArrowLeft,
  BsFolderSymlink,
  BsGithub,
  BsInstagram,
  BsLinkedin,
  BsPerson
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

  // Tab & Profile States - DIPISAH MENJADI "projects" | "hero" | "about" | "skills" | "resume"
  const [activeTab, setActiveTab] = useState<"projects" | "hero" | "about" | "skills" | "resume">("projects");
  const [profileForm, setProfileForm] = useState({
    hero_title: "",
    hero_name: "",
    hero_description: "",
    typewriter_words_str: "",
    github_url: "",
    linkedin_url: "",
    instagram_url: "",
    about_image_url: "",
    about_name: "",
    about_title: "",
    about_email: "",
    about_phone: "",
    about_location: "",
    about_maps_url: "",
    about_heading: "",
    about_bio_1: "",
    about_bio_2: ""
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Skills States
  const [skills, setSkills] = useState<any[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [skillFormData, setSkillFormData] = useState({
    name: "",
    category: "Soft Skills",
    percentage: 50,
    tooltip: ""
  });
  const [skillSaving, setSkillSaving] = useState(false);
  const [skillError, setSkillError] = useState<string | null>(null);

  // Resume State
  const [resumeProfile, setResumeProfile] = useState({
    summary: "",
    location: "",
    email: "",
    phone: "",
    image_url: ""
  });
  const [resumeSkills, setResumeSkills] = useState<any[]>([]);
  const [resumeItems, setResumeItems] = useState<any[]>([]);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [savingResumeProfile, setSavingResumeProfile] = useState(false);
  const [uploadingResumeImg, setUploadingResumeImg] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeSuccess, setResumeSuccess] = useState<string | null>(null);

  // Resume Skills Modal State
  const [isResumeSkillModalOpen, setIsResumeSkillModalOpen] = useState(false);
  const [editingResumeSkill, setEditingResumeSkill] = useState<any | null>(null);
  const [resumeSkillFormData, setResumeSkillFormData] = useState({
    name: "",
    percentage: 80
  });
  const [savingResumeSkill, setSavingResumeSkill] = useState(false);
  const [resumeSkillError, setResumeSkillError] = useState<string | null>(null);

  // Resume Items Modal State
  const [isResumeItemModalOpen, setIsResumeItemModalOpen] = useState(false);
  const [editingResumeItem, setEditingResumeItem] = useState<any | null>(null);
  const [resumeItemFormData, setResumeItemFormData] = useState({
    type: "education",
    title: "",
    subtitle: "",
    period: "",
    description: "",
    order_index: 1
  });
  const [savingResumeItem, setSavingResumeItem] = useState(false);
  const [resumeItemError, setResumeItemError] = useState<string | null>(null);

  // Fetch all projects on mount
  useEffect(() => {
    fetchProjects();
    fetchProfile();
    fetchAllSkills();
    fetchResumeDashboardData();
  }, []);

  async function fetchResumeDashboardData() {
    setResumeLoading(true);
    try {
      const res = await getResumeData();
      if (res.success && res.data) {
        if (res.data.profile) {
          setResumeProfile({
            summary: res.data.profile.summary || "",
            location: res.data.profile.location || "",
            email: res.data.profile.email || "",
            phone: res.data.profile.phone || "",
            image_url: res.data.profile.image_url || ""
          });
        }
        setResumeSkills(res.data.skills || []);
        setResumeItems(res.data.items || []);
      }
    } catch (err: any) {
      console.error("Error loading resume data in dashboard:", err);
    } finally {
      setResumeLoading(false);
    }
  }

  const handleSaveResumeProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingResumeProfile(true);
    setResumeError(null);
    setResumeSuccess(null);

    try {
      const res = await updateResumeProfile(resumeProfile);
      if (!res.success) throw new Error(res.error);
      setResumeSuccess("Resume profile updated successfully!");
      router.refresh();
      await fetchResumeDashboardData();
    } catch (err: any) {
      console.error("Error updating resume profile:", err);
      setResumeError(err.message || "Failed to update resume profile.");
    } finally {
      setSavingResumeProfile(false);
    }
  };

  const handleResumeImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResumeImg(true);
    setResumeError(null);
    setResumeSuccess(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `resume-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      setResumeProfile((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));

      setResumeSuccess("Resume image uploaded successfully! Preview updated.");
    } catch (err: any) {
      console.error("Error uploading resume image:", err);
      setResumeError(err.message || "Failed to upload resume image.");
    } finally {
      setUploadingResumeImg(false);
    }
  };

  const handleOpenAddResumeSkill = () => {
    setEditingResumeSkill(null);
    setResumeSkillFormData({
      name: "",
      percentage: 80
    });
    setResumeSkillError(null);
    setIsResumeSkillModalOpen(true);
  };

  const handleOpenEditResumeSkill = (skill: any) => {
    setEditingResumeSkill(skill);
    setResumeSkillFormData({
      name: skill.name,
      percentage: Number(skill.percentage)
    });
    setResumeSkillError(null);
    setIsResumeSkillModalOpen(true);
  };

  const handleSaveResumeSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingResumeSkill(true);
    setResumeSkillError(null);

    try {
      if (editingResumeSkill) {
        const res = await updateResumeSkill(editingResumeSkill.id, resumeSkillFormData);
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await createResumeSkill(resumeSkillFormData);
        if (!res.success) throw new Error(res.error);
      }

      setIsResumeSkillModalOpen(false);
      router.refresh();
      await fetchResumeDashboardData();
    } catch (err: any) {
      console.error("Error saving resume skill:", err);
      setResumeSkillError(err.message || "Failed to save skill.");
    } finally {
      setSavingResumeSkill(false);
    }
  };

  const handleDeleteResumeSkill = async (id: number, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the technical skill "${name}"?`);
    if (!confirmed) return;

    try {
      const res = await deleteResumeSkill(id);
      if (!res.success) throw new Error(res.error);

      router.refresh();
      await fetchResumeDashboardData();
    } catch (err: any) {
      console.error("Error deleting resume skill:", err);
      alert("Failed to delete skill: " + err.message);
    }
  };

  const handleOpenAddResumeItem = () => {
    setEditingResumeItem(null);
    setResumeItemFormData({
      type: "education",
      title: "",
      subtitle: "",
      period: "",
      description: "",
      order_index: resumeItems.length + 1
    });
    setResumeItemError(null);
    setIsResumeItemModalOpen(true);
  };

  const handleOpenEditResumeItem = (item: any) => {
    setEditingResumeItem(item);
    setResumeItemFormData({
      type: item.type,
      title: item.title,
      subtitle: item.subtitle || "",
      period: item.period || "",
      description: item.description || "",
      order_index: Number(item.order_index || 1)
    });
    setResumeItemError(null);
    setIsResumeItemModalOpen(true);
  };

  const handleSaveResumeItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingResumeItem(true);
    setResumeItemError(null);

    try {
      if (editingResumeItem) {
        const res = await updateResumeItem(editingResumeItem.id, resumeItemFormData as any);
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await createResumeItem(resumeItemFormData as any);
        if (!res.success) throw new Error(res.error);
      }

      setIsResumeItemModalOpen(false);
      router.refresh();
      await fetchResumeDashboardData();
    } catch (err: any) {
      console.error("Error saving resume item:", err);
      setResumeItemError(err.message || "Failed to save timeline item.");
    } finally {
      setSavingResumeItem(false);
    }
  };

  const handleDeleteResumeItem = async (id: number, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the timeline item "${title}"?`);
    if (!confirmed) return;

    try {
      const res = await deleteResumeItem(id);
      if (!res.success) throw new Error(res.error);

      router.refresh();
      await fetchResumeDashboardData();
    } catch (err: any) {
      console.error("Error deleting resume item:", err);
      alert("Failed to delete timeline item: " + err.message);
    }
  };

  async function fetchAllSkills() {
    setSkillsLoading(true);
    try {
      const res = await getSkills();
      if (res.success) {
        setSkills(res.data || []);
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      console.error("Error fetching skills in dashboard:", err);
    } finally {
      setSkillsLoading(false);
    }
  }

  const handleOpenAddSkill = () => {
    setEditingSkill(null);
    setSkillFormData({
      name: "",
      category: "Soft Skills",
      percentage: 50,
      tooltip: ""
    });
    setSkillError(null);
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill: any) => {
    setEditingSkill(skill);
    setSkillFormData({
      name: skill.name,
      category: skill.category,
      percentage: Number(skill.percentage),
      tooltip: skill.tooltip || ""
    });
    setSkillError(null);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSkillSaving(true);
    setSkillError(null);

    try {
      if (editingSkill) {
        const res = await updateSkill(editingSkill.id, {
          name: skillFormData.name,
          category: skillFormData.category,
          percentage: skillFormData.percentage,
          tooltip: skillFormData.tooltip
        });
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await createSkill({
          name: skillFormData.name,
          category: skillFormData.category,
          percentage: skillFormData.percentage,
          tooltip: skillFormData.tooltip
        });
        if (!res.success) throw new Error(res.error);
      }

      setIsSkillModalOpen(false);
      router.refresh();
      await fetchAllSkills();
    } catch (err: any) {
      console.error("Error saving skill:", err);
      setSkillError(err.message || "Failed to save skill.");
    } finally {
      setSkillSaving(false);
    }
  };

  const handleDeleteSkill = async (id: number, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the skill "${name}"? This action is permanent.`);
    if (!confirmed) return;

    try {
      const res = await deleteSkill(id);
      if (!res.success) throw new Error(res.error);

      router.refresh();
      await fetchAllSkills();
    } catch (err: any) {
      console.error("Error deleting skill:", err);
      alert("Failed to delete skill: " + err.message);
    }
  };

  async function fetchProfile() {
    try {
      const res = await getProfile();
      if (res.success && res.data) {
        setProfileForm({
          hero_title: res.data.hero_title || "",
          hero_name: res.data.hero_name || "",
          hero_description: res.data.hero_description || "",
          typewriter_words_str: res.data.typewriter_words ? res.data.typewriter_words.join(", ") : "",
          github_url: res.data.github_url || "",
          linkedin_url: res.data.linkedin_url || "",
          instagram_url: res.data.instagram_url || "",
          about_image_url: res.data.about_image_url || "",
          about_name: res.data.about_name || "",
          about_title: res.data.about_title || "",
          about_email: res.data.about_email || "",
          about_phone: res.data.about_phone || "",
          about_location: res.data.about_location || "",
          about_maps_url: res.data.about_maps_url || "",
          about_heading: res.data.about_heading || "",
          about_bio_1: res.data.about_bio_1 || "",
          about_bio_2: res.data.about_bio_2 || ""
        });
      }
    } catch (err: any) {
      console.error("Error fetching profile:", err);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `about-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      setProfileForm((prev) => ({
        ...prev,
        about_image_url: publicUrl,
      }));

      setProfileSuccess("Image uploaded successfully! Preview updated below.");
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setProfileError(err.message || "Failed to upload image. Please ensure the bucket exists and is public.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const wordsArray = profileForm.typewriter_words_str
        .split(",")
        .map((w) => w.trim())
        .filter((w) => w !== "");

      const res = await updateProfile({
        hero_title: profileForm.hero_title,
        hero_name: profileForm.hero_name,
        hero_description: profileForm.hero_description,
        typewriter_words: wordsArray,
        github_url: profileForm.github_url,
        linkedin_url: profileForm.linkedin_url,
        instagram_url: profileForm.instagram_url,
        about_image_url: profileForm.about_image_url,
        about_name: profileForm.about_name,
        about_title: profileForm.about_title,
        about_email: profileForm.about_email,
        about_phone: profileForm.about_phone,
        about_location: profileForm.about_location,
        about_maps_url: profileForm.about_maps_url,
        about_heading: profileForm.about_heading,
        about_bio_1: profileForm.about_bio_1,
        about_bio_2: profileForm.about_bio_2
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      setProfileSuccess("Profile updated successfully!");
      router.refresh();
      await fetchProfile();
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingProject) {
        const res = await updateProject(editingProject.id, {
          title: formData.title,
          category: formData.category,
          image_url: formData.image_url,
          github_url: formData.github_url,
          details: formData.details
        });

        if (!res.success) throw new Error(res.error);
      } else {
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
            <h1 className="text-3xl font-bold font-ubuntu text-white">Admin Dashboard</h1>
            <p className="text-sm text-[#ececec]/60">Manage your portfolio projects and hero profile dynamically</p>
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

        {/* Tab System - MENJADI 5 TAB MENU */}
        <div className="flex flex-wrap gap-4 md:gap-6 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-4 px-2 text-base font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "projects"
                ? "border-[#ececec] text-white"
                : "border-transparent text-[#ececec]/60 hover:text-white"
            }`}
          >
            Manage Projects
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={`pb-4 px-2 text-base font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "hero"
                ? "border-[#ececec] text-white"
                : "border-transparent text-[#ececec]/60 hover:text-white"
            }`}
          >
            Edit Hero & Socials
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-4 px-2 text-base font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "about"
                ? "border-[#ececec] text-white"
                : "border-transparent text-[#ececec]/60 hover:text-white"
            }`}
          >
            Edit About Profile
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`pb-4 px-2 text-base font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "skills"
                ? "border-[#ececec] text-white"
                : "border-transparent text-[#ececec]/60 hover:text-white"
            }`}
          >
            Manage Skills
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`pb-4 px-2 text-base font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "resume"
                ? "border-[#ececec] text-white"
                : "border-transparent text-[#ececec]/60 hover:text-white"
            }`}
          >
            Manage Resume
          </button>
        </div>

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <>
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
                          <td className="px-6 py-4">
                            <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                              <img
                                src={project.image_url || "/assets/img/favicon.png"}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100/png";
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-white truncate max-w-[200px]">
                            {project.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#ececec]">
                            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs">
                              {project.category}
                            </span>
                          </td>
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
          </>
        )}

        {/* TAB 2: HERO & SOCIALS */}
        {activeTab === "hero" && (
          <div className="bg-[#232323] p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-ubuntu text-white">Edit Hero & Socials</h2>
              <p className="text-sm text-[#ececec]/60">Modify the landing page header, introduction text, typewriter animation, and social links.</p>
            </div>

            {profileError && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 py-3 px-4 rounded-xl text-center">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* HERO SECTION SETTINGS */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold font-ubuntu text-white">Hero Section Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">Hero Title</label>
                    <input
                      type="text"
                      value={profileForm.hero_title}
                      onChange={(e) => setProfileForm({ ...profileForm, hero_title: e.target.value })}
                      placeholder="e.g. Hellow !!"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">Hero Name</label>
                    <input
                      type="text"
                      value={profileForm.hero_name}
                      onChange={(e) => setProfileForm({ ...profileForm, hero_name: e.target.value })}
                      placeholder="e.g. Ernanda"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">Typewriter Words (separated by comma)</label>
                  <input
                    type="text"
                    value={profileForm.typewriter_words_str}
                    onChange={(e) => setProfileForm({ ...profileForm, typewriter_words_str: e.target.value })}
                    placeholder="e.g. Web Developer, UI/UX Enthusiast, Information Systems Student"
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                    required
                  />
                  <p className="text-[11px] text-[#ececec]/40 pl-1">Input words or short sentences separated by commas for the text animation effect.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">Hero Description</label>
                  <textarea
                    value={profileForm.hero_description}
                    onChange={(e) => setProfileForm({ ...profileForm, hero_description: e.target.value })}
                    placeholder="Tell something about yourself..."
                    rows={4}
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              {/* SOCIAL LINKS SETTINGS */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold font-ubuntu text-white mb-4">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1 flex items-center gap-1.5">
                      <BsGithub className="text-sm" /> GitHub Link
                    </label>
                    <input
                      type="text"
                      value={profileForm.github_url}
                      onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                      placeholder="e.g. https://github.com/yourusername"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1 flex items-center gap-1.5">
                      <BsLinkedin className="text-sm" /> LinkedIn Link
                    </label>
                    <input
                      type="text"
                      value={profileForm.linkedin_url}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                      placeholder="e.g. https://linkedin.com/in/yourusername"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1 flex items-center gap-1.5">
                      <BsInstagram className="text-sm" /> Instagram Link
                    </label>
                    <input
                      type="text"
                      value={profileForm.instagram_url}
                      onChange={(e) => setProfileForm({ ...profileForm, instagram_url: e.target.value })}
                      placeholder="e.g. https://instagram.com/yourusername"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-8 py-3 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-sm font-bold disabled:opacity-50 shadow-lg shadow-[#ececec]/10 cursor-pointer"
                >
                  {savingProfile ? "Saving Profile..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ABOUT PROFILE */}
        {activeTab === "about" && (
          <div className="bg-[#232323] p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-ubuntu text-white">Edit About Profile</h2>
              <p className="text-sm text-[#ececec]/60">Modify your bio, upload avatar pictures, information details, and customize your professional background.</p>
            </div>

            {profileError && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 py-3 px-4 rounded-xl text-center">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-6">
                
                {/* Profile Photo Upload */}
                <div className="flex flex-col md:flex-row items-center gap-6 bg-[#1f1f1f] p-6 rounded-2xl border border-white/5">
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-white/20 bg-black/40 flex-shrink-0 relative">
                    {profileForm.about_image_url ? (
                      <img
                        src={profileForm.about_image_url}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white/40">No Image</div>
                    )}
                  </div>
                  <div className="space-y-3 flex-1 w-full">
                    <label className="block text-xs font-bold text-[#ececec]/80">Upload Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="block w-full text-sm text-[#ececec]/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                    />
                    <p className="text-[11px] text-[#ececec]/40">Upload image directly to the 'portfolio' storage bucket. Supported formats: JPG, PNG, WEBP.</p>
                    {uploadingImage && <p className="text-xs text-yellow-400">Uploading photo...</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">About Name</label>
                    <input
                      type="text"
                      value={profileForm.about_name}
                      onChange={(e) => setProfileForm({ ...profileForm, about_name: e.target.value })}
                      placeholder="e.g. Ernanda Revalino"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">About Title</label>
                    <input
                      type="text"
                      value={profileForm.about_title}
                      onChange={(e) => setProfileForm({ ...profileForm, about_title: e.target.value })}
                      placeholder="e.g. Web Development & Data Analyst Aspiring"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">About Email</label>
                    <input
                      type="email"
                      value={profileForm.about_email}
                      onChange={(e) => setProfileForm({ ...profileForm, about_email: e.target.value })}
                      placeholder="e.g. ernandarevalino@gmail.com"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">About Phone</label>
                    <input
                      type="text"
                      value={profileForm.about_phone}
                      onChange={(e) => setProfileForm({ ...profileForm, about_phone: e.target.value })}
                      placeholder="e.g. +62 857-1020-9622"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">About Location</label>
                    <input
                      type="text"
                      value={profileForm.about_location}
                      onChange={(e) => setProfileForm({ ...profileForm, about_location: e.target.value })}
                      placeholder="e.g. Serpong, Tangerang Selatan"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">Google Maps URL</label>
                  <input
                    type="url"
                    value={profileForm.about_maps_url}
                    onChange={(e) => setProfileForm({ ...profileForm, about_maps_url: e.target.value })}
                    placeholder="e.g. https://maps.app.goo.gl/uHZRvx4thS6Nh1PC7"
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">About Heading</label>
                  <input
                    type="text"
                    value={profileForm.about_heading}
                    onChange={(e) => setProfileForm({ ...profileForm, about_heading: e.target.value })}
                    placeholder="e.g. Writing code with purpose, turning data into direction"
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">Bio Paragraph 1</label>
                  <textarea
                    value={profileForm.about_bio_1}
                    onChange={(e) => setProfileForm({ ...profileForm, about_bio_1: e.target.value })}
                    placeholder="Describe your first biography paragraph..."
                    rows={4}
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">Bio Paragraph 2</label>
                  <textarea
                    value={profileForm.about_bio_2}
                    onChange={(e) => setProfileForm({ ...profileForm, about_bio_2: e.target.value })}
                    placeholder="Describe your second biography paragraph..."
                    rows={4}
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-8 py-3 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-sm font-bold disabled:opacity-50 shadow-lg shadow-[#ececec]/10 cursor-pointer"
                >
                  {savingProfile ? "Saving Profile..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: MANAGE SKILLS */}
        {activeTab === "skills" && (
          <>
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-[#232323] p-6 rounded-2xl border border-white/10">
              <div className="text-lg font-bold font-ubuntu">
                Total Skills: <span className="text-white bg-white/10 px-2.5 py-1 rounded-md text-sm ml-1">{skills.length}</span>
              </div>
              <button
                onClick={handleOpenAddSkill}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-sm font-bold shadow-lg shadow-[#ececec]/10 cursor-pointer"
              >
                <BsPlusLg className="text-sm" /> Add New Skill
              </button>
            </div>

            {/* Skills Listing */}
            {skillsLoading ? (
              <div className="bg-[#232323] p-20 rounded-[2rem] text-center border border-white/10 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#ececec] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[#ececec]/60">Fetching your skills list...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="bg-[#232323] p-16 rounded-[2rem] text-center border border-white/10 space-y-4">
                <BsFolderSymlink className="text-5xl mx-auto text-white/30" />
                <p className="text-[#ececec]/60 text-lg">No skills stored in your database yet.</p>
                <button
                  onClick={handleOpenAddSkill}
                  className="px-6 py-2.5 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-sm font-bold cursor-pointer"
                >
                  Add First Skill
                </button>
              </div>
            ) : (
              <div className="bg-[#232323] rounded-[2rem] border border-white/10 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-sm font-bold text-[#ececec]/80">
                        <th className="px-6 py-4">Skill Name</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Percentage</th>
                        <th className="px-6 py-4">Tooltip / Description</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {skills.map((skill) => (
                        <tr key={skill.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">
                            {skill.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#ececec]">
                            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs">
                              {skill.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-white font-medium">
                            <div className="flex items-center gap-3">
                              <span className="w-10">{skill.percentage}%</span>
                              <div className="w-24 h-[6px] bg-white/10 rounded-full overflow-hidden hidden sm:block">
                                <div className="h-full bg-gradient-to-r from-white/40 to-[#ececec] rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#ececec]/60 max-w-xs truncate" title={skill.tooltip}>
                            {skill.tooltip || <span className="text-white/30 italic">No description</span>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-3">
                              <button
                                onClick={() => handleOpenEditSkill(skill)}
                                className="p-2.5 bg-white/5 border border-white/10 hover:border-[#ececec] text-[#ececec] hover:text-white rounded-xl transition-all cursor-pointer"
                                title="Edit Skill"
                              >
                                <BsPencilSquare className="text-base" />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(skill.id, skill.name)}
                                className="p-2.5 bg-red-600/10 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
                                title="Delete Skill"
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
          </>
        )}

        {/* RESUME TAB */}
        {activeTab === "resume" && (
          <div className="space-y-8">
            {/* Resume Profile Form */}
            <div className="bg-[#232323] p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-ubuntu text-white">Edit Resume Profile</h2>
                <p className="text-sm text-[#ececec]/60">Customize the summary statement, contact info, and Profile Image/GIF for your resume.</p>
              </div>

              {resumeError && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center">
                  {resumeError}
                </div>
              )}

              {resumeSuccess && (
                <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 py-3 px-4 rounded-xl text-center">
                  {resumeSuccess}
                </div>
              )}

              <form onSubmit={handleSaveResumeProfile} className="space-y-6">
                {/* Image Upload */}
                <div className="flex flex-col md:flex-row items-center gap-6 bg-[#1f1f1f] p-6 rounded-2xl border border-white/5">
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-white/20 bg-black/40 flex-shrink-0 relative">
                    {resumeProfile.image_url ? (
                      <img
                        src={resumeProfile.image_url}
                        alt="Resume Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white/40">No Image</div>
                    )}
                  </div>
                  <div className="space-y-3 flex-1 w-full">
                    <label className="block text-xs font-bold text-[#ececec]/80">Upload Resume Profile Image / GIF</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleResumeImgUpload}
                      disabled={uploadingResumeImg}
                      className="block w-full text-sm text-[#ececec]/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                    />
                    {uploadingResumeImg && <p className="text-xs text-yellow-400">Uploading resume image...</p>}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">Summary</label>
                  <textarea
                    value={resumeProfile.summary}
                    onChange={(e) => setResumeProfile({ ...resumeProfile, summary: e.target.value })}
                    placeholder="Turn hope into ideas..."
                    rows={3}
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                {/* Contacts grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">Location</label>
                    <input
                      type="text"
                      value={resumeProfile.location}
                      onChange={(e) => setResumeProfile({ ...resumeProfile, location: e.target.value })}
                      placeholder="Serpong, Tangerang Selatan"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">Email</label>
                    <input
                      type="email"
                      value={resumeProfile.email}
                      onChange={(e) => setResumeProfile({ ...resumeProfile, email: e.target.value })}
                      placeholder="ernandarevalino@gmail.com"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#ececec]/80 pl-1">Phone</label>
                    <input
                      type="text"
                      value={resumeProfile.phone}
                      onChange={(e) => setResumeProfile({ ...resumeProfile, phone: e.target.value })}
                      placeholder="+62 857-1020-9622"
                      className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={savingResumeProfile}
                    className="px-8 py-3 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-sm font-bold disabled:opacity-50 shadow-lg shadow-[#ececec]/10 cursor-pointer"
                  >
                    {savingResumeProfile ? "Saving Resume Profile..." : "Save Resume Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* Resume Technical Skills CRUD */}
            <div className="bg-[#232323] p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold font-ubuntu text-white">Resume Technical Skills</h2>
                  <p className="text-sm text-[#ececec]/60">Manage technical skills displayed in your resume sidebar.</p>
                </div>
                <button
                  onClick={handleOpenAddResumeSkill}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-xs font-bold shadow-lg shadow-[#ececec]/10 cursor-pointer"
                >
                  <BsPlusLg className="text-xs" /> Add Resume Skill
                </button>
              </div>

              {resumeLoading ? (
                <div className="text-center py-10">
                  <div className="w-8 h-8 border-4 border-[#ececec] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : resumeSkills.length === 0 ? (
                <p className="text-[#ececec]/60 text-center py-6 text-sm italic">No technical skills added yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-xs font-bold text-[#ececec]/80 border-b border-white/10">
                        <th className="px-6 py-3">Skill Name</th>
                        <th className="px-6 py-3">Percentage</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {resumeSkills.map((sk) => (
                        <tr key={sk.id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-3 font-semibold text-white">{sk.name}</td>
                          <td className="px-6 py-3 text-white">{sk.percentage}%</td>
                          <td className="px-6 py-3">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleOpenEditResumeSkill(sk)}
                                className="p-2 bg-white/5 border border-white/10 hover:border-[#ececec] text-[#ececec] hover:text-white rounded-lg transition-all cursor-pointer"
                              >
                                <BsPencilSquare className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleDeleteResumeSkill(sk.id, sk.name)}
                                className="p-2 bg-red-600/10 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer"
                              >
                                <BsTrash className="text-xs" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Resume Timeline Items CRUD */}
            <div className="bg-[#232323] p-8 rounded-[2rem] border border-white/10 shadow-xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold font-ubuntu text-white">Resume Timeline Items</h2>
                  <p className="text-sm text-[#ececec]/60">Manage your Education, Experience, and Certifications.</p>
                </div>
                <button
                  onClick={handleOpenAddResumeItem}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-xs font-bold shadow-lg shadow-[#ececec]/10 cursor-pointer"
                >
                  <BsPlusLg className="text-xs" /> Add Timeline Item
                </button>
              </div>

              {resumeLoading ? (
                <div className="text-center py-10">
                  <div className="w-8 h-8 border-4 border-[#ececec] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : resumeItems.length === 0 ? (
                <p className="text-[#ececec]/60 text-center py-6 text-sm italic">No timeline items added yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-xs font-bold text-[#ececec]/80 border-b border-white/10">
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Title</th>
                        <th className="px-6 py-3">Subtitle / Instansi</th>
                        <th className="px-6 py-3">Period</th>
                        <th className="px-6 py-3">Order</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {resumeItems.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-3">
                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs capitalize text-[#ececec]">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-semibold text-white truncate max-w-[150px]" title={item.title}>
                            {item.title}
                          </td>
                          <td className="px-6 py-3 text-[#ececec]/80 truncate max-w-[150px]" title={item.subtitle}>
                            {item.subtitle || <span className="text-white/20 italic">-</span>}
                          </td>
                          <td className="px-6 py-3 text-[#ececec]/60">{item.period || <span className="text-white/20 italic">-</span>}</td>
                          <td className="px-6 py-3 text-[#ececec]/60">{item.order_index}</td>
                          <td className="px-6 py-3">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleOpenEditResumeItem(item)}
                                className="p-2 bg-white/5 border border-white/10 hover:border-[#ececec] text-[#ececec] hover:text-white rounded-lg transition-all cursor-pointer"
                              >
                                <BsPencilSquare className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleDeleteResumeItem(item.id, item.title)}
                                className="p-2 bg-red-600/10 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer"
                              >
                                <BsTrash className="text-xs" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Resume Skill Modal */}
      {isResumeSkillModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#232323] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-ubuntu text-white">
                {editingResumeSkill ? "Edit Resume Skill" : "Add Resume Skill"}
              </h3>
              <p className="text-xs text-[#ececec]/60 mt-1">
                Manage the technical mini-skills for your resume sidebar.
              </p>
            </div>

            {resumeSkillError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl text-center">
                {resumeSkillError}
              </div>
            )}

            <form onSubmit={handleSaveResumeSkill} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Skill Name</label>
                <input
                  type="text"
                  value={resumeSkillFormData.name}
                  onChange={(e) => setResumeSkillFormData({ ...resumeSkillFormData, name: e.target.value })}
                  placeholder="e.g. Web Development"
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] outline-none text-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Percentage ({resumeSkillFormData.percentage}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={resumeSkillFormData.percentage}
                  onChange={(e) => setResumeSkillFormData({ ...resumeSkillFormData, percentage: Number(e.target.value) })}
                  className="w-full accent-[#ececec] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsResumeSkillModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 transition-all text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResumeSkill}
                  className="px-6 py-2.5 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {savingResumeSkill ? "Saving..." : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resume Item Modal */}
      {isResumeItemModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#232323] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-ubuntu text-white">
                {editingResumeItem ? "Edit Timeline Item" : "Add Timeline Item"}
              </h3>
              <p className="text-xs text-[#ececec]/60 mt-1">
                Manage resume education, experience, and certification milestones.
              </p>
            </div>

            {resumeItemError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl text-center">
                {resumeItemError}
              </div>
            )}

            <form onSubmit={handleSaveResumeItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">Type</label>
                  <select
                    value={resumeItemFormData.type}
                    onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, type: e.target.value as any })}
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] outline-none text-white transition-colors cursor-pointer"
                  >
                    <option value="education">Education</option>
                    <option value="experience">Experience</option>
                    <option value="certification">Certification</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#ececec]/80 pl-1">Order Index</label>
                  <input
                    type="number"
                    value={resumeItemFormData.order_index}
                    onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, order_index: Number(e.target.value) })}
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] outline-none text-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Title</label>
                <input
                  type="text"
                  value={resumeItemFormData.title}
                  onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, title: e.target.value })}
                  placeholder="e.g. Information Systems"
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] outline-none text-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Subtitle / Instansi</label>
                <input
                  type="text"
                  value={resumeItemFormData.subtitle}
                  onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, subtitle: e.target.value })}
                  placeholder="e.g. BSI University"
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] outline-none text-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Period</label>
                <input
                  type="text"
                  value={resumeItemFormData.period}
                  onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, period: e.target.value })}
                  placeholder="e.g. 2023 - Now"
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] outline-none text-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">
                  Description {resumeItemFormData.type === "experience" && "(Use newlines '\\n' for bullet points)"}
                </label>
                <textarea
                  value={resumeItemFormData.description}
                  onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, description: e.target.value })}
                  placeholder="Describe your role or academic details..."
                  rows={4}
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] outline-none text-white transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsResumeItemModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 transition-all text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResumeItem}
                  className="px-6 py-2.5 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {savingResumeItem ? "Saving..." : "Save Timeline Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal - Add / Edit Form */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#232323] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative space-y-6">
            <div>
              <h3 className="text-2xl font-bold font-ubuntu text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <p className="text-xs text-[#ececec]/60 mt-1">
                {editingSkill ? "Update existing skill details in database" : "Insert a new dynamic skill entry"}
              </p>
            </div>

            {skillError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl text-center">
                {skillError}
              </div>
            )}

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Skill Name</label>
                <input
                  type="text"
                  value={skillFormData.name}
                  onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                  placeholder="e.g. Next.js"
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Category</label>
                <select
                  value={skillFormData.category}
                  onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors cursor-pointer"
                >
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Back-end Development">Back-end Development</option>
                  <option value="UI/UX & Frontend Development">UI/UX & Frontend Development</option>
                  <option value="Data Analyst Tools">Data Analyst Tools</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Percentage ({skillFormData.percentage}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skillFormData.percentage}
                  onChange={(e) => setSkillFormData({ ...skillFormData, percentage: Number(e.target.value) })}
                  className="w-full accent-[#ececec] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skillFormData.percentage}
                  onChange={(e) => setSkillFormData({ ...skillFormData, percentage: Math.min(100, Math.max(0, Number(e.target.value))) })}
                  className="w-20 bg-[#1f1f1f] border border-white/10 rounded-lg px-2 py-1 text-xs focus:border-[#ececec] outline-none text-white transition-colors mt-1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#ececec]/80 pl-1">Tooltip / Description</label>
                <textarea
                  value={skillFormData.tooltip}
                  onChange={(e) => setSkillFormData({ ...skillFormData, tooltip: e.target.value })}
                  placeholder="Short description shown on hover..."
                  rows={3}
                  className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 transition-all text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={skillSaving}
                  className="px-6 py-2.5 bg-[#ececec] text-[#310606] hover:bg-white rounded-full transition-all text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {skillSaving ? "Saving skill..." : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Add / Edit Form (Projects) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#232323] border border-white/10 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative space-y-6">
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

            <form onSubmit={handleSave} className="space-y-4">
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