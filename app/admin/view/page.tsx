"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  BsArrowLeft,
  BsCloudUpload,
  BsTrash,
  BsSave,
  BsFileEarmarkText,
  BsImage
} from "react-icons/bs";

interface Project {
  id: number;
  title_id: string;
  title_en: string;
  category: string;
  image_url: string;
  github_url: string;
  details_id: string;
  details_en: string;
  gallery_urls: string[];
}

function ViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [detailsId, setDetailsId] = useState("");
  const [detailsEn, setDetailsEn] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [sessionUploadedUrls, setSessionUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      setError("No project ID specified in URL.");
      setLoading(false);
    }
  }, [id]);

  async function fetchProject() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data) {
        setProject(data);
        setDetailsId(data.details_id || "");
        setDetailsEn(data.details_en || "");
        setGalleryUrls(data.gallery_urls || []);
      } else {
        throw new Error("Project not found.");
      }
    } catch (err: any) {
      console.error("Error fetching project:", err);
      setError(err.message || "Failed to load project from database.");
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const file = files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `project-${id}-${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      setGalleryUrls((prev) => [...prev, publicUrl]);
      setSessionUploadedUrls((prev) => [...prev, publicUrl]);
      setSuccess("Image uploaded successfully and added to gallery preview!");
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      // Reset target value so same file can be uploaded again
      e.target.value = "";
    }
  };

  const handleDeleteGalleryImage = (indexToRemove: number) => {
    setGalleryUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
    setSuccess("Image removed from preview. Remember to click 'Save Changes' to make it permanent!");
  };

  const insertToDetails = (url: string, target: "id" | "en") => {
    const caption = window.prompt("Masukkan Caption/Deskripsi Gambar:");
    if (caption === null) return; // User cancelled

    const markdown = `\n\n![${caption}](${url})\n\n`;
    if (target === "id") {
      setDetailsId((prev) => prev + markdown);
      setSuccess("Image inserted successfully into Indonesian article editor!");
    } else {
      setDetailsEn((prev) => prev + markdown);
      setSuccess("Image inserted successfully into English article editor!");
    }

    setTimeout(() => {
      setSuccess(null);
    }, 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          details_id: detailsId,
          details_en: detailsEn,
          gallery_urls: galleryUrls
        })
        .eq("id", id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // --- DIFF SYNC ON SAVE ---
      try {
        const originalUrls = project ? (project.gallery_urls || []) : [];
        const candidateUrls = [...originalUrls, ...sessionUploadedUrls];
        const urlsToDelete = candidateUrls.filter(url => !galleryUrls.includes(url));
        const uniqueUrlsToDelete = Array.from(new Set(urlsToDelete));

        if (uniqueUrlsToDelete.length > 0) {
          const pathsToDelete: string[] = [];
          const marker = "/storage/v1/object/public/portfolio/";

          uniqueUrlsToDelete.forEach(url => {
            const idxMarker = url.indexOf(marker);
            if (idxMarker !== -1) {
              pathsToDelete.push(url.substring(idxMarker + marker.length));
            }
          });

          if (pathsToDelete.length > 0) {
            const { error: removeError } = await supabase.storage
              .from("portfolio")
              .remove(pathsToDelete);
            if (removeError) {
              console.error("Error removing gallery files from storage:", removeError);
            }
          }
        }
      } catch (storageErr) {
        console.error("Exception in gallery storage cleanup sync:", storageErr);
      }

      // Reset tracking state
      setSessionUploadedUrls([]);
      // Update local state to match newly saved DB record
      if (project) {
        setProject({ ...project, gallery_urls: galleryUrls });
      }

      setSuccess("Changes saved successfully!");
      router.refresh();
    } catch (err: any) {
      console.error("Error updating project details:", err);
      setError(err.message || "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/60 text-sm">Loading project information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <BsFileEarmarkText /> CMS Artikel / Case Study
            </div>
            <h1 className="text-3xl font-bold font-ubuntu text-white">
              {project ? (project.title_id || project.title_en) : "Manage Content"}
            </h1>
            <p className="text-sm text-white/60">
              Update details article and manage supporting gallery images.
            </p>
          </div>
          
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 transition-all text-sm font-semibold cursor-pointer"
          >
            <BsArrowLeft /> Back to Dashboard
          </Link>
        </div>

        {/* Notifications */}
        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 py-3.5 px-5 rounded-xl text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 py-3.5 px-5 rounded-xl text-center">
            {success}
          </div>
        )}

        {/* Content & Forms */}
        {project && (
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Middle Column - Content Editor */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#232323] p-6 rounded-3xl border border-white/10 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h2 className="text-lg font-bold font-ubuntu text-white">Project Case Study Article</h2>
                  <span className="text-xs text-white/40">Markdown & Normal text supported</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/85">Article Details (ID)</label>
                  <textarea
                    value={detailsId}
                    onChange={(e) => setDetailsId(e.target.value)}
                    placeholder="Jelaskan proyek ini secara detail dalam Bahasa Indonesia..."
                    rows={10}
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-white transition-colors resize-y min-h-[200px] leading-relaxed"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/85">Article Details (EN)</label>
                  <textarea
                    value={detailsEn}
                    onChange={(e) => setDetailsEn(e.target.value)}
                    placeholder="Describe this project in detail in English..."
                    rows={10}
                    className="w-full bg-[#1f1f1f] border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-white transition-colors resize-y min-h-[200px] leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Right Column - Project Gallery & Settings */}
            <div className="space-y-6">
              
              {/* Image Gallery CMS Section */}
              <div className="bg-[#232323] p-6 rounded-3xl border border-white/10 space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h2 className="text-lg font-bold font-ubuntu text-white">Project Gallery</h2>
                  <p className="text-xs text-white/50 mt-0.5">Manage supporting screenshots or concept art.</p>
                </div>

                {/* File Upload Trigger */}
                <div className="relative border-2 border-dashed border-white/10 hover:border-amber-400/50 rounded-2xl p-6 transition-all text-center group cursor-pointer bg-[#1f1f1f]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-white/5 rounded-full text-white/60 group-hover:text-amber-400 transition-colors">
                      <BsCloudUpload className="text-2xl animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {uploading ? "Uploading Image..." : "Click or Drag to Upload"}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1">PNG, JPG, JPEG, WEBP</p>
                    </div>
                  </div>
                </div>

                {/* Uploading loading indicator */}
                {uploading && (
                  <div className="flex items-center gap-2 justify-center py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs">
                    <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    Uploading file to storage...
                  </div>
                )}

                {/* Images Preview List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-white/80">Gallery Previews ({galleryUrls.length})</h3>
                  {galleryUrls.length === 0 ? (
                    <div className="text-center py-8 bg-[#1f1f1f] rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-2 text-white/30">
                      <BsImage className="text-2xl" />
                      <p className="text-xs italic">No supporting images uploaded yet</p>
                    </div>
                  ) : (
                    /* max-h dinaikkan agar bisa menampung lebih banyak gambar ke bawah sebelum scroll */
                    <div className="grid grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1">
                      {galleryUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 group">
                          {/* Gambar tetap stabil */}
                          <img
                            src={url}
                            alt={`Gallery image ${idx + 1}`}
                            className="w-full h-full object-cover transition-all duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://placehold.co/150x100/png?text=Broken+Image";
                            }}
                          />
                          
                          {/* Hover Overlay: Layout rapi dengan padding yang presisi */}
                          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-2 z-10">
                            
                            {/* Baris Atas: Utilitas (View & Delete) */}
                            <div className="flex items-center justify-left gap-1 w-full">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-white/10 border border-white/10 hover:bg-white/25 text-white text-[10px] font-medium rounded-md transition-all whitespace-nowrap"
                              >
                                View
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryImage(idx)}
                                className="p-1.5 bg-red-500/20 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white rounded-md transition-colors cursor-pointer"
                                title="Delete from Gallery"
                              >
                                <BsTrash className="text-[11px]" />
                              </button>
                            </div>

                            {/* Baris Bawah: Injector CMS Menggunakan +ID dan +ENG (Lebih Ringkas & Simetris) */}
                            <div className="grid grid-cols-2 gap-1 w-full mt-1">
                              <button
                                type="button"
                                onClick={() => insertToDetails(url, "id")}
                                className="py-1 bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-bold rounded-md transition-all cursor-pointer text-center tracking-wider"
                                title="Insert ID"
                              >
                                +ID
                              </button>
                              <button
                                type="button"
                                onClick={() => insertToDetails(url, "en")}
                                className="py-1 bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-bold rounded-md transition-all cursor-pointer text-center tracking-wider"
                                title="Insert ENG"
                              >
                                +ENG
                              </button>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Save Panel */}
              <div className="bg-[#232323] p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-sm font-bold font-ubuntu text-white">Save CMS Changes</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Save all the modifications to your case study article text and images.
                </p>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-black rounded-full transition-all text-sm font-bold disabled:opacity-50 shadow-lg shadow-amber-400/15 cursor-pointer"
                >
                  <BsSave /> {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default function AdminViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/60 text-sm">Loading CMS editor...</p>
      </div>
    }>
      <ViewContent />
    </Suspense>
  );
}
