"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAction(email, password);

      if (!res.success) {
        throw new Error(res.error || "Invalid login credentials. Please try again.");
      }
      
      window.location.href = "/admin/dashboard"; 

    } catch (err: any) {
      console.log("Login failed (handled):", err.message); 
      setError(err.message || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-[#ececec] flex flex-col justify-center items-center px-4 font-sans relative overflow-hidden">
      {/* Decorative Premium Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2 z-0" />

      <div className="w-full max-w-md bg-gradient-to-b from-[#232323]/80 to-[#202020]/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] space-y-8 z-10 transition-all duration-500 hover:border-white/20">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-ubuntu text-[#ececec] tracking-tight">Admin Login</h2>
          <p className="text-sm text-[#ececec]/60">Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#ececec]/90 pl-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none text-[#ececec] transition-all duration-300 placeholder:text-white/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#ececec]/90 pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none text-[#ececec] transition-all duration-300 placeholder:text-white/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#ececec] to-white hover:from-white hover:to-[#ececec] text-[#1f1f1f] font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 disabled:opacity-50 cursor-pointer text-center tracking-wide"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-[#ececec]/40 hover:text-[#ececec] transition-all duration-300 inline-flex items-center gap-1.5 hover:underline">
            &larr; Back to Portfolio
          </a>
        </div>

      </div>
    </div>
  );
}
