/**
 * Top Navigation Bar - FloodMapper AI
 * Case Study: Trishuli River Corridor, Nepal (27.80° N, 85.00° E)
 *
 * Attributions:
 * - "Contains modified Copernicus Sentinel data 2026."
 * - "© OpenStreetMap contributors."
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NavbarProps {
  title?: string;
  onMobileMenuToggle: () => void;
}

export default function Navbar({
  title = "Flood Damage Overview",
  onMobileMenuToggle,
}: NavbarProps) {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("analyst@floodmapper.ai");
  const [userName, setUserName] = useState("Elena Vance");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("floodmapper_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) setUserEmail(parsed.email);
        if (parsed.name) setUserName(parsed.name);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("floodmapper_user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between transition-all">
      {/* Left Section: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="hidden md:block text-xs text-slate-400">
            Trishuli River Corridor, Nepal • Multimodal SAR & OSM Inundation Assessment
          </p>
        </div>
      </div>

      {/* Right Section: Notification & User Dropdown */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Live Status indicator */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mr-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>SAR Ingest: 2026-08-28</span>
        </div>

        {/* Component 8: Nepali Language Toggle [EN | ने] */}
        <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold mr-1">
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-1 rounded-lg transition-all text-xs flex items-center gap-1 ${
              language === "en" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
            }`}
            title="English"
          >
            <Globe className="w-3 h-3 text-indigo-600" />
            <span>EN</span>
          </button>
          <button
            onClick={() => setLanguage("ne")}
            className={`px-2 py-1 rounded-lg transition-all text-xs flex items-center gap-1 ${
              language === "ne" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
            }`}
            title="नेपाली भाषा"
          >
            <span>ने</span>
          </button>
        </div>

        {/* Notifications Icon with Red Dot */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Red alert badge dot */}
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Critical Alerts (3)
                </span>
                <span className="text-[10px] text-indigo-600 font-medium hover:underline cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2 mt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-slate-700">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-700 mb-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Cut-off Detected</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Village cluster in Sector 4 is isolated due to primary route submergence.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-slate-700">
                  <p className="font-semibold text-amber-800 mb-0.5">Water Level Spike</p>
                  <p className="text-[11px] text-slate-600">
                    SAR backscatter drop detected across 14.8 sq km floodplain.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              {userName.charAt(0)}
            </div>
            <span className="hidden lg:block text-xs font-semibold text-slate-700 max-w-[120px] truncate">
              {userName}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{userName}</p>
                <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
              </div>

              <div className="py-1 text-xs text-slate-600">
                <a
                  href="#profile"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile Settings</span>
                </a>
                <a
                  href="https://copernicus.eu"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copernicus Hub</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Ext</span>
                </a>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
