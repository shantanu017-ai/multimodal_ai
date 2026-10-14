import Link from "next/link";
import { Waves, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-md shadow-indigo-200">
        <Waves className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h2>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        The requested flood assessment route does not exist or has been relocated.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
