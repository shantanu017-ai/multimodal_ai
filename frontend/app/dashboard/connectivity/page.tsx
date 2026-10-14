"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GitFork,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Navigation,
  Clock,
  MapPin,
  Users,
  Compass,
  AlertOctagon,
  ExternalLink,
} from "lucide-react";
import {
  checkConnectivity,
  getStoredConnectivity,
  extractVillagesAndHospitalFromOsm,
  type ConnectivityApiResponse,
  type VillageConnectivityItem,
} from "@/lib/connectivity";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ConnectivityPage() {
  const [data, setData] = useState<ConnectivityApiResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load existing analysis or execute initial dynamic calculation
  useEffect(() => {
    const saved = getStoredConnectivity();
    if (saved) {
      setData(saved);
    } else {
      executeLiveRouting();
    }
  }, []);

  const executeLiveRouting = async () => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      const { villages, hospital, hospitalName } = extractVillagesAndHospitalFromOsm(null);
      const res = await checkConnectivity(villages, hospital, hospitalName);
      setData(res);
    } catch (err: any) {
      setErrorMsg("Failed to complete real-time routing query.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Re-run Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <GitFork className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Cut-off & Connectivity Analysis
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dynamic OpenRouteService matrix routing to emergency referral healthcare centers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={executeLiveRouting}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Querying ORS API..." : "Recalculate Live Routes"}</span>
          </button>
        </div>
      </div>

      {/* Operational Status & Parameters Banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-slate-800">
              Routing Engine: {data?.routing_engine || "OpenRouteService Matrix API"}
            </p>
            <p className="text-slate-400">
              Threshold: &gt; 7200 sec (2 hrs) driving duration or severed road network = Cut-off
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Hospital: {data?.hospital_name || "Guwahati Emergency Referral Hospital"}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">
            {data?.cut_off_count ?? 0} Cut-off
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
            {data?.accessible_count ?? 0} Accessible
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main 2-Column Animated View: Cut-off (Red) vs Accessible (Green) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Cut-off Villages (RED) */}
        <div className="rounded-2xl bg-white border border-rose-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Identified Cut-Off Settlements
                </h3>
                <p className="text-xs text-rose-600 font-medium">
                  {data?.cut_off_count ?? 0} settlements isolated (Zero motorable access or &gt;2 hrs)
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-2xs">
              Critical Isolation
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={data?.timestamp || "cutoff-list"}
            className="space-y-3"
          >
            {(data?.cut_off_villages || []).map((v: VillageConnectivityItem) => (
              <motion.div
                key={v.name}
                variants={itemVariants}
                className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 flex flex-col gap-2 hover:bg-rose-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                      {v.id}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{v.name}</span>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                    {v.duration_formatted}
                  </span>
                </div>

                <p className="text-xs text-rose-700/90 leading-relaxed font-medium">
                  {v.reason}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-rose-100">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Est. Pop: {v.population || "850"}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>[{v.coordinates[0].toFixed(3)}, {v.coordinates[1].toFixed(3)}]</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!data || data.cut_off_villages.length === 0) && (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                No isolated settlements found. All nodes maintain road connection.
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Accessible Villages & Relief Corridors (GREEN) */}
        <div className="rounded-2xl bg-white border border-emerald-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Accessible Settlements & Corridors
                </h3>
                <p className="text-xs text-emerald-600 font-medium">
                  {data?.accessible_count ?? 0} settlements connected (&lt; 2 hours to hospital)
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-2xs">
              Passable Arteries
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={data?.timestamp || "access-list"}
            className="space-y-3"
          >
            {(data?.accessible_villages || []).map((v: VillageConnectivityItem) => (
              <motion.div
                key={v.name}
                variants={itemVariants}
                className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col gap-2 hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {v.id}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{v.name}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {v.duration_formatted}
                  </span>
                </div>

                <p className="text-xs text-emerald-700/90 leading-relaxed font-medium">
                  {v.reason}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-emerald-100">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Est. Pop: {v.population || "720"}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>[{v.coordinates[0].toFixed(3)}, {v.coordinates[1].toFixed(3)}]</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!data || data.accessible_villages.length === 0) && (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                No accessible settlements detected in this operational sector.
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Strategic Emergency Response Recommendations */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-indigo-700">
          <Compass className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Operational Relief Dispatch Directives
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">Airdrop & Boat Staging Priority</span>
            Deploy motorized rescue inflatables to Cut-off clusters with zero road connection.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">Ambulance Routing Relay</span>
            Direct evacuation convoys along verified OpenRouteService passable road links (&lt; 25 mins).
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">Temporary Bailey Bridge Staging</span>
            Engineers recommended to survey washed-out bridge junctions between Rampur and Morigaon.
          </div>
        </div>
      </div>
    </div>
  );
}
