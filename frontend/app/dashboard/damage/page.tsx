"use client";

import { motion } from "framer-motion";
import { Building2, Route, AlertOctagon, CheckCircle2 } from "lucide-react";

export default function DamageAssessmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Damage Assessment (Buildings & Roads)
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Automated intersection of Copernicus SAR water mask with OpenStreetMap infrastructure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Impacted Buildings</p>
              <h3 className="text-2xl font-bold text-slate-800">1,842</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">342 residential, 18 healthcare/schools, 1,482 auxiliary</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Damaged Roads</p>
              <h3 className="text-2xl font-bold text-slate-800">64.5 km</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">22.4 km Primary highway, 42.1 km Secondary rural roads</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Critical Severity Index</p>
              <h3 className="text-2xl font-bold text-rose-600">7.8 / 10</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Priority rescue zone designated in eastern floodplain</p>
        </div>
      </div>
    </div>
  );
}
