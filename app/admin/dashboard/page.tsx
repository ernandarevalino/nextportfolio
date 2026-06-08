"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { getProjects, createProject, updateProject, deleteProject, getProfile, updateProfile, getSkills, createSkill, updateSkill, deleteSkill, getResumeData, updateResumeProfile, createResumeSkill, updateResumeSkill, deleteResumeSkill, createResumeItem, updateResumeItem, deleteResumeItem, getContacts, deleteContact } from "@/actions/portfolio";
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
  BsPerson,
  BsEnvelope,
  BsFileEarmarkText
} from "react-icons/bs";

interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  github_url: string;
  details: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
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
  const [uploadingProjectImg, setUploadingProjectImg] = useState(false);

  // Tab & Profile States - DIPISAH MENJADI "projects" | "hero" | "about" | "skills" | "resume" | "messages"
  const [activeTab, setActiveTab] = useState<"projects" | "hero" | "about" | "skills" | "resume" | "messages">("projects");

  // Contacts State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);
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
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setContactsLoading(true);
    setContactsError(null);
    try {
      const res = await getContacts();
      if (res.success) {
        setContacts(res.data || []);
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      console.error("Error fetching contacts in dashboard:", err);
      setContactsError(err.message || "Failed to load messages.");
    } finally {
      setContactsLoading(false);
    }
  }

  const handleDeleteContact = async (id: number, senderName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the message from "${senderName}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await deleteContact(id);
      if (!res.success) throw new Error(res.error);
      
      router.refresh();
      await fetchContacts();
    } catch (err: any) {
      console.error("Error deleting contact:", err);
      alert("Failed to delete message: " + err.message);
    }
  };

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

    const oldImageUrl = resumeProfile.image_url;

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

      if (oldImageUrl && oldImageUrl.includes("/portfolio/")) {
        const oldFileName = oldImageUrl.split("/portfolio/").pop();
        if (oldFileName) {
          const decodedFileName = decodeURIComponent(oldFileName);
          await supabase.storage.from("portfolio").remove([decodedFileName]);
        }
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

    const oldImageUrl = profileForm.about_image_url;

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

      if (oldImageUrl && oldImageUrl.includes("/portfolio/")) {
        const oldFileName = oldImageUrl.split("/portfolio/").pop();
        if (oldFileName) {
          const decodedFileName = decodeURIComponent(oldFileName);
          await supabase.storage.from("portfolio").remove([decodedFileName]);
        }
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

  const handleProjectImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProjectImg(true);
    setError(null);

    const oldImageUrl = formData.image_url;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `project-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      if (oldImageUrl && oldImageUrl.includes("/portfolio/")) {
        const oldFileName = oldImageUrl.split("/portfolio/").pop();
        if (oldFileName) {
          const decodedFileName = decodeURIComponent(oldFileName);
          await supabase.storage.from("portfolio").remove([decodedFileName]);
        }
      }

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));
    } catch (err: any) {
      console.error("Error uploading project image:", err);
      setError(err.message || "Failed to upload project image.");
    } finally {
      setUploadingProjectImg(false);
    }
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

    const projectToDelete = projects.find((p) => p.id === id);
    const imageUrl = projectToDelete?.image_url;

    try {
      const res = await deleteProject(id);
      if (!res.success) throw new Error(res.error);

      if (imageUrl && imageUrl.includes("/portfolio/")) {
        const fileName = imageUrl.split("/portfolio/").pop();
        if (fileName) {
          const decodedFileName = decodeURIComponent(fileName);
          await supabase.storage.from("portfolio").remove([decodedFileName]);
        }
      }
      
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
    <div className="min-h-screen bg-[#1f1f1f] text-[#ececec] font-sans p-4 sm:p-6 md:p-12 selection:bg-white/10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-ubuntu text-white">
              Admin Panel
            </h1>
            <p className="text-sm text-[#ececec]/60">
              Manage your portfolio sections, projects, and dynamic components.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 text-sm font-medium cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
            >
              <BsArrowLeft className="text-xs" /> View Site
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/[0.08] border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 text-sm font-medium cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
            >
              <BsBoxArrowRight className="text-xs" /> Logout
            </button>
          </div>
        </div>

        {/* Tab System - Sleek Capsule Pill Style */}
        <div className="flex gap-1.5 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "projects"
                ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                : "text-[#ececec]/50 hover:text-[#ececec] hover:bg-white/[0.02] border border-transparent"
            }`}
          >
            Manage Projects
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "hero"
                ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                : "text-[#ececec]/50 hover:text-[#ececec] hover:bg-white/[0.02] border border-transparent"
            }`}
          >
            Hero & Socials
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "about"
                ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                : "text-[#ececec]/50 hover:text-[#ececec] hover:bg-white/[0.02] border border-transparent"
            }`}
          >
            About Profile
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "skills"
                ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                : "text-[#ececec]/50 hover:text-[#ececec] hover:bg-white/[0.02] border border-transparent"
            }`}
          >
            Manage Skills
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "resume"
                ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                : "text-[#ececec]/50 hover:text-[#ececec] hover:bg-white/[0.02] border border-transparent"
            }`}
          >
            Manage Resume
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "messages"
                ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
                : "text-[#ececec]/50 hover:text-[#ececec] hover:bg-white/[0.02] border border-transparent"
            }`}
          >
            Inbox Messages
          </button>
        </div>

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-6 rounded-3xl shadow-xl">
              <div className="text-base font-medium text-[#ececec]/80">
                Total Projects: <span className="bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-lg text-sm font-bold text-white ml-1.5">{projects.length}</span>
              </div>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all duration-300 text-sm font-bold shadow-lg shadow-[#ececec]/5 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
              >
                <BsPlusLg className="text-xs" /> Add New Project
              </button>
            </div>

            {/* Projects Listing */}
            {loading ? (
              <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-20 rounded-[2rem] text-center shadow-xl flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-2 border-white/40 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-[#ececec]/60">Fetching project grid system...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-16 rounded-[2rem] text-center shadow-xl space-y-4">
                <BsFolderSymlink className="text-4xl mx-auto text-white/20" />
                <p className="text-[#ececec]/60 text-base">No active projects stored in database.</p>
                <button
                  onClick={handleOpenAdd}
                  className="px-5 py-2.5 bg-white/10 border border-white/5 hover:bg-white/15 rounded-xl transition-all text-sm font-semibold cursor-pointer"
                >
                  Add First Project
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/[0.06] text-xs font-semibold text-[#ececec]/60 tracking-wider uppercase">
                        <th className="px-6 py-4.5">Preview</th>
                        <th className="px-6 py-4.5">Project Title</th>
                        <th className="px-6 py-4.5">Category</th>
                        <th className="px-6 py-4.5">Repository</th>
                        <th className="px-6 py-4.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                              <img
                                src={project.image_url || "/assets/img/favicon.png"}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100/png";
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-white truncate max-w-[200px]">
                            {project.title}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <span className="px-2.5 py-1 bg-white/[0.04] rounded-md border border-white/5 text-[#ececec]/80">
                              {project.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#ececec]/60 max-w-[150px] truncate">
                            {project.github_url && project.github_url !== "#" ? (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:text-white hover:underline transition-colors text-xs"
                              >
                                <BsGithub className="text-sm" /> Code Repo
                              </a>
                            ) : (
                              <span className="text-white/20 italic text-xs">No repository</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => router.push(`/admin/view?id=${project.id}`)}
                                className="p-2 bg-white/[0.02] border border-white/10 hover:border-amber-400/50 text-[#ececec]/70 hover:text-amber-400 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                                title="Manage Contents"
                              >
                                <BsFileEarmarkText className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(project)}
                                className="p-2 bg-white/[0.02] border border-white/10 hover:border-white/30 text-[#ececec]/70 hover:text-white rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                                title="Edit Item"
                              >
                                <BsPencilSquare className="text-sm" />
                              </button>
                              <button
                                onClick={() => handleDelete(project.id, project.title)}
                                className="p-2 bg-red-500/[0.02] border border-red-500/10 hover:border-red-500/40 text-red-400/80 hover:text-red-400 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
                                title="Delete Item"
                              >
                                <BsTrash className="text-sm" />
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
        )}

        {/* TAB 2: HERO & SOCIALS */}
        {activeTab === "hero" && (
          <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Hero & Configuration</h2>
              <p className="text-xs text-[#ececec]/60">Customize your presentation header, typewriter strings, and primary links.</p>
            </div>

            {profileError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center">{profileError}</div>
            )}
            {profileSuccess && (
              <div className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 py-3 px-4 rounded-xl text-center">{profileSuccess}</div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ececec]/40 border-b border-white/5 pb-2">Hero Copywriting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Greeting Title</label>
                    <input
                      type="text"
                      value={profileForm.hero_title}
                      onChange={(e) => setProfileForm({ ...profileForm, hero_title: e.target.value })}
                      placeholder="e.g. Hello World"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Display Name</label>
                    <input
                      type="text"
                      value={profileForm.hero_name}
                      onChange={(e) => setProfileForm({ ...profileForm, hero_name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Typewriter Words (separated by comma)</label>
                  <input
                    type="text"
                    value={profileForm.typewriter_words_str}
                    onChange={(e) => setProfileForm({ ...profileForm, typewriter_words_str: e.target.value })}
                    placeholder="e.g. Software Engineer, UI Designer, Analyst"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                    required
                    />
                  <p className="text-[11px] text-[#ececec]/40 pl-0.5">Provide tags comma-separated to render continuous animation lines on header script.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Subheading Narrative</label>
                  <textarea
                    value={profileForm.hero_description}
                    onChange={(e) => setProfileForm({ ...profileForm, hero_description: e.target.value })}
                    placeholder="Brief intro narrative summary..."
                    rows={4}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300 resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              {/* SOCIAL LINKS SETTINGS */}
              <div className="space-y-5 border-t border-white/5 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ececec]/40 border-b border-white/5 pb-2">Social Network Channels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5 flex items-center gap-1.5"><BsGithub /> GitHub Profile</label>
                    <input
                      type="text"
                      value={profileForm.github_url}
                      onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5 flex items-center gap-1.5"><BsLinkedin /> LinkedIn Network</label>
                    <input
                      type="text"
                      value={profileForm.linkedin_url}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5 flex items-center gap-1.5"><BsInstagram /> Instagram Handle</label>
                    <input
                      type="text"
                      value={profileForm.instagram_url}
                      onChange={(e) => setProfileForm({ ...profileForm, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all duration-300 text-sm font-bold disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5 cursor-pointer"
                >
                  {savingProfile ? "Processing Records..." : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: ABOUT PROFILE */}
        {activeTab === "about" && (
          <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">About Matrix Profile</h2>
              <p className="text-xs text-[#ececec]/60">Modify biographic details, manage storage assets avatar representations, and localization variables.</p>
            </div>

            {profileError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center">{profileError}</div>
            )}
            {profileSuccess && (
              <div className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 py-3 px-4 rounded-xl text-center">{profileSuccess}</div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-6">
                
                {/* Profile Photo Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0 relative shadow-inner">
                    {profileForm.about_image_url ? (
                      <img
                        src={profileForm.about_image_url}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">Empty Matrix</div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <label className="block text-xs font-semibold text-[#ececec]/70">Profile Avatar Asset</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="block w-full text-xs text-[#ececec]/40 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer transition-all duration-300"
                    />
                    {uploadingImage && <p className="text-xs text-yellow-400 animate-pulse">Uploading file asset into bucket store...</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Biographic Fullname</label>
                    <input
                      type="text"
                      value={profileForm.about_name}
                      onChange={(e) => setProfileForm({ ...profileForm, about_name: e.target.value })}
                      placeholder="Fullname..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Professional Role Title</label>
                    <input
                      type="text"
                      value={profileForm.about_title}
                      onChange={(e) => setProfileForm({ ...profileForm, about_title: e.target.value })}
                      placeholder="e.g. Lead Systems Engineer"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Communication Email</label>
                    <input
                      type="email"
                      value={profileForm.about_email}
                      onChange={(e) => setProfileForm({ ...profileForm, about_email: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Contact Line Phone</label>
                    <input
                      type="text"
                      value={profileForm.about_phone}
                      onChange={(e) => setProfileForm({ ...profileForm, about_phone: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Localization Location</label>
                    <input
                      type="text"
                      value={profileForm.about_location}
                      onChange={(e) => setProfileForm({ ...profileForm, about_location: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Google Maps URL String</label>
                  <input
                    type="url"
                    value={profileForm.about_maps_url}
                    onChange={(e) => setProfileForm({ ...profileForm, about_maps_url: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Section Punchline Heading</label>
                  <input
                    type="text"
                    value={profileForm.about_heading}
                    onChange={(e) => setProfileForm({ ...profileForm, about_heading: e.target.value })}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Bio Narrative Block 1</label>
                  <textarea
                    value={profileForm.about_bio_1}
                    onChange={(e) => setProfileForm({ ...profileForm, about_bio_1: e.target.value })}
                    rows={4}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300 resize-none"
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Bio Narrative Block 2</label>
                  <textarea
                    value={profileForm.about_bio_2}
                    onChange={(e) => setProfileForm({ ...profileForm, about_bio_2: e.target.value })}
                    rows={4}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300 resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all duration-300 text-sm font-bold disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5 cursor-pointer"
                >
                  {savingProfile ? "Processing Changes..." : "Save Bio Dataset"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: MANAGE SKILLS */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-6 rounded-3xl shadow-xl">
              <div className="text-base font-medium text-[#ececec]/80">
                Total Skills Stack: <span className="bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-lg text-sm font-bold text-white ml-1.5">{skills.length}</span>
              </div>
              <button
                onClick={handleOpenAddSkill}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all duration-300 text-sm font-bold shadow-lg shadow-[#ececec]/5 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
              >
                <BsPlusLg className="text-xs" /> Add New Skill Descriptor
              </button>
            </div>

            {/* Skills Listing */}
            {skillsLoading ? (
              <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-20 rounded-[2rem] text-center shadow-xl flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-2 border-white/40 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-[#ececec]/60">Fetching framework metric stacks...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-16 rounded-[2rem] text-center shadow-xl space-y-4">
                <BsFolderSymlink className="text-4xl mx-auto text-white/20" />
                <p className="text-[#ececec]/60 text-base">No functional metrics initialized.</p>
                <button
                  onClick={handleOpenAddSkill}
                  className="px-5 py-2.5 bg-white/10 border border-white/5 hover:bg-white/15 rounded-xl transition-all text-sm font-semibold cursor-pointer"
                >
                  Create Metric Descriptor
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/[0.06] text-xs font-semibold text-[#ececec]/60 tracking-wider uppercase">
                        <th className="px-6 py-4.5">Skill Identity</th>
                        <th className="px-6 py-4.5">Classification Tag</th>
                        <th className="px-6 py-4.5">Performance Range</th>
                        <th className="px-6 py-4.5">Tooltip Metadata</th>
                        <th className="px-6 py-4.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {skills.map((skill) => (
                        <tr key={skill.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">{skill.name}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className="px-2.5 py-1 bg-white/[0.04] rounded-md border border-white/5 text-[#ececec]/80">
                              {skill.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-white">
                            <div className="flex items-center gap-3">
                              <span className="w-8 tracking-tighter">{skill.percentage}%</span>
                              <div className="w-20 h-[5px] bg-white/5 border border-white/[0.02] rounded-full overflow-hidden hidden sm:block">
                                <div className="h-full bg-gradient-to-r from-white/20 to-[#ececec] rounded-full transition-all duration-500" style={{ width: `${skill.percentage}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-[#ececec]/50 max-w-xs truncate" title={skill.tooltip}>
                            {skill.tooltip || <span className="text-white/20 italic">No description</span>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleOpenEditSkill(skill)}
                                className="p-2 bg-white/[0.02] border border-white/10 hover:border-white/30 text-[#ececec]/70 hover:text-white rounded-xl transition-all duration-300 cursor-pointer"
                              >
                                <BsPencilSquare className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(skill.id, skill.name)}
                                className="p-2 bg-red-500/[0.02] border border-red-500/10 hover:border-red-500/40 text-red-400/80 hover:text-red-400 rounded-xl transition-all duration-300 cursor-pointer"
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
              </div>
            )}
          </div>
        )}

        {/* RESUME TAB */}
        {activeTab === "resume" && (
          <div className="space-y-8">
            {/* Resume Profile Form */}
            <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white">Resume Structural Info</h2>
                <p className="text-xs text-[#ececec]/60">Customize secondary summary statements, localization records, and direct curriculum parameters.</p>
              </div>

              {resumeError && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center">{resumeError}</div>
              )}
              {resumeSuccess && (
                <div className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 py-3 px-4 rounded-xl text-center">{resumeSuccess}</div>
              )}

              <form onSubmit={handleSaveResumeProfile} className="space-y-6">
                {/* Image Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0 relative shadow-inner">
                    {resumeProfile.image_url ? (
                      <img
                        src={resumeProfile.image_url}
                        alt="Resume Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">No Image Asset</div>
                    )}
                  </div>
                  <div className="space-y-2 flex-1 w-full">
                    <label className="block text-xs font-semibold text-[#ececec]/70">Curriculum Meta Avatar / Animated Canvas</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleResumeImgUpload}
                      disabled={uploadingResumeImg}
                      className="block w-full text-xs text-[#ececec]/40 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer transition-all duration-300"
                    />
                    {uploadingResumeImg && <p className="text-xs text-yellow-400 animate-pulse">Streaming file package into server storage...</p>}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Resume Summary Paragraph</label>
                  <textarea
                    value={resumeProfile.summary}
                    onChange={(e) => setResumeProfile({ ...resumeProfile, summary: e.target.value })}
                    placeholder="Brief resume objective synthesis statement..."
                    rows={3}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300 resize-none"
                    required
                  ></textarea>
                </div>

                {/* Contacts grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Regional Location</label>
                    <input
                      type="text"
                      value={resumeProfile.location}
                      onChange={(e) => setResumeProfile({ ...resumeProfile, location: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Mailing Endpoint</label>
                    <input
                      type="email"
                      value={resumeProfile.email}
                      onChange={(e) => setResumeProfile({ ...resumeProfile, email: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Phone System Digits</label>
                    <input
                      type="text"
                      value={resumeProfile.phone}
                      onChange={(e) => setResumeProfile({ ...resumeProfile, phone: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={savingResumeProfile}
                    className="px-6 py-3 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all duration-300 text-sm font-bold disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5 cursor-pointer"
                  >
                    {savingResumeProfile ? "Syncing Workspace..." : "Commit Structure Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* Resume Technical Skills CRUD */}
            <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold text-white">Technical Sidebar Matrix</h2>
                  <p className="text-xs text-[#ececec]/60">Manage direct technical performance ratios visible explicitly in sidebar configurations.</p>
                </div>
                <button
                  onClick={handleOpenAddResumeSkill}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all duration-300 text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
                >
                  <BsPlusLg className="text-[10px]" /> Add Resume Metric
                </button>
              </div>

              {resumeLoading ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : resumeSkills.length === 0 ? (
                <p className="text-xs text-[#ececec]/40 text-center py-4 italic">No sidebar credentials available.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.01]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5 text-xs font-semibold text-[#ececec]/50">
                        <th className="px-6 py-3">Metric Signature</th>
                        <th className="px-6 py-3">Scale Dimension</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-xs">
                      {resumeSkills.map((sk) => (
                        <tr key={sk.id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-3 font-semibold text-white">{sk.name}</td>
                          <td className="px-6 py-3 text-[#ececec]/80 font-medium">{sk.percentage}%</td>
                          <td className="px-6 py-3">
                            <div className="flex justify-center items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditResumeSkill(sk)}
                                className="p-2 bg-white/[0.02] border border-white/10 hover:border-white/30 text-[#ececec]/70 hover:text-white rounded-lg transition-all cursor-pointer"
                              >
                                <BsPencilSquare className="text-[11px]" />
                              </button>
                              <button
                                onClick={() => handleDeleteResumeSkill(sk.id, sk.name)}
                                className="p-2 bg-red-500/[0.02] border border-red-500/10 hover:border-red-500/40 text-red-400/80 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                              >
                                <BsTrash className="text-[11px]" />
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
            <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold text-white">Chronological Milestones</h2>
                  <p className="text-xs text-[#ececec]/60">Manage educational histories, corporate experiences, and credential pathways.</p>
                </div>
                <button
                  onClick={handleOpenAddResumeItem}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all duration-300 text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
                >
                  <BsPlusLg className="text-[10px]" /> Append Milestone Block
                </button>
              </div>

              {resumeLoading ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : resumeItems.length === 0 ? (
                <p className="text-xs text-[#ececec]/40 text-center py-4 italic">No timeline arrays configured.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.01]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5 text-xs font-semibold text-[#ececec]/50">
                        <th className="px-6 py-3">Context Classification</th>
                        <th className="px-6 py-3">Block Title</th>
                        <th className="px-6 py-3">Host Entity / Instansi</th>
                        <th className="px-6 py-3">Time Period</th>
                        <th className="px-6 py-3">Order Index</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-xs">
                      {resumeItems.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.01]">
                          <td className="px-6 py-3">
                            <span className="px-2 py-0.5 bg-white/[0.04] border border-white/5 rounded text-[10px] uppercase font-medium text-[#ececec]/80">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-semibold text-white truncate max-w-[150px]" title={item.title}>
                            {item.title}
                          </td>
                          <td className="px-6 py-3 text-[#ececec]/70 truncate max-w-[150px]" title={item.subtitle}>
                            {item.subtitle || <span className="text-white/10 italic">-</span>}
                          </td>
                          <td className="px-6 py-3 text-[#ececec]/60">{item.period || <span className="text-white/10 italic">-</span>}</td>
                          <td className="px-6 py-3 text-white/50">{item.order_index}</td>
                          <td className="px-6 py-3">
                            <div className="flex justify-center items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditResumeItem(item)}
                                className="p-2 bg-white/[0.02] border border-white/10 hover:border-white/30 text-[#ececec]/70 hover:text-white rounded-lg transition-all cursor-pointer"
                              >
                                <BsPencilSquare className="text-[11px]" />
                              </button>
                              <button
                                onClick={() => handleDeleteResumeItem(item.id, item.title)}
                                className="p-2 bg-red-500/[0.02] border border-red-500/10 hover:border-red-500/40 text-red-400/80 hover:text-red-400 rounded-lg transition-all cursor-pointer"
                              >
                                <BsTrash className="text-[11px]" />
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

        {/* MESSAGES / INBOX TAB */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-6 rounded-3xl shadow-xl">
              <div className="text-base font-medium text-[#ececec]/80">
                Inbox Feed Transactions: <span className="bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-lg text-sm font-bold text-white ml-1.5">{contacts.length}</span>
              </div>
              <button
                onClick={fetchContacts}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all text-xs font-semibold cursor-pointer w-full sm:w-auto"
              >
                Refresh Data Feed
              </button>
            </div>

            {contactsLoading ? (
              <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-20 rounded-[2rem] text-center shadow-xl flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-2 border-white/40 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-[#ececec]/60">Streaming encrypted transmission vectors...</p>
              </div>
            ) : contactsError ? (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-4 px-6 rounded-xl text-center">{contactsError}</div>
            ) : contacts.length === 0 ? (
              <div className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] border border-white/[0.06] p-16 rounded-[2rem] text-center shadow-xl space-y-4">
                <BsEnvelope className="text-4xl mx-auto text-white/10" />
                <p className="text-[#ececec]/40 text-sm">Communication channel queue clear.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-gradient-to-b from-[#242424] to-[#1c1c1c] p-6 rounded-2xl border border-white/[0.06] hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-bold text-white font-ubuntu">{contact.name}</h3>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-xs text-[#ececec]/50 hover:text-white hover:underline transition-colors break-all"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <span className="text-[10px] font-medium text-white/40 tracking-tight whitespace-nowrap bg-white/[0.03] px-2.5 py-1 rounded border border-white/5">
                          {new Date(contact.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>

                      <div className="border-t border-white/5 pt-3.5 space-y-1.5">
                        <div className="text-[11px] font-bold text-[#ececec]/40 uppercase tracking-widest">
                          Subject Context: <span className="text-[#ececec]/90 normal-case tracking-normal ml-1 font-medium">{contact.subject}</span>
                        </div>
                        <p className="text-xs text-[#ececec]/80 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 whitespace-pre-wrap break-words mt-2 font-mono">
                          {contact.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-white/[0.03]">
                      <button
                        onClick={() => handleDeleteContact(contact.id, contact.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-500/[0.02] border border-red-500/10 hover:bg-red-500 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                      >
                        <BsTrash className="text-xs" /> Discard Transmission
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Resume Skill Modal */}
      {isResumeSkillModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingResumeSkill ? "Modify Technical Skill" : "Initialize Technical Skill"}
              </h3>
              <p className="text-xs text-[#ececec]/60 mt-1">Configure individual performance thresholds for metrics layout.</p>
            </div>

            {resumeSkillError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl text-center">{resumeSkillError}</div>
            )}

            <form onSubmit={handleSaveResumeSkill} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Skill Label</label>
                <input
                  type="text"
                  value={resumeSkillFormData.name}
                  onChange={(e) => setResumeSkillFormData({ ...resumeSkillFormData, name: e.target.value })}
                  placeholder="e.g. Next.js Runtime"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5 flex justify-between">
                  <span>Performance Magnitude</span>
                  <span className="text-white font-mono">{resumeSkillFormData.percentage}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={resumeSkillFormData.percentage}
                  onChange={(e) => setResumeSkillFormData({ ...resumeSkillFormData, percentage: Number(e.target.value) })}
                  className="w-full accent-white bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsResumeSkillModalOpen(false)}
                  className="px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResumeSkill}
                  className="px-5 py-2.5 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {savingResumeSkill ? "Processing..." : "Commit Metric"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resume Item Modal */}
      {isResumeItemModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingResumeItem ? "Modify Timeline Node" : "Append Timeline Node"}
              </h3>
              <p className="text-xs text-[#ececec]/60 mt-1">Configure functional chronologies or verification badges metrics layout.</p>
            </div>

            {resumeItemError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl text-center">{resumeItemError}</div>
            )}

            <form onSubmit={handleSaveResumeItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Classification Type</label>
                  <select
                    value={resumeItemFormData.type}
                    onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, type: e.target.value as any })}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none cursor-pointer"
                  >
                    <option value="education">Education</option>
                    <option value="experience">Experience</option>
                    <option value="certification">Certification</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Sequence Order</label>
                  <input
                    type="number"
                    value={resumeItemFormData.order_index}
                    onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, order_index: Number(e.target.value) })}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Descriptor Title</label>
                <input
                  type="text"
                  value={resumeItemFormData.title}
                  onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, title: e.target.value })}
                  placeholder="e.g. Master of Engineering"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Host Enterprise / Organization</label>
                <input
                  type="text"
                  value={resumeItemFormData.subtitle}
                  onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, subtitle: e.target.value })}
                  placeholder="e.g. Stanford University"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Temporal Range Period</label>
                <input
                  type="text"
                  value={resumeItemFormData.period}
                  onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, period: e.target.value })}
                  placeholder="e.g. 2024 - Present"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">
                  Analytical Narrative Summary {resumeItemFormData.type === "experience" && "(\\n for linebreaks)"}
                </label>
                <textarea
                  value={resumeItemFormData.description}
                  onChange={(e) => setResumeItemFormData({ ...resumeItemFormData, description: e.target.value })}
                  placeholder="Core operational roles summaries..."
                  rows={4}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2.5 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsResumeItemModalOpen(false)}
                  className="px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingResumeItem}
                  className="px-5 py-2.5 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {savingResumeItem ? "Processing..." : "Commit Node"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal - Add / Edit Form */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingSkill ? "Modify Skill Matrix" : "Initialize New Skill Matrix"}
              </h3>
              <p className="text-xs text-[#ececec]/60 mt-1">
                {editingSkill ? "Update designated record sets currently bound to layout." : "Append fresh visual vector stack data directly."}
              </p>
            </div>

            {skillError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl text-center">{skillError}</div>
            )}

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Skill Identity Token</label>
                <input
                  type="text"
                  value={skillFormData.name}
                  onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                  placeholder="e.g. Next.js Architecture"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Classification Context</label>
                <select
                  value={skillFormData.category}
                  onChange={(e) => setSkillFormData({ ...skillFormData, category: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none cursor-pointer"
                >
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Back-end Development">Back-end Development</option>
                  <option value="UI/UX & Frontend Development">UI/UX & Frontend Development</option>
                  <option value="Data Analyst Tools">Data Analyst Tools</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5 flex justify-between">
                  <span>Relative Power Ratio</span>
                  <span className="text-white font-mono">{skillFormData.percentage}%</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillFormData.percentage}
                    onChange={(e) => setSkillFormData({ ...skillFormData, percentage: Number(e.target.value) })}
                    className="flex-1 accent-white bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skillFormData.percentage}
                    onChange={(e) => setSkillFormData({ ...skillFormData, percentage: Math.min(100, Math.max(0, Number(e.target.value))) })}
                    className="w-16 bg-white/[0.02] border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-center text-white focus:border-white/30 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Metadata Tooltip Strings</label>
                <textarea
                  value={skillFormData.tooltip}
                  onChange={(e) => setSkillFormData({ ...skillFormData, tooltip: e.target.value })}
                  placeholder="Context explicit micro copy strings on hover overlays..."
                  rows={3}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2.5 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={skillSaving}
                  className="px-5 py-2.5 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {skillSaving ? "Processing..." : "Commit Matrix Stack"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Add / Edit Form (Projects) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex justify-center items-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                {editingProject ? "Modify Project Record" : "Initialize New Project"}
              </h3>
              <p className="text-xs text-[#ececec]/60 mt-1">
                {editingProject ? "Update existing deployment definitions stored within database models." : "Deploy a fresh production artifact model token entry."}
              </p>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl text-center">{error}</div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Project Signature Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Enterprise Neural Dashboard"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 focus:ring-4 focus:ring-white/[0.02] outline-none transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Technology Domain Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-white/30 outline-none cursor-pointer"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Etc">Etc</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#ececec]/70 pl-0.5">Visual Preview Canvas Asset</label>
                
                {/* Image Preview */}
                {formData.image_url && (
                  <div className="w-full h-28 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative mb-2">
                    <img
                      src={formData.image_url}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm border border-white/5 px-2 py-1 rounded text-[9px] text-white/60 max-w-[180px] truncate" title={formData.image_url}>
                      Model: {formData.image_url.split('/').pop()}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProjectImgUpload}
                  disabled={uploadingProjectImg}
                  required={!formData.image_url}
                  className="block w-full text-xs text-[#ececec]/40 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer disabled:opacity-40 transition-all duration-300"
                />
                
                {uploadingProjectImg && (
                  <p className="text-xs text-yellow-400 pl-0.5 animate-pulse">Streaming heavy raster array onto bucket nodes...</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Remote Repository Connection URL (Optional)</label>
                <input
                  type="text"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#ececec]/70 pl-0.5">Technical Features Stack Narrative</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Elaborate functional design requirements, dependencies, architecture parameters..."
                  rows={4}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:bg-white/[0.04] focus:border-white/30 outline-none transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2.5 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-all text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#ececec] text-[#1f1f1f] hover:bg-white rounded-xl transition-all text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Processing..." : "Commit Artifact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}