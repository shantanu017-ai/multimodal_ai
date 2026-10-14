import { Waves, Heart, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/90 bg-white py-4 px-4 md:px-8 text-xs text-slate-500 space-y-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            © 2026 <strong className="font-semibold text-slate-700">FloodMapper AI</strong>. Built for{" "}
            <span className="text-indigo-600 font-medium">Multimodal AI Hackathon 2026 (Track B)</span>.
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="font-semibold text-slate-600">Trishuli Corridor, Nepal</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            Track B <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> Humanitarian Impact
          </span>
        </div>
      </div>

      {/* Component 9: Data Attribution Footer (Always Visible) */}
      <div className="pt-2 border-t border-slate-100 text-[10px] leading-relaxed text-slate-400 text-center sm:text-left">
        Contains modified Copernicus Sentinel data 2026. | Produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by EU and ESA; all rights reserved. | © OpenStreetMap contributors. | Trained on Kuro Siwo dataset (Bountos et al., 2024). | EMSR927 validation: © European Union, Copernicus Emergency Management Service.
      </div>
    </footer>
  );
}
