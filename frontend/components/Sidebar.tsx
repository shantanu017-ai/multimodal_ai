/**
 * Sidebar Navigation Component - FloodMapper AI
 * Case Study: Trishuli River Corridor, Nepal
 *
 * Attributions:
 * - "Contains modified Copernicus Sentinel data 2026."
 * - "© OpenStreetMap contributors."
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Building2,
  GitFork,
  FileText,
  LogOut,
  Waves,
  X,
  Shield,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Flood Map",
    href: "/dashboard/map",
    icon: Map,
    badge: "Live",
  },
  {
    name: "Damage Assessment",
    href: "/dashboard/damage",
    icon: Building2,
  },
  {
    name: "Cut-off Analysis",
    href: "/dashboard/connectivity",
    icon: GitFork,
  },
  {
    name: "Situation Report",
    href: "/dashboard/report",
    icon: FileText,
  },
];

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Elena Vance");
  const [userRole, setUserRole] = useState("Disaster GIS Lead");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("floodmapper_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setUserName(parsed.name);
        if (parsed.role) setUserRole(parsed.role);
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("floodmapper_user");
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200/80 text-slate-800">
      {/* Top Header / Brand Logo */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/80 bg-white/50 backdrop-blur-sm">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-300 group-hover:scale-105 transition-transform">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base">
                FloodMapper
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-100 text-indigo-700">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              TRACK B • TRISHULI NEPAL SAR
            </p>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200/60"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Operations & Analytics
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onMobileClose}
              className="relative block"
            >
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* Operational Status Box */}
        <div className="pt-6 px-2">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/90 to-blue-50/50 border border-indigo-100 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>SAR Ingest Active</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Trishuli River Corridor Sentinel-1 GRDH pipeline synchronized.
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Snippet & Logout */}
      <div className="p-4 border-t border-slate-200/80 bg-white/40">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-600/10 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-200">
              {getInitials(userName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                {userName}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">
                {userRole}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-30 shadow-subtle">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10"
          >
            {sidebarContent}
          </motion.aside>
        </div>
      )}
    </>
  );
}
