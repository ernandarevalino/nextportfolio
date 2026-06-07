"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function loginAction(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.session) {
    const accessToken = data.session.access_token;
    const expiresIn = data.session.expires_in || 3600;
    const cookieStore = await cookies();
    
    cookieStore.set("sb-access-token", accessToken, {
      path: "/",
      maxAge: expiresIn,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // <--- GANTI INI
    });
  }

  return { success: true };
}

export async function logoutAction() {
  const { error } = await supabase.auth.signOut();
  
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
