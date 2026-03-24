"use client";

import { useState } from "react";
import type { Drill } from "@/types/analysis";

interface DrillCardProps {
  drill: Drill;
}

const priorityStyles = {
  high: "border-red-400 text-red-400",
  medium: "border-amber-400 text-amber-400",
  low: "border-green-400 text-green-400",
};

export function DrillCard({ drill }: DrillCardProps) {
  const [open, setOpen] = useState(false);
  const pStyle = priorityStyles[drill.priority] || priorityStyles.medium;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(!open);
        }
      }}
      className={`bg-slate-900 border rounded-lg p-3 mb-2.5 cursor-pointer transition-colors ${
        open ? "border-blue-600" : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex justify-between items-center gap-2">
        <div className="min-w-0">
          <span className="text-slate-200 font-bold text-sm">{drill.name}</span>
          <span className="text-slate-500 text-xs ml-2 hidden sm:inline">{drill.targets}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`border rounded px-2 py-0.5 text-[10px] font-bold uppercase ${pStyle}`}
          >
            {drill.priority}
          </span>
          <span className="text-slate-500 text-xs">{open ? "\u25B2" : "\u25BC"}</span>
        </div>
      </div>

      {/* Mobile: show targets below name */}
      <span className="text-slate-500 text-xs sm:hidden block mt-1">{drill.targets}</span>

      {open && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <p className="text-slate-400 text-xs leading-relaxed mb-2">{drill.how_to}</p>
          <span className="text-blue-400 text-xs font-mono">Reps: {drill.reps}</span>
        </div>
      )}
    </div>
  );
}
