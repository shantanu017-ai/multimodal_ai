"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Waves } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user session exists in localStorage
    const storedUser = localStorage.getItem("floodmapper_user");
    if (!storedUser) {
      setIsAuthenticated(false);
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // While checking auth status, display a smooth skeleton / spinner
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 animate-pulse">
            <Waves className="w-6 h-6 animate-bounce" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-600/30 border-t-indigo-600 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">Verifying Mission Credentials...</p>
          <p className="text-xs text-slate-400 mt-0.5">FloodMapper AI Security Protocol</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
