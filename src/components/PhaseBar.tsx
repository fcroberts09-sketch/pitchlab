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

const confidenceLabel: Record<string, string> = {
  high: "Clearly visible",
  medium: "Probable",
  low: "Inferred",
};

const confidenceColor: Record<string, string> = {
  high: "text-green-500",
  medium: "text-amber-400",
  low: "text-slate-500",
};

const confidenceDot: Record<string, string> = {
  high: "bg-green-500",
  medium: "bg-amber-400",
  low: "bg-slate-500",
};

const validationLabel: Record<string, string> = {
  confirmed: "Confirmed",
  plausible: "Plausible",
  unsupported: "Unverified",
};

const validationColor: Record<string, string> = {
  confirmed: "text-green-400 bg-green-950/40 border-green-800/50",
  plausible: "text-amber-400 bg-amber-950/30 border-amber-800/40",
  unsupported: "text-red-400 bg-red-950/30 border-red-900/40",
};

export function PhaseBar({ phase }: PhaseBarProps) {
  const pct = gradeToPercent[phase.grade] || 60;
  const barColor = statusColors[phase.status] || statusColors.warning;
  const conf = phase.confidence || "medium";

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

      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
        {/* Confidence badge — how clearly Claude could see this */}
        <span
          className={`flex items-center gap-1 text-[10px] font-mono ${confidenceColor[conf]}`}
          title={`AI confidence: ${confidenceLabel[conf]}`}
        >
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${confidenceDot[conf]}`} />
          {confidenceLabel[conf]}
        </span>

        {/* Validation badge — second-pass review result */}
        {phase.validation_status && (
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${validationColor[phase.validation_status]}`}
            title="Verified by independent second-pass AI review"
          >
            {validationLabel[phase.validation_status]}
          </span>
        )}
      </div>
    </div>
  );
}
