"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Waves, User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Store user information in localStorage for hackathon authentication
      const userPayload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: "Disaster Response Specialist",
        registeredAt: new Date().toISOString(),
      };

      localStorage.setItem("floodmapper_registered_user", JSON.stringify(userPayload));
      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      setError("Failed to save account to localStorage.");
      setLoading(false);
    }
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
            <h2 className="text-2xl font-bold text-slate-800">Create an Account</h2>
            <p className="text-sm text-slate-500 mt-1">
              Join Track B: Rapid Flood Damage Mapping & Infrastructure Assessment
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Account registered! Redirecting to login...
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

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
                  placeholder="analyst@disaster-response.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
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
              disabled={loading || success}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
