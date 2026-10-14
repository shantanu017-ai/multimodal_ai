"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <LanguageProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
          {/* Fixed Left Sidebar */}
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />

          {/* Main Content Area (Offset by sidebar width on desktop) */}
          <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
            {/* Top Navbar */}
            <Navbar
              title="Flood Map & Damage Overview"
              onMobileMenuToggle={() => setMobileMenuOpen(true)}
            />

            {/* Page Body */}
            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </LanguageProvider>
    </ProtectedRoute>
  );
}
