"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Waves, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    // Check stored user from localStorage
    const savedUserJson = localStorage.getItem("floodmapper_registered_user");
    let isValid = false;
    let activeUser = null;

    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        if (savedUser.email === email && savedUser.password === password) {
          isValid = true;
          activeUser = savedUser;
        }
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }

    // Also support default demo credentials for easy hackathon judging & testing
    if (!isValid && ((email === "demo@floodmapper.ai" && password === "hackathon2026") || (email === "admin@floodmapper.ai" && password === "admin123"))) {
      isValid = true;
      activeUser = {
        name: email.startsWith("admin") ? "Lead Responder" : "Dr. Elena Vance",
        email: email,
        role: "Emergency GIS Lead",
      };
    }

    if (isValid && activeUser) {
      // Store current authenticated session
      localStorage.setItem("floodmapper_user", JSON.stringify(activeUser));
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setLoading(false);
      setError("Invalid email or password. Please verify credentials or use demo fill.");
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: "demo@floodmapper.ai",
      password: "hackathon2026",
    });
    setError("");
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/70 via-white to-slate-100 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Waves className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                FloodMapper <span className="text-indigo-600">AI</span>
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to monitor real-time flood inundation & damage analytics
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@organization.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-indigo-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Quick Demo Fill for Hackathon Judges */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2 px-3 rounded-lg bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-indigo-100 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Quick Fill Demo Credentials (hackathon2026)
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
