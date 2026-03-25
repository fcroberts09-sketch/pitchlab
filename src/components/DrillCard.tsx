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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-blue-400 text-xs font-mono">Reps: {drill.reps}</span>
            {drill.video_url && (
              <a
                href={drill.video_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 rounded-md px-3 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors no-underline"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="shrink-0"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                {drill.video_label || "Watch Demo"}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
