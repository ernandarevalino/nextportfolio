"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

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
  title: string;
  category: string;
  image_url: string;
  github_url?: string;
  details?: string;
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
    title: string;
    category: string;
    image_url: string;
    github_url?: string;
    details?: string;
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
    const { error } = await supabase.from("projects").delete().eq("id", id);

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
  hero_title: string;
  hero_name: string;
  hero_description: string;
  typewriter_words: string[];
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  about_image_url?: string;
  about_name?: string;
  about_title?: string;
  about_email?: string;
  about_phone?: string;
  about_location?: string;
  about_maps_url?: string;
  about_heading?: string;
  about_bio_1?: string;
  about_bio_2?: string;
}) {
  try {
    const { error } = await supabase
      .from("profile")
      .update(data)
      .eq("id", 1);

    if (error) {
      console.error("Error updating profile in updateProfile action:", error);
      return { success: false, error: error.message };
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
  tooltip?: string;
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
    tooltip?: string;
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
  summary: string;
  location: string;
  email: string;
  phone: string;
  image_url: string;
}) {
  try {
    const { error } = await supabase
      .from("resume_profile")
      .upsert({ id: 1, ...data });

    if (error) {
      console.error("Error updating resume profile:", error);
      return { success: false, error: error.message };
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
  title: string;
  subtitle: string;
  period: string;
  description: string;
  order_index: number;
}) {
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
    title: string;
    subtitle: string;
    period: string;
    description: string;
    order_index: number;
  }
) {
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
