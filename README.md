# PitchLab — AI Pitching Mechanics Coach

Upload a baseball pitching video and get instant AI-powered mechanical analysis, personalized drill recommendations, and a weekly practice plan.

## Features

- **8-Phase Mechanical Analysis** — From stance through follow-through, every phase of the delivery is graded
- **Priority Issue Detection** — Top mechanical issues identified with impact on velocity, command, and arm health
- **Personalized Drill Assignments** — Real, coach-validated drills matched to specific issues found
- **Weekly Practice Plans** — Day-by-day training plans following USA Baseball and ASMI guidelines
- **Youth Safety First** — Age-appropriate recommendations with weighted ball safety warnings

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling
- **Anthropic Claude API** — Vision-powered mechanical analysis
- **Vercel** — Deployment platform

## Quick Start

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/settings/keys)

### Setup

```bash
# Clone the repo
git clone <your-repo-url> pitchlab
cd pitchlab

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add `ANTHROPIC_API_KEY` to Environment Variables in Vercel dashboard
4. Deploy

The `vercel.json` is preconfigured with:
- 60-second function timeout for the analysis API route
- 1GB memory allocation for handling video frame processing

## Security

- **API key is server-side only** — never exposed to the browser
- **Rate limiting** — 10 requests/minute per IP (configurable via `RATE_LIMIT_PER_MINUTE`)
- **Input validation** — File type, size, frame count, and base64 format validated
- **Response sanitization** — AI output validated against expected schema with field length limits
- **Security headers** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **No powered-by header** — Next.js version not leaked

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # Secure API proxy to Anthropic
│   ├── globals.css             # Tailwind + base styles
│   ├── layout.tsx              # Root layout with SEO metadata
│   └── page.tsx                # Home page
├── components/
│   ├── PitchingCoach.tsx       # Main orchestrator component
│   ├── UploadZone.tsx          # Video upload with drag & drop
│   ├── AnalysisResults.tsx     # Tabbed results display
│   ├── GradeChip.tsx           # Grade badge component
│   ├── PhaseBar.tsx            # Phase progress bar
│   ├── DrillCard.tsx           # Expandable drill card
│   └── ErrorBoundary.tsx       # React error boundary
├── lib/
│   ├── prompts.ts              # Validated coaching system prompt
│   ├── validation.ts           # Input & output validation
│   ├── rate-limit.ts           # In-memory rate limiter
│   └── frame-extractor.ts      # Client-side video frame capture
└── types/
    └── analysis.ts             # TypeScript interfaces
```

## Coaching Content Validation

The system prompt and drill database have been validated against:
- Tom House / NPA methodology
- Driveline Baseball (Kyle Boddy) research
- Ron Wolforth / Texas Baseball Ranch
- ASMI youth pitching guidelines
- USA Baseball safety recommendations
- Peer-reviewed biomechanics research

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | — | Your Anthropic API key |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-4-20250514` | Claude model to use |
| `RATE_LIMIT_PER_MINUTE` | No | `10` | Max API requests per IP per minute |

## License

MIT
