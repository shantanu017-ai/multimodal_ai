"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileCheck,
  FileCode,
  FileSpreadsheet,
  AlertCircle,
  Play,
  Sparkles,
  X,
  Layers,
} from "lucide-react";

interface FileUploadProps {
  onAnalyze: (beforeFile: File, afterFile: File, osmFile: File) => void;
  isLoading: boolean;
}

export default function FileUpload({ onAnalyze, isLoading }: FileUploadProps) {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [osmFile, setOsmFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  const osmInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleStartAnalysis = () => {
    if (!beforeFile || !afterFile || !osmFile) {
      setErrorMsg("Please upload all three files (Pre-flood TIFF, Post-flood TIFF, and OSM JSON).");
      return;
    }
    setErrorMsg(null);
    onAnalyze(beforeFile, afterFile, osmFile);
  };

  const handleLoadDemoFiles = () => {
    // Generate lightweight mock sample files for instantaneous testing
    const sampleBefore = new File(
      ["Sentinel-1 SAR VV Pre-flood Raster Binary Data - Trishuli River Corridor, Nepal - 2026-08-16"],
      "S1D_IW_GRDH_20260816_VV_Trishuli.tif",
      { type: "image/tiff" }
    );
    const sampleAfter = new File(
      ["Sentinel-1 SAR VV Post-flood Raster Binary Data - Trishuli River Corridor, Nepal - 2026-08-28"],
      "S1D_IW_GRDH_20260828_VV_Trishuli.tif",
      { type: "image/tiff" }
    );
    const sampleOsm = new File(
      [
        JSON.stringify({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { amenity: "hospital", name: "Trishuli District Hospital, Nuwakot, Nepal", healthcare: "hospital" },
              geometry: {
                type: "Point",
                coordinates: [85.145, 27.915],
              },
            },
            {
              type: "Feature",
              properties: { place: "village", name: "Betrawati Lowland Hamlet", population: 1350 },
              geometry: {
                type: "Point",
                coordinates: [85.180, 27.980],
              },
            },
            {
              type: "Feature",
              properties: { place: "village", name: "Bidur Municipality Ward 3", population: 2100 },
              geometry: {
                type: "Point",
                coordinates: [85.150, 27.905],
              },
            },
            {
              type: "Feature",
              properties: { place: "village", name: "Battar Riverside Hamlet", population: 980 },
              geometry: {
                type: "Point",
                coordinates: [85.130, 27.880],
              },
            },
            {
              type: "Feature",
              properties: { place: "village", name: "Galchhi Confluence Settlement", population: 1450 },
              geometry: {
                type: "Point",
                coordinates: [84.990, 27.820],
              },
            },
            {
              type: "Feature",
              properties: { place: "village", name: "Dhunche Mountain Cluster", population: 760 },
              geometry: {
                type: "Point",
                coordinates: [85.290, 28.110],
              },
            },
            {
              type: "Feature",
              properties: { place: "village", name: "Syaphrubesi Gorge Settlement", population: 640 },
              geometry: {
                type: "Point",
                coordinates: [85.350, 28.150],
              },
            },
            {
              type: "Feature",
              properties: { building: "yes", name: "Trishuli River Secondary Health Post" },
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [85.14, 27.91],
                    [85.15, 27.91],
                    [85.15, 27.92],
                    [85.14, 27.92],
                    [85.14, 27.91],
                  ],
                ],
              },
            },
            {
              type: "Feature",
              properties: { highway: "primary", name: "Trishuli-Kathmandu Highway (Pasang Lhamu)" },
              geometry: {
                type: "LineString",
                coordinates: [
                  [84.98, 27.80],
                  [85.15, 27.91],
                ],
              },
            },
          ],
        }),
      ],
      "trishuli_nepal_osm_infrastructure.json",
      { type: "application/json" }
    );

    setBeforeFile(sampleBefore);
    setAfterFile(sampleAfter);
    setOsmFile(sampleOsm);
    setErrorMsg(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-600" />
            Upload Mission Satellite & Vector Datasets
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest Sentinel-1 Dual-Pol GRDH GeoTIFFs and OpenStreetMap vector infrastructure
          </p>
        </div>

        {/* Demo Data Quick Load Button */}
        <button
          type="button"
          onClick={handleLoadDemoFiles}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Load Sample Hackathon Data
        </button>
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3 Upload Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dropzone 1: Pre-flood TIFF */}
        <div
          onClick={() => beforeInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            beforeFile
              ? "border-emerald-400 bg-emerald-50/30"
              : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60"
          }`}
        >
          <input
            ref={beforeInputRef}
            type="file"
            accept=".tif,.tiff"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setBeforeFile(e.target.files[0]);
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                beforeFile ? "bg-emerald-100 text-emerald-600" : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {beforeFile ? <FileCheck className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                1. Pre-Flood SAR (TIF)
              </p>
              <p className="text-[11px] text-slate-400">Sentinel-1 Baseline (16 Aug 2026)</p>
            </div>

            {beforeFile ? (
              <div className="mt-2 p-2 w-full rounded-lg bg-white border border-emerald-200 text-left">
                <p className="text-[11px] font-semibold text-slate-800 truncate">{beforeFile.name}</p>
                <p className="text-[10px] text-emerald-600">{formatSize(beforeFile.size)}</p>
              </div>
            ) : (
              <p className="text-[11px] text-indigo-600 font-medium">Click or Drag .TIFF</p>
            )}
          </div>
        </div>

        {/* Dropzone 2: Post-flood TIFF */}
        <div
          onClick={() => afterInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            afterFile
              ? "border-emerald-400 bg-emerald-50/30"
              : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60"
          }`}
        >
          <input
            ref={afterInputRef}
            type="file"
            accept=".tif,.tiff"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setAfterFile(e.target.files[0]);
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                afterFile ? "bg-emerald-100 text-emerald-600" : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {afterFile ? <FileCheck className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                2. Post-Flood SAR (TIF)
              </p>
              <p className="text-[11px] text-slate-400">Sentinel-1 Crisis (28 Aug 2026)</p>
            </div>

            {afterFile ? (
              <div className="mt-2 p-2 w-full rounded-lg bg-white border border-emerald-200 text-left">
                <p className="text-[11px] font-semibold text-slate-800 truncate">{afterFile.name}</p>
                <p className="text-[10px] text-emerald-600">{formatSize(afterFile.size)}</p>
              </div>
            ) : (
              <p className="text-[11px] text-indigo-600 font-medium">Click or Drag .TIFF</p>
            )}
          </div>
        </div>

        {/* Dropzone 3: OSM Data JSON */}
        <div
          onClick={() => osmInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
            osmFile
              ? "border-emerald-400 bg-emerald-50/30"
              : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60"
          }`}
        >
          <input
            ref={osmInputRef}
            type="file"
            accept=".json,.geojson"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) setOsmFile(e.target.files[0]);
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                osmFile ? "bg-emerald-100 text-emerald-600" : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {osmFile ? <FileCheck className="w-6 h-6" /> : <FileCode className="w-6 h-6" />}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">
                3. OSM Infrastructure (JSON)
              </p>
              <p className="text-[11px] text-slate-400">Buildings, Highways & Roads</p>
            </div>

            {osmFile ? (
              <div className="mt-2 p-2 w-full rounded-lg bg-white border border-emerald-200 text-left">
                <p className="text-[11px] font-semibold text-slate-800 truncate">{osmFile.name}</p>
                <p className="text-[10px] text-emerald-600">{formatSize(osmFile.size)}</p>
              </div>
            ) : (
              <p className="text-[11px] text-indigo-600 font-medium">Click or Drag .JSON</p>
            )}
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-end pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleStartAnalysis}
          disabled={isLoading || !beforeFile || !afterFile || !osmFile}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Analyze Flood Extent & Damage</span>
        </motion.button>
      </div>
    </div>
  );
}
