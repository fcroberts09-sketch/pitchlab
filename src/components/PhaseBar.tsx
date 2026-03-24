"use client";

import type { Phase } from "@/types/analysis";
import { GradeChip } from "./GradeChip";

interface PhaseBarProps {
  phase: Phase;
}

const gradeToPercent: Record<string, number> = {
  A: 95,
  "A-": 88,
  "B+": 82,
  B: 75,
  "B-": 68,
  "C+": 62,
  C: 55,
  "C-": 48,
  D: 35,
};

const statusColors = {
  good: "bg-green-400",
  warning: "bg-amber-400",
  needs_work: "bg-red-400",
};

export function PhaseBar({ phase }: PhaseBarProps) {
  const pct = gradeToPercent[phase.grade] || 60;
  const barColor = statusColors[phase.status] || statusColors.warning;

  return (
    <div className="mb-4" role="group" aria-label={`${phase.name}: ${phase.grade}`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-slate-300 text-sm font-semibold">{phase.name}</span>
        <GradeChip grade={phase.grade} status={phase.status} />
      </div>

      <div className="bg-slate-800 rounded h-1.5 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full rounded transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{phase.observation}</p>

      {phase.key_issue && (
        <p className="text-amber-500/80 text-xs mt-0.5 italic">Key issue: {phase.key_issue}</p>
      )}
    </div>
  );
}
