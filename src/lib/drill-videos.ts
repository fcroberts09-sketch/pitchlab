/**
 * Curated video database for pitching drills.
 *
 * Each entry maps a set of keywords (matched against drill.name) to a YouTube
 * URL. Where a verified video ID exists we link directly; otherwise we use a
 * tightly-scoped YouTube search so the user always lands on relevant content.
 */

interface DrillVideo {
  /** Keywords to match against drill.name (lowercased). ALL must appear. */
  keywords: string[];
  /** YouTube URL — either a direct video or a targeted search. */
  url: string;
  /** Short label shown on the button. */
  label: string;
}

const DRILL_VIDEOS: DrillVideo[] = [
  // --- Direct video links (verified) ---
  {
    keywords: ["mirror"],
    url: "https://www.youtube.com/watch?v=TAR81kdwW4w",
    label: "Mirror Drill Demo",
  },
  {
    keywords: ["stride"],
    url: "https://www.youtube.com/watch?v=HYxqCZz8ayM",
    label: "Stride Drill Demo",
  },
  {
    keywords: ["plyo"],
    url: "https://www.youtube.com/watch?v=oFMk51QhnXg",
    label: "Plyo Drill Demo",
  },

  // --- Targeted YouTube searches (always return relevant results) ---
  {
    keywords: ["towel"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+towel+drill+mechanics+tutorial",
    label: "Towel Drill Videos",
  },
  {
    keywords: ["rocker"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+rocker+drill+weight+shift+tutorial",
    label: "Rocker Drill Videos",
  },
  {
    keywords: ["one", "knee"],
    url: "https://www.youtube.com/results?search_query=baseball+one+knee+drill+pitching+mechanics",
    label: "One-Knee Drill Videos",
  },
  {
    keywords: ["balance"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+balance+drill+leg+lift+tutorial",
    label: "Balance Drill Videos",
  },
  {
    keywords: ["flamingo"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+flamingo+balance+drill",
    label: "Balance Drill Videos",
  },
  {
    keywords: ["hip", "shoulder", "separation"],
    url: "https://www.youtube.com/results?search_query=baseball+hip+to+shoulder+separation+drill+pitching",
    label: "Separation Drill Videos",
  },
  {
    keywords: ["hip", "rotation"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+hip+rotation+drill+tutorial",
    label: "Hip Rotation Videos",
  },
  {
    keywords: ["long", "toss"],
    url: "https://www.youtube.com/results?search_query=baseball+long+toss+program+pitching+arm+strength",
    label: "Long Toss Videos",
  },
  {
    keywords: ["power", "position"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+power+position+drill+arm+path",
    label: "Power Position Videos",
  },
  {
    keywords: ["reverse", "throw"],
    url: "https://www.youtube.com/results?search_query=baseball+reverse+throws+drill+deceleration+pitching",
    label: "Reverse Throws Videos",
  },
  {
    keywords: ["wrist", "snap"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+wrist+snap+drill+tutorial",
    label: "Wrist Snap Videos",
  },
  {
    keywords: ["step", "back"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+step+back+drill+rhythm+tempo",
    label: "Step Back Drill Videos",
  },
  {
    keywords: ["sock"],
    url: "https://www.youtube.com/results?search_query=baseball+stride+sock+drill+pitching+direction",
    label: "Stride Sock Videos",
  },
  {
    keywords: ["pivot"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+pivot+drill+hip+drive",
    label: "Pivot Drill Videos",
  },
  {
    keywords: ["arm", "path"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+arm+path+drill+mechanics+tutorial",
    label: "Arm Path Videos",
  },
  {
    keywords: ["arm", "circle"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+arm+circle+drill+tutorial",
    label: "Arm Circle Videos",
  },
  {
    keywords: ["resistance", "band"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+resistance+band+drill+shoulder",
    label: "Band Drill Videos",
  },
  {
    keywords: ["medicine", "ball"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+medicine+ball+rotation+drill",
    label: "Med Ball Videos",
  },
  {
    keywords: ["crow", "hop"],
    url: "https://www.youtube.com/results?search_query=baseball+crow+hop+drill+pitching+momentum",
    label: "Crow Hop Videos",
  },
  {
    keywords: ["warm", "up"],
    url: "https://www.youtube.com/results?search_query=baseball+pitcher+dynamic+warmup+routine",
    label: "Warm-Up Videos",
  },
  {
    keywords: ["cool", "down"],
    url: "https://www.youtube.com/results?search_query=baseball+pitcher+cool+down+arm+care+routine",
    label: "Cool Down Videos",
  },
  {
    keywords: ["arm", "care"],
    url: "https://www.youtube.com/results?search_query=baseball+pitcher+arm+care+routine+jaeger+bands",
    label: "Arm Care Videos",
  },
  {
    keywords: ["follow", "through"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+follow+through+drill+deceleration",
    label: "Follow-Through Videos",
  },
  {
    keywords: ["release", "point"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+release+point+drill+consistency",
    label: "Release Point Videos",
  },
  {
    keywords: ["leg", "drive"],
    url: "https://www.youtube.com/results?search_query=baseball+pitching+back+leg+drive+drill+power",
    label: "Leg Drive Videos",
  },
];

/**
 * Find the best matching video URL for a drill name.
 * Returns the URL string or null if no match.
 */
export function findDrillVideo(drillName: string): { url: string; label: string } | null {
  const lower = drillName.toLowerCase();

  // Try entries with more keywords first (more specific match wins)
  const sorted = [...DRILL_VIDEOS].sort((a, b) => b.keywords.length - a.keywords.length);

  for (const entry of sorted) {
    if (entry.keywords.every((kw) => lower.includes(kw))) {
      return { url: entry.url, label: entry.label };
    }
  }

  // Fallback: generic YouTube search using the drill name itself
  const query = encodeURIComponent(`baseball pitching ${drillName} drill tutorial`);
  return {
    url: `https://www.youtube.com/results?search_query=${query}`,
    label: "Find Videos",
  };
}
