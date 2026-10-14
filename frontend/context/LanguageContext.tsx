"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ne";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard_title: "Operational Situation Overview",
    dashboard_subtitle: "Sentinel-1 dual-polarization SAR change detection (16 Aug 2026 vs 28 Aug 2026)",
    active_modalities: "Active Modalities:",
    last_sync: "Last sync: SAR 28 Aug 2026 | OSM 27 Jul 2026 | DEM static",
    total_area_flooded: "Total Area Flooded",
    buildings_affected: "Buildings Affected",
    roads_damaged: "Roads Damaged",
    cutoff_villages: "Cut-off Villages",
    unit_sqkm: "sq km",
    unit_km: "km",
    export_report: "Export Report",
    situation_copilot: "Situation Copilot",
    interactive_extent: "Interactive Geospatial Flood Extent",
    validation_emsr: "Validation vs Copernicus EMSR927",
    ai_segmentation: "AI Flood Segmentation Model",
    run_inference: "Run Inference",
    trace_flood_path: "Trace Flood Path (Bonus)",
    limitations_title: "System Limitations & Known Constraints",
  },
  ne: {
    dashboard_title: "सञ्चालन अवस्था सिंहावलोकन",
    dashboard_subtitle: "Sentinel-1 दोहोरो ध्रुवीकरण SAR परिवर्तन पहिचान (१६ अगस्ट २०२६ विरुद्ध २८ अगस्ट २०२६)",
    active_modalities: "सक्रिय मोडालिटीहरू:",
    last_sync: "अन्तिम समक्रमण: SAR २८ अगस्ट २०२६ | OSM २७ जुलाई २०२६ | DEM स्थिर",
    total_area_flooded: "कुल डुबान क्षेत्र",
    buildings_affected: "प्रभावित भवनहरू",
    roads_damaged: "क्षतिग्रस्त सडक",
    cutoff_villages: "सम्पर्कविहीन बस्तीहरू",
    unit_sqkm: "वर्ग किमी",
    unit_km: "किमी",
    export_report: "प्रतिवेदन निर्यात",
    situation_copilot: "स्थिति प्रतिवेदन कोपाइलट",
    interactive_extent: "अन्तरक्रियात्मक भू-स्थानिक बाढी फैलावट",
    validation_emsr: "Copernicus EMSR927 सँग प्रमाणीकरण",
    ai_segmentation: "AI बाढी विभाजन मोडेल",
    run_inference: "अनुमान चलाउनुहोस्",
    trace_flood_path: "बाढी मार्ग पछ्याउनुहोस् (बोनस)",
    limitations_title: "प्रणालीगत सीमाहरू र ज्ञात व्यवधानहरू",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("floodmapper_lang");
    if (saved === "ne" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("floodmapper_lang", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "ne" : "en";
    setLanguage(next);
  };

  const t = (key: string) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
