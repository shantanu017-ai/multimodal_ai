/**
 * Trishuli River Corridor, Nepal - Interactive Geospatial Flood Extent Map
 * Centered on Latitude 27.80, Longitude 85.00 (Trishuli River, Nepal)
 *
 * Attributions:
 * - "Contains modified Copernicus Sentinel data 2026."
 * - "© OpenStreetMap contributors."
 */
"use client";

import dynamic from "next/dynamic";

interface FloodMapProps {
  geoJsonData: any;
  center?: [number, number];
  zoom?: number;
  emsrOverlay?: boolean;
  floodPathOverlay?: boolean;
}

const FloodMap = dynamic<FloodMapProps>(() => import("./FloodMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-sm animate-pulse">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
      <span>Loading Trishuli River Nepal Satellite Map...</span>
    </div>
  ),
});

export default FloodMap;
