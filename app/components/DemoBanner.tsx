"use client";

import { resetDemoData } from "@/lib/demo-store";

export default function DemoBanner() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950">
      <p>
        <span className="font-semibold">Demo mode</span>
        <span className="ml-2">
          Fictional sample trips · Changes stay in this browser · Dates roll forward on return
        </span>
      </p>
      <button
        type="button"
        onClick={resetDemoData}
        className="shrink-0 rounded-md border border-amber-300 bg-white px-3 py-1.5 font-medium hover:bg-amber-100"
      >
        Reset sample data
      </button>
    </div>
  );
}
