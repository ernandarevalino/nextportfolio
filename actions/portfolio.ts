"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

function getStoragePathFromUrl(url: string | null | undefined, bucketName: string = "portfolio"): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucketName}/`;
  const index = url.indexOf(marker);
  if (index !== -1) {
    return url.substring(index + marker.length);
  }
  return null;
}

export async function getProjects() {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching projects in getProjects action:", error);
      return { success: false, error: error.message, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error("Exception in getProjects action:", err);
    return { success: false, error: err.message, data: [] };
  }
}

export async function createProject(data: {
  title_id: string;
  title_en: string;
  category: string;
  image_url: string;
  github_url?: string;
  details_id?: string;
  details_en?: string;
}) {
  try {
    const { error } = await supabase.from("projects").insert([data]);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProject(
  id: number,
  data: {
    title_id: string;
    title_en: string;
    category: string;
    image_url: string;
    github_url?: string;
    details_id?: string;
    details_en?: string;
  }
) {
  try {
    const { error } = await supabase.from("projects").update(data).eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProject(id: number) {
  try {
    let pathsToDelete: string[] = [];
    try {
      const { data: project } = await supabase
        .from("projects")
        .select("image_url, gallery_urls")
        .eq("id", id)
        .maybeSingle();

      if (project) {
        if (project.image_url) {
          const mainPath = getStoragePathFromUrl(project.image_url);
          if (mainPath) pathsToDelete.push(mainPath);
        }
        if (project.gallery_urls && Array.isArray(project.gallery_urls)) {
          project.gallery_urls.forEach((url: string) => {
            const galleryPath = getStoragePathFromUrl(url);
            if (galleryPath) pathsToDelete.push(galleryPath);
          });
        }
      }
    } catch (fetchErr) {
      console.error("Error fetching project files for storage cleanup:", fetchErr);
    }

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    if (pathsToDelete.length > 0) {
      try {
        const { error: removeError } = await supabase.storage.from("portfolio").remove(pathsToDelete);
        if (removeError) {
          console.error("Supabase Storage removal error:", removeError);
        }
      } catch (storageErr) {
        console.error("Exception deleting project files from storage:", storageErr);
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const { error } = await supabase.from("contacts").insert([data]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getProfile() {
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error fetching profile in getProfile action:", error);
      return { success: false, error: error.message, data: null };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error("Exception in getProfile action:", err);
    return { success: false, error: err.message, data: null };
  }
}

export async function updateProfile(data: {
  hero_title_id: string;
  hero_title_en: string;
  hero_name: string;
  hero_description_id: string;
  hero_description_en: string;
  typewriter_words_id: string[];
  typewriter_words_en: string[];
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  about_image_url?: string;
  about_name?: string;
  about_title_id?: string;
  about_title_en?: string;
  about_email?: string;
  about_phone?: string;
  about_location_id?: string;
  about_location_en?: string;
  about_maps_url?: string;
  about_heading_id?: string;
  about_heading_en?: string;
  about_bio_1_id?: string;
  about_bio_1_en?: string;
  about_bio_2_id?: string;
  about_bio_2_en?: string;
}) {
  try {
    let oldImageUrl: string | null = null;
    try {
      const { data: currentProfile } = await supabase
        .from("profile")
        .select("about_image_url")
        .eq("id", 1)
        .maybeSingle();
      if (currentProfile) {
        oldImageUrl = currentProfile.about_image_url || null;
      }
    } catch (fetchErr) {
      console.error("Error fetching old profile image URL for storage cleanup:", fetchErr);
    }

    const { error } = await supabase
      .from("profile")
      .update(data)
      .eq("id", 1);

    if (error) {
      console.error("Error updating profile in updateProfile action:", error);
      return { success: false, error: error.message };
    }

    if (oldImageUrl && data.about_image_url && data.about_image_url !== oldImageUrl) {
      try {
        const oldPath = getStoragePathFromUrl(oldImageUrl);
        if (oldPath) {
          await supabase.storage.from("portfolio").remove([oldPath]);
        }
      } catch (storageErr) {
        console.error("Error removing old profile image from storage:", storageErr);
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Exception in updateProfile action:", err);
    return { success: false, error: err.message };
  }
}

export async function getSkills() {
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching skills in getSkills action:", error);
      return { success: false, error: error.message, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error("Exception in getSkills action:", err);
    return { success: false, error: err.message, data: [] };
  }
}

export async function createSkill(data: {
  name: string;
  category: string;
  percentage: number;
  tooltip_id?: string;
  tooltip_en?: string;
}) {
  try {
    const { error } = await supabase
      .from("skills")
      .insert([data]);

    if (error) {
      console.error("Error creating skill in createSkill action:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Exception in createSkill action:", err);
    return { success: false, error: err.message };
  }
}

export async function updateSkill(
  id: number,
  data: {
    name: string;
    category: string;
    percentage: number;
    tooltip_id?: string;
    tooltip_en?: string;
  }
) {
  try {
    const { error } = await supabase
      .from("skills")
      .update(data)
      .eq("id", id);

    if (error) {
      console.error("Error updating skill in updateSkill action:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Exception in updateSkill action:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteSkill(id: number) {
  try {
    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting skill in deleteSkill action:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Exception in deleteSkill action:", err);
    return { success: false, error: err.message };
  }
}

export async function getResumeData() {
  try {
    const [profileRes, skillsRes, itemsRes] = await Promise.all([
      supabase.from("resume_profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("resume_skills").select("*").order("id", { ascending: true }),
      supabase.from("resume_items").select("*").order("order_index", { ascending: true })
    ]);

    if (profileRes.error) {
      console.error("Error fetching resume_profile:", profileRes.error);
    }
    if (skillsRes.error) {
      console.error("Error fetching resume_skills:", skillsRes.error);
    }
    if (itemsRes.error) {
      console.error("Error fetching resume_items:", itemsRes.error);
    }

    return {
      success: true,
      data: {
        profile: profileRes.data || null,
        skills: skillsRes.data || [],
        items: itemsRes.data || []
      }
    };
  } catch (err: any) {
    console.error("Exception in getResumeData:", err);
    return {
      success: false,
      error: err.message,
      data: { profile: null, skills: [], items: [] }
    };
  }
}

export async function updateResumeProfile(data: {
  summary_id: string;
  summary_en: string;
  location: string;
  email: string;
  phone: string;
  image_url: string;
}) {
  try {
    let oldImageUrl: string | null = null;
    try {
      const { data: currentResume } = await supabase
        .from("resume_profile")
        .select("image_url")
        .eq("id", 1)
        .maybeSingle();
      if (currentResume) {
        oldImageUrl = currentResume.image_url || null;
      }
    } catch (fetchErr) {
      console.error("Error fetching old resume image URL for storage cleanup:", fetchErr);
    }

    const { error } = await supabase
      .from("resume_profile")
      .upsert({ id: 1, ...data });

    if (error) {
      console.error("Error updating resume profile:", error);
      return { success: false, error: error.message };
    }

    if (oldImageUrl && data.image_url && data.image_url !== oldImageUrl) {
      try {
        const oldPath = getStoragePathFromUrl(oldImageUrl);
        if (oldPath) {
          await supabase.storage.from("portfolio").remove([oldPath]);
        }
      } catch (storageErr) {
        console.error("Error removing old resume image from storage:", storageErr);
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Exception in updateResumeProfile:", err);
    return { success: false, error: err.message };
  }
}

export async function createResumeSkill(data: { name: string; percentage: number }) {
  try {
    const { error } = await supabase.from("resume_skills").insert([data]);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error in createResumeSkill:", err);
    return { success: false, error: err.message };
  }
}

export async function updateResumeSkill(id: number, data: { name: string; percentage: number }) {
  try {
    const { error } = await supabase.from("resume_skills").update(data).eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error in updateResumeSkill:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteResumeSkill(id: number) {
  try {
    const { error } = await supabase.from("resume_skills").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteResumeSkill:", err);
    return { success: false, error: err.message };
  }
}

export async function createResumeItem(data: {
  type: "education" | "experience" | "certification";
  title_id: string;
  title_en: string;
  subtitle_id: string;
  subtitle_en: string;
  period_id: string;
  period_en: string;
  description_id: string;
  description_en: string;
  order_index: number;
}) {
  "use server";
  try {
    const { error } = await supabase.from("resume_items").insert([data]);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error in createResumeItem:", err);
    return { success: false, error: err.message };
  }
}

export async function updateResumeItem(
  id: number,
  data: {
    type: "education" | "experience" | "certification";
    title_id: string;
    title_en: string;
    subtitle_id: string;
    subtitle_en: string;
    period_id: string;
    period_en: string;
    description_id: string;
    description_en: string;
    order_index: number;
  }
) {
  "use server";
  try {
    const { error } = await supabase.from("resume_items").update(data).eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error in updateResumeItem:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteResumeItem(id: number) {
  "use server";
  try {
    const { error } = await supabase.from("resume_items").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Error in deleteResumeItem:", err);
    return { success: false, error: err.message };
  }
}

export async function getContacts() {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching contacts in getContacts action:", error);
      return { success: false, error: error.message, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error("Exception in getContacts action:", err);
    return { success: false, error: err.message, data: [] };
  }
}

export async function deleteContact(id: number) {
  try {
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting contact in deleteContact action:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("Exception in deleteContact action:", err);
    return { success: false, error: err.message };
  }
}
