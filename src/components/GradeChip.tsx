"use client";

import type { Phase } from "@/types/analysis";

interface GradeChipProps {
  grade: string;
  status: Phase["status"];
}

const statusStyles = {
  good: "bg-green-950/60 text-green-400 border-green-800",
  warning: "bg-amber-950/60 text-amber-400 border-amber-800",
  needs_work: "bg-red-950/60 text-red-400 border-red-800",
};

export function GradeChip({ grade, status }: GradeChipProps) {
  const style = statusStyles[status] || statusStyles.warning;

  return (
    <span
      className={`inline-block border rounded px-2 py-0.5 text-xs font-bold font-mono ${style}`}
      aria-label={`Grade: ${grade}`}
    >
      {grade}
    </span>
  );
}
