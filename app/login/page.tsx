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
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col justify-center items-center px-4 font-sans">
      <div className="w-full max-w-md bg-[#232323] p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl space-y-8">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-ubuntu text-white">Admin Login</h2>
          <p className="text-sm text-[#ececec]/60">Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#ececec] pl-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#ececec] pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1f1f1f] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#ececec] focus:ring-1 focus:ring-[#ececec] outline-none text-white transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#ececec] text-[#310606] font-semibold rounded-full hover:bg-white hover:-translate-y-[2px] transition-all duration-300 disabled:opacity-50 cursor-pointer text-center"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center">
          <a href="/" className="text-xs text-[#ececec]/55 hover:text-white hover:underline transition-all">
            &larr; Back to Portfolio
          </a>
        </div>

      </div>
    </div>
  );
}
