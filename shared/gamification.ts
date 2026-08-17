// ── Rank definitions ────────────────────────────────────────────────────────
export const RANKS = [
  { id: "rookie",           label: "Rookie",            minXp: 0,    color: "#6b7280" },
  { id: "correspondent",    label: "Correspondent",     minXp: 100,  color: "#3b82f6" },
  { id: "investigator",     label: "Investigator",      minXp: 300,  color: "#8b5cf6" },
  { id: "senior",           label: "Senior Investigator", minXp: 700, color: "#f59e0b" },
  { id: "editor",           label: "Editor-at-Large",   minXp: 1500, color: "hsl(145 85% 48%)" },
] as const;

export type RankId = typeof RANKS[number]["id"];

export function getRank(xp: number) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXp) rank = r;
  }
  return rank;
}

export function getNextRank(xp: number) {
  for (const r of RANKS) {
    if (xp < r.minXp) return r;
  }
  return null; // max rank
}

export function getXpProgress(xp: number) {
  const current = getRank(xp);
  const next = getNextRank(xp);
  if (!next) return { percent: 100, current, next: null, xpIntoTier: 0, xpNeeded: 0 };
  const xpIntoTier = xp - current.minXp;
  const xpNeeded = next.minXp - current.minXp;
  return { percent: Math.round((xpIntoTier / xpNeeded) * 100), current, next, xpIntoTier, xpNeeded };
}

// ── XP awards ───────────────────────────────────────────────────────────────
export const XP_AWARDS = {
  mission_complete:   50,
  evidence_receipt:   30,
  power_ping:         20,
  media_patch:       100,
  daily_streak:       10,
  reboot_response:    15,
} as const;

export type XpEvent = keyof typeof XP_AWARDS;

// ── Badge definitions ────────────────────────────────────────────────────────
export const BADGES: Record<string, { label: string; desc: string; icon: string; color: string }> = {
  founding_crew:             { label: "Founding Crew",         desc: "Among the first to join the platform.",             icon: "⭐", color: "hsl(145 85% 48%)" },
  first_mission:             { label: "First Mission",          desc: "Completed your first investigation mission.",        icon: "🎯", color: "#3b82f6" },
  truth_seeker:              { label: "Truth Seeker",           desc: "Completed 5 missions.",                             icon: "🔍", color: "#8b5cf6" },
  full_crew:                 { label: "Full Crew",              desc: "Completed all 10 missions.",                        icon: "🏆", color: "#f59e0b" },
  first_evidence:            { label: "Evidence Filed",         desc: "Submitted your first Evidence Receipt.",            icon: "📋", color: "#06b6d4" },
  first_ping:                { label: "Power Ping",             desc: "Sent your first outreach to a decision-maker.",     icon: "📡", color: "#ec4899" },
  decision_maker_responded:  { label: "They Responded",         desc: "A decision-maker responded to your Power Ping.",    icon: "✅", color: "hsl(145 85% 48%)" },
  first_patch:               { label: "Patch Published",        desc: "Published your first Media Patch.",                 icon: "📰", color: "#f97316" },
  streak_3:                  { label: "3-Day Streak",           desc: "Active 3 days in a row.",                           icon: "🔥", color: "#ef4444" },
  streak_7:                  { label: "7-Day Streak",           desc: "Active 7 days in a row.",                           icon: "⚡", color: "#f59e0b" },
};

// Compute which badges should be earned given current stats
export function computeEarnedBadges(stats: {
  missionsCompleted: number;
  evidenceReceipts: number;
  powerPings: number;
  respondedPings: number;
  mediaPatches: number;
  currentStreak: number;
  foundingCrew: boolean;
}): string[] {
  const earned: string[] = [];
  if (stats.foundingCrew)             earned.push("founding_crew");
  if (stats.missionsCompleted >= 1)   earned.push("first_mission");
  if (stats.missionsCompleted >= 5)   earned.push("truth_seeker");
  if (stats.missionsCompleted >= 10)  earned.push("full_crew");
  if (stats.evidenceReceipts >= 1)    earned.push("first_evidence");
  if (stats.powerPings >= 1)          earned.push("first_ping");
  if (stats.respondedPings >= 1)      earned.push("decision_maker_responded");
  if (stats.mediaPatches >= 1)        earned.push("first_patch");
  if (stats.currentStreak >= 3)       earned.push("streak_3");
  if (stats.currentStreak >= 7)       earned.push("streak_7");
  return earned;
}
