"use client";

import { useState } from "react";
import { Sliders, Calendar, AlertTriangle, CheckCircle2, SplitSquareVertical, Eye, Layers } from "lucide-react";

interface TemporalComparisonSliderProps {
  onModeChange?: (mode: "split" | "swipe" | "blink" | "difference") => void;
  onChangeOverlayToggle?: (enabled: boolean) => void;
}

export default function TemporalComparisonSlider({
  onModeChange,
  onChangeOverlayToggle,
}: TemporalComparisonSliderProps) {
  const [sliderVal, setSliderVal] = useState(100); // 0 (16 Aug) -> 100 (28 Aug)
  const [activeMode, setActiveMode] = useState<"split" | "swipe" | "blink" | "difference">("difference");
  const [orbitMatch, setOrbitMatch] = useState(true);
  const [overlayActive, setOverlayActive] = useState(true);

  const handleMode = (mode: "split" | "swipe" | "blink" | "difference") => {
    setActiveMode(mode);
    if (onModeChange) onModeChange(mode);
  };

  const handleOverlay = () => {
    const next = !overlayActive;
    setOverlayActive(next);
    if (onChangeOverlayToggle) onChangeOverlayToggle(next);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Temporal Sentinel-1 Comparison (12-Day Orbital Revisit)
          </h4>
        </div>

        {/* Orbit track indicator */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => setOrbitMatch(!orbitMatch)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold"
            title="Click to toggle orbit mismatch warning simulation"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Track: 125 | Pass: DESCENDING ✓ Same orbit</span>
          </div>

          <button
            onClick={handleOverlay}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
              overlayActive
                ? "bg-purple-100 border-purple-300 text-purple-800"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            <Layers className="w-3 h-3 inline mr-1" />
            Change Detection Overlay
          </button>
        </div>
      </div>

      {/* Warning if different orbit track */}
      {!orbitMatch && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>⚠️ Different orbit tracks — pixel comparison unreliable due to SAR incidence angle mismatch.</span>
        </div>
      )}

      {/* Slider bar & dates */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            16 Aug 2026 (Pre-flood baseline)
          </span>
          <span className="font-mono text-purple-700 font-bold">
            {sliderVal < 30
              ? "Pre-Flood State"
              : sliderVal > 70
              ? "Post-Flood Peak Inundation"
              : "Differential Blend"}
          </span>
          <span className="flex items-center gap-1.5 text-rose-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            28 Aug 2026 (Post-event SAR)
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={sliderVal}
          onChange={(e) => setSliderVal(parseInt(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
        />
      </div>

      {/* Mode Buttons */}
      <div className="flex flex-wrap items-center justify-between pt-1 text-xs gap-2">
        <span className="text-[11px] text-slate-400 font-medium">Viewing Mode:</span>
        <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
          {(
            [
              { id: "split", label: "Split View" },
              { id: "swipe", label: "Swipe" },
              { id: "blink", label: "Blink" },
              { id: "difference", label: "Difference" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              onClick={() => handleMode(m.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMode === m.id
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
