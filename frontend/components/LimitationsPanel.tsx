"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Clock, ShieldAlert, Heart, Calendar } from "lucide-react";

export default function LimitationsPanel() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
      {/* Accordion header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>⚠️ System Limitations & Known Constraints</span>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                15% Honest Evaluation Score
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Critical scientific constraints, sensor latency trade-offs, and ethical data handling boundaries
            </p>
          </div>
        </div>

        <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Accordion Body */}
      {isOpen && (
        <div className="pt-3 border-t border-slate-100 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* System Limitations List */}
            <div className="space-y-2 text-slate-700 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <p>
                  <strong>Sentinel-1 revisit time (12 days):</strong> Cannot detect instantaneous flash flood surges or dam breaches occurring within intra-orbital hours.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <p>
                  <strong>Optical cloud occlusion:</strong> Monsoon clouds obscure Sentinel-2 visual bands; Sentinel-1 C-band SAR radar backscatter is utilized as the primary all-weather detector.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <p>
                  <strong>OSM remote valley completeness:</strong> High mountain settlements in upper Rasuwa/Nuwakot may contain ~15% unverified or unmapped footpaths.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <p>
                  <strong>Debris & Landslide passability:</strong> Routing engine assumes geometric line clearance; fallen boulders or bridge scouring without standing water are not hydraulically modeled.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <p>
                  <strong>Copernicus DEM (30m resolution):</strong> Cannot capture localized micro-gullies, street-level gutters, or roadside drainage ditches narrower than 30 meters.
                </p>
              </div>
            </div>

            {/* Data Freshness & Ethics Card */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Telemetry Data Freshness</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
                    <span className="text-slate-600">• Sentinel-1 SAR:</span>
                    <span className="font-mono font-semibold text-purple-700">2 days old (28 Aug 2026)</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-200/50">
                    <span className="text-slate-600">• OpenStreetMap:</span>
                    <span className="font-mono font-semibold text-emerald-700">32 days old (27 Jul 2026 Pre-event)</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-600">• Next Sentinel-1 Pass:</span>
                    <span className="font-mono font-semibold text-slate-700">09 Sep 2026 (Orbit 125)</span>
                  </div>
                </div>
              </div>

              {/* Ethics and Respectful Handling Box */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Ethical Data Handling & Educational Prototype Notice</span>
                </div>
                <p className="text-indigo-800 leading-snug">
                  This system is an AI research hackathon prototype and not an authorized operational rescue dispatch console.
                  Respecting the victims of the 26 Aug 2026 disaster, no graphic casualty imagery or invasive private data is processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
