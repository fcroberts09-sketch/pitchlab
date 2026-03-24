"use client";

import { useRef, useCallback, useState } from "react";
import { validateVideoFile } from "@/lib/validation";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  videoUrl: string | null;
  isLoading: boolean;
  progress: string;
  frameCount: number;
  hasAnalysis: boolean;
  onReset: () => void;
}

export function UploadZone({
  onFileSelected,
  videoUrl,
  isLoading,
  progress,
  frameCount,
  hasAnalysis,
  onReset,
}: UploadZoneProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;

      setFileError(null);
      const validation = validateVideoFile(file);

      if (!validation.valid) {
        setFileError(validation.error || "Invalid file");
        return;
      }

      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="mb-6">
      <div
        role="button"
        tabIndex={0}
        aria-label={videoUrl ? "Upload a different video" : "Upload a pitching video"}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          videoUrl
            ? "border-slate-800 bg-slate-950/50 p-3"
            : dragOver
            ? "border-blue-500 bg-blue-950/20 p-10"
            : "border-blue-800/60 bg-gradient-to-br from-slate-900/50 to-slate-950 p-10 hover:border-blue-600"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
          aria-hidden="true"
        />

        {videoUrl ? (
          <div className="flex items-center gap-4">
            <video
              src={videoUrl}
              className="w-36 h-20 rounded-md object-cover border border-slate-800"
              muted
              playsInline
              aria-hidden="true"
            />
            <div className="text-left min-w-0">
              <div className="text-slate-400 text-xs">
                {isLoading ? (
                  <span className="text-blue-400">
                    <span className="inline-block animate-pulse mr-1">&#9203;</span>
                    {progress}
                  </span>
                ) : hasAnalysis ? (
                  <span className="text-green-400">
                    &#10003; Analysis complete &middot; {frameCount} frames analyzed
                  </span>
                ) : null}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                  setFileError(null);
                }}
                className="mt-1.5 bg-transparent border border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600 rounded px-3 py-1 text-xs cursor-pointer transition-colors"
              >
                Upload different video
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-3" aria-hidden="true">
              &#127909;
            </div>
            <div className="text-base font-semibold text-slate-400 mb-1.5">
              Upload a pitching video
            </div>
            <div className="text-xs text-slate-500">
              5&ndash;10 second clip &middot; Side angle works best &middot; Click or drag &amp; drop
            </div>
            <div className="text-xs text-slate-600 mt-1">
              MP4, MOV, WebM &middot; Max 50MB
            </div>
          </div>
        )}
      </div>

      {fileError && (
        <div className="mt-2 bg-red-950/50 border border-red-900/50 rounded-lg px-3 py-2 text-red-400 text-xs">
          &#9888;&#65039; {fileError}
        </div>
      )}
    </div>
  );
}
