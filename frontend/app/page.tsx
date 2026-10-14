"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Waves, ArrowRight, ShieldCheck, MapPin, Activity } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Quick auto-redirect if already authenticated
    const user = localStorage.getItem("floodmapper_user");
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl text-center space-y-6"
      >
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
          <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          Multimodal AI Hackathon 2026 • Track B
        </div>

        {/* Brand Icon & Heading */}
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Waves className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            FloodMapper <span className="text-indigo-600">AI</span>
          </h1>
        </div>

        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Rapid satellite-based flood extent mapping, building & road damage quantification,
          and village connectivity cut-off assessment powered by multimodal intelligence.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            Sign In to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 shadow-sm hover:shadow transition-all duration-200"
          >
            Create Hackathon Account
          </Link>
        </div>

        {/* Highlight Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 text-left">
          <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 shadow-sm">
            <MapPin className="w-5 h-5 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-slate-800 text-sm">Copernicus Sentinel-1</h3>
            <p className="text-xs text-slate-500 mt-1">Multi-temporal SAR interferometry & backscatter anomaly analysis</p>
          </div>
          <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 shadow-sm">
            <Activity className="w-5 h-5 text-rose-500 mb-2" />
            <h3 className="font-semibold text-slate-800 text-sm">Damage Estimation</h3>
            <p className="text-xs text-slate-500 mt-1">Overlay with OpenStreetMap critical infrastructure & road network</p>
          </div>
          <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="font-semibold text-slate-800 text-sm">Emergency Ready</h3>
            <p className="text-xs text-slate-500 mt-1">Instant situation reporting and cut-off village identification</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
