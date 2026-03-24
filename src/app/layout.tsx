import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PitchLab — AI Pitching Mechanics Coach",
  description:
    "Upload a pitching video and get instant AI-powered mechanical analysis, personalized drills, and a weekly practice plan to improve your delivery.",
  keywords: [
    "pitching",
    "baseball",
    "mechanics",
    "coaching",
    "AI",
    "analysis",
    "youth baseball",
    "pitching drills",
  ],
  robots: "index, follow",
  openGraph: {
    title: "PitchLab — AI Pitching Mechanics Coach",
    description:
      "Upload a pitching video and get instant AI analysis of your mechanics with personalized drill recommendations.",
    type: "website",
    siteName: "PitchLab",
  },
  twitter: {
    card: "summary_large_image",
    title: "PitchLab — AI Pitching Mechanics Coach",
    description:
      "Upload a pitching video and get instant AI analysis with personalized coaching.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020817",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 antialiased">{children}</body>
    </html>
  );
}
