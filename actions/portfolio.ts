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
