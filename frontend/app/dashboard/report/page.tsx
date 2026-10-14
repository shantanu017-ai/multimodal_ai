/**
 * Automated Situation Report (SITREP) - Trishuli River Corridor, Nepal
 *
 * Attributions:
 * - "Contains modified Copernicus Sentinel data 2026."
 * - "© OpenStreetMap contributors."
 */
"use client";

import { motion } from "framer-motion";
import { FileText, Download, CheckCircle2, ShieldAlert, Clock } from "lucide-react";

export default function SituationReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Automated Situation Report (SITREP) — Trishuli River, Nepal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Standardized Disaster Response Brief for National Disaster Risk Reduction & Management Authority (NDRRMA, Nepal)
          </p>
        </div>

        <button
          onClick={() => alert("Downloading PDF summary...")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Official SITREP PDF</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SITREP-2026-TRACK-B-0828</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">v1.2</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Generated: August 28, 2026 14:00 UTC</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-4">
          <h3 className="text-base font-bold text-slate-800">1. Executive Summary</h3>
          <p>
            Sentinel-1 dual-polarization (VV/VH) radar backscatter change detection indicates severe
            inundation encompassing <strong>142.8 sq km</strong> across the primary river basin.
            The flood wave crested between August 20 and August 28, 2026, causing significant disruptions
            to both primary road networks and vulnerable riverine settlements.
          </p>

          <h3 className="text-base font-bold text-slate-800">2. Critical Infrastructure Impact</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Buildings:</strong> 1,842 structures impacted, including educational & primary health clinics.</li>
            <li><strong>Roads:</strong> 64.5 km of road network inundated, including 18 submerged bridge crossings.</li>
            <li><strong>Percolation & Cut-off:</strong> 12 isolated settlements identified requiring airborne supply drops.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-800">3. Multimodal Methodology</h3>
          <p className="text-xs text-slate-500">
            Computed using Otsu-adaptive backscatter anomaly thresholding on Sentinel-1 GRDH IW imagery
            cross-referenced against OSM geospatial vector primitives and DEM elevation filtering.
          </p>
        </div>
      </div>
    </div>
  );
}
