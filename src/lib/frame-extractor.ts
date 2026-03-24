/**
 * Client-side video frame extraction.
 * Takes a video File, seeks through it at even intervals,
 * and captures frames as base64 JPEG strings.
 */

const DEFAULT_FRAME_COUNT = 8;
const JPEG_QUALITY = 0.7;

export interface FrameExtractionProgress {
  current: number;
  total: number;
  phase: "loading" | "extracting" | "done";
}

export type ProgressCallback = (progress: FrameExtractionProgress) => void;

/**
 * Extract evenly-spaced frames from a video file.
 *
 * @param file - Video file to extract frames from
 * @param frameCount - Number of frames to capture (default: 8)
 * @param onProgress - Optional progress callback
 * @returns Array of base64-encoded JPEG strings (no data URI prefix)
 */
export function extractFrames(
  file: File,
  frameCount: number = DEFAULT_FRAME_COUNT,
  onProgress?: ProgressCallback
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    // crossOrigin not needed for blob URLs but doesn't hurt
    video.crossOrigin = "anonymous";

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    // Timeout after 30 seconds
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Frame extraction timed out after 30 seconds"));
    }, 30000);

    video.addEventListener("error", () => {
      clearTimeout(timeout);
      cleanup();
      reject(new Error("Failed to load video. The file may be corrupt or unsupported."));
    });

    video.addEventListener("loadedmetadata", () => {
      const duration = video.duration;

      if (!duration || !isFinite(duration) || duration < 0.5) {
        clearTimeout(timeout);
        cleanup();
        reject(new Error("Video is too short or has invalid duration."));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        clearTimeout(timeout);
        cleanup();
        reject(new Error("Failed to create canvas context"));
        return;
      }

      const captured: string[] = [];
      let currentFrame = 0;

      onProgress?.({ current: 0, total: frameCount, phase: "extracting" });

      const captureNext = () => {
        if (currentFrame >= frameCount) {
          clearTimeout(timeout);
          cleanup();
          canvas.remove();
          onProgress?.({ current: frameCount, total: frameCount, phase: "done" });
          resolve(captured);
          return;
        }

        // Calculate timestamp for even distribution
        const timestamp =
          frameCount === 1 ? duration / 2 : (duration / (frameCount - 1)) * currentFrame;

        // Clamp to valid range
        video.currentTime = Math.min(Math.max(0, timestamp), duration - 0.01);
      };

      video.addEventListener("seeked", () => {
        // Set canvas to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current frame
        ctx.drawImage(video, 0, 0);

        // Convert to base64 JPEG
        const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        const base64 = dataUrl.split(",")[1];

        if (base64) {
          captured.push(base64);
        }

        currentFrame++;
        onProgress?.({ current: currentFrame, total: frameCount, phase: "extracting" });
        captureNext();
      });

      captureNext();
    });

    onProgress?.({ current: 0, total: frameCount, phase: "loading" });
    video.load();
  });
}
