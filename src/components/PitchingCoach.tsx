"use client";

import { useState, useCallback } from "react";
import type { AnalysisResult, AnalyzeResponse } from "@/types/analysis";
import { extractFrames } from "@/lib/frame-extractor";
import { UploadZone } from "./UploadZone";
import { AnalysisResults } from "./AnalysisResults";

function gradeColor(grade: string | undefined): string {
  if (!grade) return "text-slate-400";
  if (grade.startsWith("A")) return "text-green-400";
  if (grade.startsWith("B")) return "text-blue-400";
  if (grade.startsWith("C")) return "text-amber-400";
  return "text-red-400";
}

export function PitchingCoach() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleReset = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setFrames([]);
    setAnalysis(null);
    setError(null);
    setProgress("");
  }, [videoUrl]);

  const analyzeFrames = useCallback(async (frameData: string[]) => {
    setProgress("Analyzing pitching mechanics with AI\u2026");

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frames: frameData }),
    });

    const result: AnalyzeResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Analysis failed");
    }

    return result.data;
  }, []);

  const handleFileSelected = useCallback(
    async (file: File) => {
      setError(null);
      setAnalysis(null);

      // Clean up previous URL
      if (videoUrl) URL.revokeObjectURL(videoUrl);

      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setLoading(true);

      try {
        // Extract frames
        setProgress("Extracting frames from video\u2026");
        const extracted = await extractFrames(file, 8, (p) => {
          if (p.phase === "extracting") {
            setProgress(`Extracting frame ${p.current} of ${p.total}\u2026`);
          }
        });

        setFrames(extracted);

        // Analyze
        const result = await analyzeFrames(extracted);
        setAnalysis(result);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
        setProgress("");
      }
    },
    [videoUrl, analyzeFrames]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 px-4 sm:px-6 py-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-lg shrink-0">
            &#9918;
          </div>

          <div className="min-w-0">
            <div className="font-mono font-bold text-base text-slate-100 tracking-tight">
              PITCH<span className="text-blue-500">LAB</span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.15em]">
              AI Mechanics Coach
            </div>
          </div>

          {analysis && (
            <div className="ml-auto text-center shrink-0">
              <div
                className={`text-3xl font-extrabold font-mono leading-none ${gradeColor(
                  analysis.overall_grade
                )}`}
              >
                {analysis.overall_grade}
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest">
                Overall
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Upload Zone */}
        <UploadZone
          onFileSelected={handleFileSelected}
          videoUrl={videoUrl}
          isLoading={loading}
          progress={progress}
          frameCount={frames.length}
          hasAnalysis={!!analysis}
          onReset={handleReset}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="relative w-14 h-14 mx-auto mb-4">
              <div className="w-14 h-14 border-[3px] border-slate-800 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <div className="text-slate-500 text-sm">{progress}</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="bg-red-950/40 border border-red-900/50 rounded-lg px-4 py-3 text-red-400 text-sm mb-4"
            role="alert"
          >
            &#9888;&#65039; {error}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !loading && <AnalysisResults analysis={analysis} />}

        {/* Empty State */}
        {!videoUrl && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {[
              {
                icon: "\uD83D\uDCD0",
                title: "8-Phase Analysis",
                desc: "Windup through follow-through, every phase graded",
              },
              {
                icon: "\uD83C\uDFAF",
                title: "Custom Drills",
                desc: "Targeted drills matched to the specific issues found",
              },
              {
                icon: "\uD83D\uDCC5",
                title: "Weekly Plan",
                desc: "Day-by-day practice plan to fix priority issues",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className="text-slate-200 font-bold text-sm mb-1">{card.title}</div>
                <div className="text-slate-500 text-xs">{card.desc}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12 py-4 text-center">
        <p className="text-slate-600 text-xs">
          PitchLab uses AI analysis and should not replace professional coaching.
          Always consult a qualified instructor for personalized training.
        </p>
      </footer>
    </div>
  );
}
