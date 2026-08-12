import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { missions } from "@shared/schema";
import { ArrowRight, Clock, Users, AlertTriangle, Lock, ChevronRight, Target, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "analysis", label: "Analysis" },
  { id: "investigation", label: "Investigation" },
  { id: "verification", label: "Verification" },
  { id: "translation", label: "Translation" },
  { id: "ai-literacy", label: "AI Literacy" },
];

const DIFFICULTY_CONFIG: Record<string, {
  label: string;
  dots: number;
  color: string;
  glow: string;
  badgeCls: string;
  lockMsg: string | null;
}> = {
  beginner: {
    label: "Beginner",
    dots: 1,
    color: "hsl(var(--primary))",
    glow: "hsl(var(--primary) / 0.3)",
    badgeCls: "badge-verified",
    lockMsg: null,
  },
  intermediate: {
    label: "Intermediate",
    dots: 2,
    color: "hsl(var(--accent))",
    glow: "hsl(var(--accent) / 0.3)",
    badgeCls: "badge-progress",
    lockMsg: null,
  },
  advanced: {
    label: "Advanced",
    dots: 3,
    color: "hsl(var(--warning))",
    glow: "hsl(var(--warning) / 0.3)",
    badgeCls: "badge-pending",
    lockMsg: "High-clearance mission. Recommended for experienced crews.",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  analysis: "hsl(var(--primary))",
  investigation: "hsl(var(--accent))",
  verification: "hsl(var(--warning))",
  translation: "hsl(var(--chart-5))",
  "ai-literacy": "hsl(var(--destructive))",
};

/* ── Difficulty dots ─────────────────────────────────────────────────────── */
function DifficultyMeter({ difficulty }: { difficulty: string }) {
  const cfg = DIFFICULTY_CONFIG[difficulty];
  return (
    <div className="flex items-center gap-1" aria-label={`Difficulty: ${cfg.label}`}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-all"
          style={{
            background: i <= cfg.dots ? cfg.color : "hsl(var(--border))",
            boxShadow: i <= cfg.dots ? `0 0 4px ${cfg.glow}` : "none",
          }}
        />
      ))}
      <span className="font-mono text-[10px] ml-1.5 tracking-widest uppercase" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

/* ── Mission card ────────────────────────────────────────────────────────── */
function MissionCard({
  mission,
  index,
  isSelected,
  onSelect,
}: {
  mission: typeof missions[number];
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const cfg = DIFFICULTY_CONFIG[mission.difficulty];
  const catColor = CATEGORY_COLORS[mission.category] ?? "hsl(var(--primary))";
  const cardRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    onSelect();
    // Trigger pulse class
    cardRef.current?.classList.add("card-select-pulse");
    setTimeout(() => cardRef.current?.classList.remove("card-select-pulse"), 400);
  }

  return (
    <button
      ref={cardRef}
      onClick={handleClick}
      aria-pressed={isSelected}
      className={cn(
        "group relative w-full text-left rounded-sm overflow-hidden transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]",
        isSelected
          ? "border-2 border-[hsl(var(--primary))] scale-[1.01]"
          : "border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] hover:scale-[1.005]"
      )}
      style={isSelected ? { boxShadow: `0 0 24px ${cfg.glow}, 0 0 4px ${cfg.color}` } : undefined}
    >
      {/* Category color strip */}
      <div className="h-0.5 w-full" style={{ background: catColor }} />

      {/* Card body */}
      <div className="bg-[hsl(var(--card))] p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="font-mono font-black text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm"
              style={{ background: `${catColor}20`, color: catColor }}
            >
              {mission.category}
            </span>
          </div>
          {cfg.lockMsg ? (
            <Lock className="h-3.5 w-3.5 text-[hsl(var(--warning)/0.6)] shrink-0" aria-hidden />
          ) : isSelected ? (
            <CheckCircle className="h-4 w-4 text-[hsl(var(--primary))] shrink-0" />
          ) : (
            <Target className="h-4 w-4 text-[hsl(var(--muted-foreground)/0.3)] group-hover:text-[hsl(var(--primary)/0.6)] transition-colors shrink-0" />
          )}
        </div>

        {/* Mission number (large, faded) + title */}
        <div className="relative mb-3">
          <span
            className="absolute -top-1 -left-1 font-mono font-black text-6xl leading-none select-none pointer-events-none"
            style={{ color: isSelected ? `${cfg.color}` : "hsl(var(--foreground))", opacity: isSelected ? 0.08 : 0.05 }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className={cn(
            "font-mono font-black text-base leading-tight transition-colors",
            isSelected ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))]"
          )}>
            {mission.title}
          </h2>
        </div>

        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed mb-4 line-clamp-2">
          {mission.objective}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <DifficultyMeter difficulty={mission.difficulty} />
          <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground)/0.5)]">
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Clock className="h-2.5 w-2.5" />
              {mission.estimatedTime.split("–")[0].trim()}h
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Users className="h-2.5 w-2.5" />
              {mission.teamSize.split("–")[0].trim()}+
            </span>
          </div>
        </div>
      </div>

      {/* Selected indicator bar */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--primary))]" />
      )}
    </button>
  );
}

