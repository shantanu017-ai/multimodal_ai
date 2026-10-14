/**
 * Trishuli River Corridor, Nepal - Interactive Flood Extent Map
 * Default Map Center: Latitude 27.80, Longitude 85.00
 *
 * Attributions:
 * - "Contains modified Copernicus Sentinel data 2026."
 * - "© OpenStreetMap contributors."
 */
"use client";

import { motion } from "framer-motion";
import { Layers, Eye } from "lucide-react";
import FloodMap from "@/components/FloodMap";

const defaultFloodGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        zone: "Trishuli River Inundation Corridor",
        severity: "Critical",
        area_sq_km: 142.8,
        region: "Trishuli River Corridor, Nuwakot, Nepal",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [84.955, 27.775],
            [84.980, 27.762],
            [85.035, 27.785],
            [85.055, 27.820],
            [85.025, 27.845],
            [84.985, 27.830],
            [84.960, 27.810],
            [84.955, 27.775],
          ],
        ],
      },
    },
  ],
};

export default function FloodMapPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Interactive Flood Extent Map (Trishuli River, Nepal)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Multitemporal Sentinel-1 SAR change detection and water mask visualization (27.80° N, 85.00° E)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 border border-indigo-100">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Polarization: VV + VH (Sentinel-1)
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Trishuli River Viewport & GIS Layers (Nepal)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Eye className="w-4 h-4 text-slate-400" />
            <span>Opacity: 40% Red Inundation Overlay</span>
          </div>
        </div>

        {/* Live Leaflet Map Container strictly centered at Trishuli River, Nepal */}
        <FloodMap
          geoJsonData={defaultFloodGeoJson}
          center={[27.80, 85.00]}
          zoom={10}
        />
      </motion.div>
    </div>
  );
}
