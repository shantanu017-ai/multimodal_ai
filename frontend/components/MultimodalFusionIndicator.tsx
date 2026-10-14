"use client";

import { useState } from "react";
import { Check, Info, Radio, Eye, Mountain, MapPinned, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Modality {
  id: string;
  name: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  sourceUrl: string;
  license: string;
  refreshDate: string;
  role: string;
}

const MODALITIES: Modality[] = [
  {
    id: "sar",
    name: "Sentinel-1 SAR",
    short: "S-1 C-band SAR",
    icon: Radio,
    active: true,
    sourceUrl: "https://dataspace.copernicus.eu (Descending Track 125, VV)",
    license: "CC BY-SA 3.0 IGO (Copernicus)",
    refreshDate: "28 Aug 2026 (Orbit 125)",
    role: "Penetrates monsoonal cloud cover & rain; calculates water specular backscatter drop (< -18dB).",
  },
  {
    id: "optical",
    name: "Sentinel-2 Optical",
    short: "S-2 Multi-Spectral",
    icon: Eye,
    active: true,
    sourceUrl: "https://dataspace.copernicus.eu (MSI 10m bands 2,3,4,8)",
    license: "CC BY-SA 3.0 IGO (Copernicus)",
    refreshDate: "27 Aug 2026 (Clear skies)",
    role: "MNDWI water index validation & visible silt/sediment surge tracking.",
  },
  {
    id: "dem",
    name: "Copernicus DEM",
    short: "WorldDEM-30 (30m)",
    icon: Mountain,
    active: true,
    sourceUrl: "https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model",
    license: "Copernicus WorldDEM-30 © DLR e.V. / Airbus Defence and Space GmbH",
    refreshDate: "Static baseline",
    role: "Valley floor slope slope convergence, gorge flow path routing & hydraulic gradient.",
  },
  {
    id: "osm",
    name: "OSM Pre-event",
    short: "OpenStreetMap Vector",
    icon: MapPinned,
    active: true,
    sourceUrl: "https://www.openstreetmap.org (Geofabrik Nepal Archive)",
    license: "© OpenStreetMap contributors (ODbL 1.0)",
    refreshDate: "27 Jul 2026 (Pre-event)",
    role: "Pre-disaster infrastructure baseline for unaffected buildings, roads, and village nodes.",
  },
];

export default function MultimodalFusionIndicator() {
  const { t } = useLanguage();
  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);

  return (
    <div className="relative rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base">📡</span>
          <div>
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              {t("active_modalities")}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Multi-sensor fusion for monsoonal cloud penetration & infrastructure assessment
            </span>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          {MODALITIES.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModality(selectedModality?.id === mod.id ? null : mod)}
                className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  mod.active
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
                title={`Click for source and license details on ${mod.name}`}
              >
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <Icon className="w-3.5 h-3.5 text-emerald-700" />
                <span>{mod.name}</span>
                <Info className="w-3 h-3 text-emerald-600/70 ml-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1.5">
        <span className="font-mono text-slate-600">
          {t("last_sync")}
        </span>
        <span className="text-indigo-600 font-medium">
          Trishuli Corridor Orbit 125 • 10m Resolution
        </span>
      </div>

      {/* Detail Modal / Tooltip Popover */}
      {selectedModality && (
        <div className="absolute top-full left-0 right-0 mt-2 z-30 p-4 bg-white rounded-2xl border border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <selectedModality.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{selectedModality.name}</h4>
                <p className="text-[10px] text-slate-400">{selectedModality.short}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedModality(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Operational Role</span>
              <p className="text-slate-700 text-[11px] leading-snug mt-0.5">{selectedModality.role}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Source & License</span>
              <p className="text-slate-700 text-[11px] leading-snug mt-0.5">
                <span className="font-mono text-[10px] text-indigo-700">{selectedModality.sourceUrl}</span>
                <br />
                <span className="text-slate-500">{selectedModality.license}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