/* ── Detail panel ────────────────────────────────────────────────────────── */
function DetailPanel({ mission }: { mission: typeof missions[number] }) {
  const cfg = DIFFICULTY_CONFIG[mission.difficulty];
  const catColor = CATEGORY_COLORS[mission.category] ?? "hsl(var(--primary))";

  return (
    <div className="slide-down border border-[hsl(var(--primary)/0.3)] bg-[hsl(0_0%_5%)] rounded-sm overflow-hidden">
      {/* Panel header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: `${catColor}30`, background: `${catColor}08` }}
      >
        <div>
          <p className="system-label mb-0.5" style={{ color: catColor }}>
            Mission Brief
          </p>
          <h3 className="font-mono font-black text-xl text-[hsl(var(--foreground))]">
            {mission.title}
          </h3>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <DifficultyMeter difficulty={mission.difficulty} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-0">
        {/* Objective */}
        <div className="p-6 border-r border-[hsl(var(--border))]">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.6)] mb-3">
            Objective
          </p>
          <p className="text-sm text-[hsl(var(--foreground)/0.85)] leading-relaxed mb-5">
            {mission.objective}
          </p>

          <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.6)] mb-2">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {mission.skills.map(s => (
              <span
                key={s}
                className="px-2 py-1 font-mono text-[10px] rounded-sm"
                style={{ background: `${catColor}12`, color: catColor, border: `1px solid ${catColor}25` }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="p-6 border-r border-[hsl(var(--border))]">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.6)] mb-3">
            Deliverables
          </p>
          <ul className="space-y-2.5">
            {mission.deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="font-mono text-[10px] font-bold shrink-0 mt-0.5"
                  style={{ color: catColor }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-[hsl(var(--foreground)/0.8)]">{d}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-[hsl(var(--border)/0.5)] grid grid-cols-2 gap-3">
            <div>
              <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)] mb-0.5">Time</p>
              <p className="font-mono text-xs font-bold text-[hsl(var(--foreground)/0.8)]">{mission.estimatedTime}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)] mb-0.5">Crew Size</p>
              <p className="font-mono text-xs font-bold text-[hsl(var(--foreground)/0.8)]">{mission.teamSize}</p>
            </div>
          </div>
        </div>

        {/* Safety + CTA */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="border border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.06)] rounded-sm p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />
                <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--warning))]">Safety</p>
              </div>
              <p className="text-xs text-[hsl(var(--foreground)/0.65)] leading-relaxed">
                {mission.safetyNotes}
              </p>
            </div>
          </div>

          <Link href="/create">
            <Button
              className="w-full rounded-none font-mono font-black text-xs tracking-widest uppercase"
              style={{
                background: catColor,
                color: "hsl(0 0% 5%)",
              }}
            >
              Start This Mission <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function Missions() {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<string | null>("headline-autopsy");
  const detailRef = useRef<HTMLDivElement>(null);

  const filtered = (category === "all"
    ? missions
    : missions.filter(m => m.category === category)) as typeof missions[number][];

  const selectedMission = missions.find(m => m.id === selected) ?? null;

  function handleSelect(id: string) {
    if (selected === id) {
      setSelected(null);
    } else {
      setSelected(id);
      // Scroll detail panel into view on mobile
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  }

  // When filter changes, clear selection if it's not in the new filtered list
  useEffect(() => {
    if (selected && category !== "all") {
      const found = missions.find(m => m.id === selected);
      if (found && found.category !== category) setSelected(null);
    }
  }, [category, selected]);

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <p className="system-label mb-4">Youth Missions Library</p>
        <h1 className="font-black font-mono text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-3 leading-tight">
          Choose Your Mission
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-xl mb-3 leading-relaxed">
          Ten guided investigations for youth crews. Select a mission to see the full brief.
        </p>

        {/* Difficulty legend */}
        <div className="flex items-center gap-5 mb-10 flex-wrap">
          {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-2">
              <DifficultyMeter difficulty={key} />
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-[hsl(var(--muted-foreground)/0.5)]">
            <Lock className="h-3 w-3" />
            <span className="font-mono text-[10px] tracking-widest">High-clearance</span>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "px-4 py-1.5 font-mono text-xs tracking-widest uppercase border transition-all rounded-sm",
                category === c.id
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]"
                  : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.4)] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Mission card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {filtered.map((mission, i) => {
            const globalIndex = missions.findIndex(m => m.id === mission.id);
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                index={globalIndex}
                isSelected={selected === mission.id}
                onSelect={() => handleSelect(mission.id)}
              />
            );
          })}
        </div>

        {/* Detail panel */}
        <div ref={detailRef}>
          {selectedMission && (
            <DetailPanel mission={selectedMission} />
          )}
        </div>

        {!selectedMission && (
          <div className="border border-dashed border-[hsl(var(--border)/0.5)] rounded-sm py-6 text-center">
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.4)] tracking-widest">
              SELECT A MISSION TO VIEW THE BRIEF
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
