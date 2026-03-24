import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateFrames, sanitizeAnalysis } from "@/lib/validation";

// Validate environment on first request
function getApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.trim() === "" || key === "sk-ant-xxxxx") {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return key;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // --- Rate limiting ---
    const ip = getClientIP(request);
    const maxPerMinute = parseInt(process.env.RATE_LIMIT_PER_MINUTE || "10", 10);
    const rateCheck = checkRateLimit(ip, maxPerMinute, 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait a minute before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // --- Parse and validate request body ---
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request body must be a JSON object" },
        { status: 400 }
      );
    }

    const { frames } = body as { frames: unknown };
    const frameValidation = validateFrames(frames);

    if (!frameValidation.valid) {
      return NextResponse.json(
        { success: false, error: frameValidation.error },
        { status: 400 }
      );
    }

    const validFrames = frames as string[];

    // --- Get API key ---
    let apiKey: string;
    try {
      apiKey = getApiKey();
    } catch {
      return NextResponse.json(
        { success: false, error: "Server configuration error. API key not set." },
        { status: 500 }
      );
    }

    // --- Build Claude API request ---
    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

    const imageContent = validFrames.flatMap((b64: string, i: number) => [
      {
        type: "text" as const,
        text: `Frame ${i + 1} of ${validFrames.length} (evenly spaced through the pitching delivery):`,
      },
      {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: "image/jpeg" as const,
          data: b64,
        },
      },
    ]);

    imageContent.push({
      type: "text" as const,
      text: "Analyze these frames from a baseball pitcher's delivery. Evaluate each phase of the mechanics carefully. Provide detailed mechanical analysis, identify the top issues, recommend specific drills to address them, and create a weekly practice plan. Return ONLY valid JSON matching the specified schema.",
      source: undefined as never,
    });

    // --- Call Anthropic API ---
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: imageContent,
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorBody = await anthropicResponse.text();
      console.error("Anthropic API error:", anthropicResponse.status, errorBody);

      if (anthropicResponse.status === 401) {
        return NextResponse.json(
          { success: false, error: "API authentication failed. Check your API key." },
          { status: 500 }
        );
      }

      if (anthropicResponse.status === 429) {
        return NextResponse.json(
          { success: false, error: "API rate limit reached. Please try again in a moment." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Analysis service temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    const responseData = await anthropicResponse.json();

    // --- Parse AI response ---
    const textBlocks = responseData.content?.filter(
      (block: { type: string }) => block.type === "text"
    );

    if (!textBlocks || textBlocks.length === 0) {
      return NextResponse.json(
        { success: false, error: "No analysis returned from AI. Please try again." },
        { status: 502 }
      );
    }

    const rawText = textBlocks
      .map((block: { text: string }) => block.text)
      .join("");

    // Clean any markdown formatting
    const cleanText = rawText.replace(/```json\s*|```\s*/g, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      console.error("Failed to parse AI response as JSON:", cleanText.substring(0, 500));
      return NextResponse.json(
        { success: false, error: "AI returned invalid format. Please try again." },
        { status: 502 }
      );
    }

    // --- Sanitize and validate the analysis ---
    const analysis = sanitizeAnalysis(parsed);

    if (!analysis) {
      console.error("Analysis failed schema validation");
      return NextResponse.json(
        { success: false, error: "AI response didn't match expected format. Please try again." },
        { status: 502 }
      );
    }

    // --- Return success ---
    return NextResponse.json(
      { success: true, data: analysis },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateCheck.remaining),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Unhandled error in /api/analyze:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// Only allow POST
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
