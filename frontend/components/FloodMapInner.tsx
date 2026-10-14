"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface FloodMapProps {
  geoJsonData: any;
  center?: [number, number];
  zoom?: number;
  emsrOverlay?: boolean;
  floodPathOverlay?: boolean;
}

const EMSR927_POLYGON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Copernicus EMSR927 Official Activation Polygon" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [85.008, 27.780],
          [85.040, 27.808],
          [85.072, 27.832],
          [85.115, 27.868],
          [85.150, 27.905],
          [85.145, 27.922],
          [85.090, 27.878],
          [85.045, 27.825],
          [85.008, 27.790],
          [85.008, 27.780]
        ]]
      }
    }
  ]
};

const DOWNSTREAM_FLOW_PATH = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Downstream Hydraulic Drainage Wave" },
      geometry: {
        type: "LineString",
        coordinates: [
          [85.456, 28.123],
          [85.350, 28.150],
          [85.290, 28.110],
          [85.180, 27.980],
          [85.150, 27.905],
          [85.130, 27.880],
          [84.990, 27.820]
        ]
      }
    }
  ]
};

function AutoFitBounds({ data }: { data: any }) {
  const map = useMap();

  useEffect(() => {
    if (!data || !map) return;
    try {
      const layer = L.geoJSON(data);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    } catch (err) {
      console.error("AutoFitBounds error:", err);
    }
  }, [data, map]);

  return null;
}

/**
 * Trishuli River Corridor, Nepal - Interactive Geospatial Flood Extent Map
 * Default Map Center: Latitude 27.80, Longitude 85.00 (Trishuli River, Nuwakot, Nepal)
 *
 * Attributions:
 * - "Contains modified Copernicus Sentinel data 2026."
 * - "© OpenStreetMap contributors."
 */

export default function FloodMapInner({
  geoJsonData,
  center = [27.80, 85.00], // Strictly Trishuli River Corridor, Nepal (Lat 27.80, Lon 85.00)
  zoom = 10,
  emsrOverlay = false,
  floodPathOverlay = false,
}: FloodMapProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
  }, []);

  const geoJsonStyle = () => ({
    fillColor: "#ef4444", // Red flood accent
    fillOpacity: 0.4,     // 40% fill opacity
    color: "#dc2626",     // Darker red stroke
    weight: 2,
  });

  const emsrStyle = () => ({
    fillColor: "#f59e0b",
    fillOpacity: 0.15,
    color: "#d97706",
    weight: 3,
    dashArray: "6, 6",
  });

  const flowPathStyle = () => ({
    color: "#06b6d4",
    weight: 4,
    opacity: 0.9,
  });

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties || {};
    const popupContent = `
      <div style="font-family: sans-serif; padding: 4px; font-size: 12px;">
        <strong style="color: #b91c1c;">🌊 Flooded Inundation Zone</strong><br/>
        <b>Area:</b> ${props.area_sq_km ? props.area_sq_km + " km²" : "Active Flood Zone"}<br/>
        <b>Severity:</b> ${props.severity || "High"}<br/>
        <b>Sensor:</b> Sentinel-1 SAR VV Band
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      <MapContainer
        key={`${center[0]}-${center[1]}`}
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & Copernicus Sentinel'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Primary Sentinel-1 Flood Polygon */}
        {geoJsonData && (
          <GeoJSON
            key={JSON.stringify(geoJsonData).length}
            data={geoJsonData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* EMSR927 Validation Overlay (Dashed Amber line) */}
        {emsrOverlay && (
          <GeoJSON
            key="emsr927-overlay"
            data={EMSR927_POLYGON as any}
            style={emsrStyle}
          />
        )}

        {/* Bonus Downstream Hydraulic Flow Vector */}
        {floodPathOverlay && (
          <GeoJSON
            key="flow-path-overlay"
            data={DOWNSTREAM_FLOW_PATH as any}
            style={flowPathStyle}
          />
        )}

        {geoJsonData && <AutoFitBounds data={geoJsonData} />}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 shadow-md text-xs space-y-1.5 pointer-events-auto">
        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
          Satellite Layer Legend
        </span>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-3.5 h-3.5 rounded bg-red-500/40 border border-red-600 shrink-0" />
          <span>Flooded Extent (SAR VV Anomalies)</span>
        </div>
        {emsrOverlay && (
          <div className="flex items-center gap-2 text-amber-700">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border-2 border-dashed border-amber-600 shrink-0" />
            <span>Copernicus EMSR927 Validation Boundary</span>
          </div>
        )}
        {floodPathOverlay && (
          <div className="flex items-center gap-2 text-cyan-700">
            <span className="w-3.5 h-1 rounded bg-cyan-500 shrink-0" />
            <span>Downstream DEM Flow Vector</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500 shrink-0" />
          <span>Non-Inundated / Dry Land</span>
        </div>
      </div>
    </div>
  );
}
