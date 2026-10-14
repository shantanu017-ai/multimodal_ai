import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FloodMapper AI | Track B - Multimodal AI Hackathon 2026",
  description:
    "Multimodal AI-driven Flood Damage Assessment, Building/Road Impact, and Village Connectivity Analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${inter.className} min-h-full bg-white text-slate-900 flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
