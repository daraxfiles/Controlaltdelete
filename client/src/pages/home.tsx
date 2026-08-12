import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, AlertTriangle, Zap, CheckCircle, Clock, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaPatch } from "@shared/schema";

/* ── Count-up hook ──────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800, delay = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      const start = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress >= 1) clearInterval(timer);
      }, 16);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, target, duration, delay]);

  return { count, ref };
}

/* ── Platform launch strip ──────────────────────────────────────────────── */
const LAUNCH_SLOTS = [
  { label: "Patches Filed",      value: "—",    note: "None yet",          accent: "primary" },
  { label: "Crews Enrolled",     value: "—",    note: "Founding slots open", accent: "accent"  },
  { label: "Power Pings Sent",   value: "—",    note: "None yet",          accent: "primary" },
  { label: "Patch #001",         value: "OPEN", note: "Unassigned",        accent: "accent"  },
] as const;

function LaunchStrip() {
  return (
    <section className="border-y border-[hsl(var(--border))] bg-[hsl(0_0%_4%)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)/0.012) 2px, hsl(var(--foreground)/0.012) 4px)" }} />

      <div className="container mx-auto max-w-5xl px-6">
        {/* Status bar */}
        <div className="flex items-center gap-3 py-3 border-b border-[hsl(var(--border)/0.4)]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--primary))]" />
          </span>
          <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--primary)/0.9)] uppercase">
            Platform Status: Online
          </span>
          <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] ml-auto hidden sm:block">
            Archive is empty. It starts with you.
          </span>
        </div>

        {/* Slots */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[hsl(var(--border)/0.4)]">
          {LAUNCH_SLOTS.map(({ label, value, note, accent }) => (
            <div key={label} className="py-7 px-6 flex flex-col gap-1">
              <span
                className="font-mono font-black leading-none"
                style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                  color: `hsl(var(--${accent}))`,
                  textShadow: `0 0 20px hsl(var(--${accent}) / 0.35)`,
                  letterSpacing: value === "OPEN" ? "0.05em" : undefined,
                }}
              >
                {value}
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--muted-foreground)/0.7)] uppercase">
                {label}
              </span>
              <span className="font-mono text-[9px] text-[hsl(var(--muted-foreground)/0.35)] uppercase tracking-wider">
                {note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Terminal animation ─────────────────────────────────────────────────── */
const TERMINAL_LINES = [
  "SYSTEM STATUS: INFORMATION FAILURE DETECTED",
  "YOUTH ACCESS: GRANTED",
  "REBOOT SEQUENCE: READY",
];

function TerminalBootScreen() {
  const [done, setDone] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const line = TERMINAL_LINES[active];
    if (!line) { setFinished(true); return; }

    if (typed.length < line.length) {
      const t = setTimeout(() => setTyped(line.slice(0, typed.length + 1)), 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDone(p => [...p, line]);
        setTyped("");
        setActive(p => p + 1);
      }, 500);
      return () => clearTimeout(t);
    }
  });

  return (
    <div className="terminal-box max-w-xl w-full">
      <div className="terminal-header">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[hsl(var(--muted-foreground))] text-[10px] font-mono ml-2 tracking-widest">
          CTRL+ALT+MEDIA :: REBOOT TERMINAL
        </span>
      </div>
      <div className="p-4 space-y-1.5 min-h-[100px]">
        {done.map((line, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[hsl(var(--primary)/0.5)]">›</span>
            <span className="text-[hsl(var(--primary))]">{line}</span>
            <CheckCircle className="h-3 w-3 text-[hsl(var(--primary))] ml-auto shrink-0" />
          </div>
        ))}
        {!finished && active < TERMINAL_LINES.length && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[hsl(var(--primary)/0.5)]">›</span>
            <span className="text-[hsl(var(--accent))]">
              {typed}
              <span className="cursor-blink">█</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Protocol stages ────────────────────────────────────────────────────── */
const STAGES = [
  {
    num: "01",
    id: "crash_report",
    label: "Crash Report",
    desc: "Identify the information failure. What went wrong, who is affected, and what evidence exists?",
    color: "hsl(var(--destructive))",
  },
  {
    num: "02",
    id: "system_trace",
    label: "System Trace",
    desc: "Map the information ecosystem. Track how stories spread, change, and who controls the narrative.",
    color: "hsl(var(--warning))",
  },
  {
    num: "03",
    id: "red_team_room",
    label: "Red Team Room",
    desc: "A different crew challenges your work. What's missing? What needs stronger evidence?",
    color: "hsl(var(--chart-4))",
  },
  {
    num: "04",
    id: "build_the_patch",
    label: "Build the Patch",
    desc: "Create the alternative media the public information system failed to provide.",
    color: "hsl(var(--chart-5))",
  },
  {
    num: "05",
    id: "ship_with_receipts",
    label: "Ship With Receipts",
    desc: "Every published patch includes a public Evidence Receipt. No Receipt. No Reboot.",
    color: "hsl(var(--accent))",
  },
  {
    num: "06",
    id: "power_ping",
    label: "Power Ping",
    desc: "Send an evidence-based request to the person or institution with the power to respond.",
    color: "hsl(var(--primary))",
  },
  {
    num: "07",
    id: "patch_notes",
    label: "Patch Notes",
    desc: "Document what changed. What was promised? What still needs to happen?",
    color: "hsl(var(--primary))",
  },
];

/* ── Verification badge ────────────────────────────────────────────────── */
function VerificationBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    verified: { label: "Verified", cls: "badge-verified" },
    partially_verified: { label: "Partially Verified", cls: "badge-progress" },
    pending: { label: "Pending Review", cls: "badge-pending" },
    disputed: { label: "Disputed", cls: "badge-error" },
  };
  const s = map[status] ?? map["pending"];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-wide", s.cls)}>
      <Shield className="h-2.5 w-2.5" /> {s.label}
    </span>
  );
}

function ResponseBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: typeof CheckCircle }> = {
    responded: { label: "Response Received", cls: "badge-responded", icon: CheckCircle },
    action_promised: { label: "Action Promised", cls: "badge-verified", icon: CheckCircle },
    pending: { label: "Awaiting Response", cls: "badge-pending", icon: Clock },
    no_response: { label: "No Response", cls: "badge-error", icon: AlertTriangle },
  };
  const s = map[status] ?? map["pending"];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-wide", s.cls)}>
      <Icon className="h-2.5 w-2.5" /> {s.label}
    </span>
  );
}

/* ── Media Patch card ───────────────────────────────────────────────────── */
function PatchCard({ patch }: { patch: MediaPatch }) {
  const mediaTypeLabels: Record<string, string> = {
    article: "Article",
    photo_essay: "Photo Essay",
    podcast: "Podcast",
    short_documentary: "Documentary",
    social_video_series: "Social Video",
    interactive_timeline: "Timeline",
    data_story: "Data Story",
    community_resource_guide: "Resource Guide",
    myth_vs_evidence: "Myth vs. Evidence",
    digital_zine: "Digital Zine",
    public_information_page: "Public Info",
    campaign_page: "Campaign",
  };

  return (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden hover:border-[hsl(var(--primary)/0.4)] transition-colors group card-accent-primary">
      {/* Header */}
      <div className="bg-[hsl(0_0%_6%)] px-4 py-3 border-b border-[hsl(var(--border))] flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
          {mediaTypeLabels[patch.mediaType] ?? patch.mediaType}
        </span>
        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.6)]">
          #{patch.id.slice(-6).toUpperCase()}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-black text-base text-[hsl(var(--foreground))] mb-1 leading-tight group-hover:text-[hsl(var(--primary))] transition-colors">
          {patch.title}
        </h3>
        <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mb-1">
          {patch.crewName} · {patch.community}
        </p>
        <p className="font-mono text-[10px] text-[hsl(var(--accent)/0.8)] mb-3 uppercase tracking-wide">
          {patch.topic}
        </p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
          {patch.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <VerificationBadge status={patch.verificationStatus} />
          <ResponseBadge status={patch.institutionalResponseStatus} />
        </div>
      </div>

      <div className="px-5 py-3 border-t border-[hsl(var(--border))] flex items-center justify-between">
        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)] uppercase tracking-widest">
          Stage: {patch.stage.replace(/_/g, " ")}
        </span>
        <Link href={`/media-patches`}>
          <span className="flex items-center gap-1 font-mono text-xs text-[hsl(var(--primary))] hover:gap-2 transition-all">
            View Patch <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function Home() {
  const { data: patches = [] } = useQuery<MediaPatch[]>({
    queryKey: ["/api/media-patches"],
  });
  const featured = patches.filter(p => p.featured).slice(0, 3);
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="bg-background">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[hsl(0_0%_3%)]">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--background))]" />

        {/* Scan line */}
        <div className="scan-line" />

        <div className="relative z-10 px-6 max-w-5xl mx-auto w-full py-32">
          <p className="system-label mb-8 flex items-center gap-3">
            <span className="w-4 h-px bg-[hsl(var(--primary)/0.5)]" />
            Youth-Powered Civic Media Lab
            <span className="w-4 h-px bg-[hsl(var(--primary)/0.5)]" />
          </p>

          <div className="mb-6">
            <h1 className="font-black leading-[0.88] tracking-tight font-mono glitch">
              <span className="block text-[clamp(3rem,9vw,7.5rem)] text-[hsl(var(--foreground))]">
                CTRL+ALT+
              </span>
              <span className="block text-[clamp(3rem,9vw,7.5rem)] text-[hsl(var(--primary))] text-glow-primary">
                MEDIA
              </span>
            </h1>
          </div>

          <div className="border-l-2 border-[hsl(var(--primary)/0.5)] pl-5 mb-10 max-w-2xl">
            <p className="text-[hsl(var(--foreground))] text-xl md:text-2xl font-bold leading-snug mb-2">
              The public record has crashed. Youth reboot it.
            </p>
            <p className="text-[hsl(var(--muted-foreground))] text-sm md:text-base leading-relaxed">
              CTRL+ALT+MEDIA is a youth-powered creative technology and civic media lab. Young people investigate failures in the information system, build verified alternatives, and take their work directly to the people with the power to respond.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16">
            <Link href="/create">
              <Button
                size="lg"
                className="rounded-none px-8 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.85)] font-mono font-bold text-sm tracking-widest uppercase shadow-xl shadow-[hsl(var(--primary)/0.25)] glow-primary"
              >
                Start the Reboot <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/media-patches">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-none px-8 text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--primary)/0.06)] font-mono font-semibold text-sm uppercase tracking-widest"
              >
                Explore Media Patches
              </Button>
            </Link>
          </div>

          <TerminalBootScreen />
        </div>
      </section>

      {/* ── LAUNCH STRIP ────────────────────────────────────────────── */}
      <LaunchStrip />

      {/* ── THREE KEYS ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[hsl(0_0%_5%)] border-y border-[hsl(var(--border))]">
        <div className="container mx-auto max-w-5xl">
          <p className="system-label mb-4 text-center">The Name Means Something</p>
          <h2 className="text-center text-3xl md:text-4xl font-black font-mono text-[hsl(var(--foreground))] mb-4">
            Every key is a <span className="gradient-text">command</span>
          </h2>
          <p className="text-center text-[hsl(var(--muted-foreground))] text-sm mb-16 max-w-xl mx-auto">
            We replaced <span className="font-mono text-[hsl(var(--destructive))] line-through">DELETE</span> with{" "}
            <span className="font-mono text-[hsl(var(--primary))]">MEDIA</span>{" "}
            because erasure is part of the problem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[hsl(var(--border))]">
            {[
              {
                key: "CTRL",
                tagline: "Reclaim control of the narrative.",
                desc: "Youth don't just consume information — they trace its origins, challenge its framers, and reclaim the power to define what gets counted as truth.",
                color: "hsl(var(--primary))",
                accent: "card-accent-primary",
              },
              {
                key: "ALT",
                tagline: "Build the alternative that was missing.",
                desc: "When the information system fails — through silence, distortion, or exclusion — youth build the story that should have existed.",
                color: "hsl(var(--accent))",
                accent: "card-accent-accent",
              },
              {
                key: "MEDIA",
                tagline: "Create what the system failed to provide.",
                desc: "Not reaction. Not commentary. Verified, evidence-based, community-centered media that fills the gap and shifts the record.",
                color: "hsl(var(--warning))",
                accent: "card-accent-warning",
              },
            ].map(({ key, tagline, desc, color, accent }) => (
              <div
                key={key}
                className={cn("p-8 border-[hsl(var(--border))] border-r last:border-r-0 bg-[hsl(var(--card))]", accent)}
              >
                <div className="font-black font-mono text-5xl mb-4" style={{ color }}>
                  {key}
                </div>
                <p className="font-bold text-[hsl(var(--foreground))] mb-3 leading-tight">{tagline}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE REBOOT PROTOCOL ─────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <p className="system-label mb-4">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-black font-mono text-[hsl(var(--foreground))] mb-3">
            The Reboot Protocol
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-12 max-w-xl">
            Seven stages from identifying an information failure to documenting what changed.
          </p>

          {/* Desktop: horizontal stage selector */}
          <div className="hidden md:block">
            <div className="flex border border-[hsl(var(--border))] mb-0">
              {STAGES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStage(i)}
                  className={cn(
                    "flex-1 py-3 px-2 text-center border-r last:border-r-0 border-[hsl(var(--border))] transition-colors",
                    activeStage === i
                      ? "bg-[hsl(var(--primary)/0.12)] border-b-2 border-b-[hsl(var(--primary))]"
                      : "hover:bg-[hsl(var(--foreground)/0.03)]"
                  )}
                >
                  <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] mb-1">{s.num}</div>
                  <div className={cn("font-mono font-bold text-xs", activeStage === i ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--foreground)/0.7)]")}>
                    {s.label}
                  </div>
                </button>
              ))}
            </div>
            <div className="border border-t-0 border-[hsl(var(--border))] p-8 bg-[hsl(var(--card))]">
              <div className="flex items-start gap-6">
                <div className="font-black font-mono text-6xl text-[hsl(var(--primary)/0.2)]">
                  {STAGES[activeStage].num}
                </div>
                <div>
                  <h3 className="font-black font-mono text-2xl text-[hsl(var(--foreground))] mb-3">
                    {STAGES[activeStage].label}
                  </h3>
                  <p className="text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xl">
                    {STAGES[activeStage].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-3">
            {STAGES.map((s) => (
              <div key={s.id} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 rounded-sm card-accent-primary">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono font-black text-sm text-[hsl(var(--primary)/0.5)]">{s.num}</span>
                  <h3 className="font-mono font-bold text-sm text-[hsl(var(--foreground))]">{s.label}</h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/reboot-protocol">
              <Button variant="ghost" className="rounded-none font-mono text-xs tracking-widest uppercase border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] hover:text-[hsl(var(--primary))]">
                Learn the Full Protocol <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOUNDING CREW ───────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[hsl(0_0%_5%)] border-y border-[hsl(var(--border))]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left: terminal display */}
            <div className="terminal-box overflow-hidden">
              <div className="terminal-header">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest ml-2">
                  ARCHIVE :: STATUS
                </span>
              </div>
              <div className="p-6 space-y-4 font-mono text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-[hsl(var(--primary)/0.5)]">›</span>
                  <span className="text-[hsl(var(--muted-foreground))]">QUERYING PATCH ARCHIVE…</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[hsl(var(--primary)/0.5)]">›</span>
                  <span className="text-[hsl(var(--muted-foreground))]">PATCHES FOUND: <span className="text-[hsl(var(--foreground))] font-black">0</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[hsl(var(--primary)/0.5)]">›</span>
                  <span className="text-[hsl(var(--muted-foreground))]">PATCH #001: <span className="text-[hsl(var(--primary))] font-black">UNASSIGNED</span></span>
                </div>
                <div className="border-t border-[hsl(var(--border))] pt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[hsl(var(--accent)/0.5)]">›</span>
                    <span className="text-[hsl(var(--accent)/0.8)]">FOUNDING CREW STATUS: <span className="text-[hsl(var(--accent))] font-black">AVAILABLE</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[hsl(var(--accent)/0.5)]">›</span>
                    <span className="text-[hsl(var(--accent)/0.7)] text-xs">First crews to publish earn permanent</span>
                  </div>
                  <div className="flex items-center gap-3 pl-4">
                    <span className="text-[hsl(var(--accent))] font-black text-xs">FOUNDING CREW</span>
                    <span className="text-[hsl(var(--accent)/0.7)] text-xs">badge on every patch.</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-[hsl(var(--primary)/0.5)]">›</span>
                  <span className="text-[hsl(var(--primary))]">READY FOR FIRST SUBMISSION<span className="cursor-blink">█</span></span>
                </div>
              </div>
            </div>

            {/* Right: copy */}
            <div>
              <p className="system-label mb-4">Public Archive</p>
              <h2 className="text-3xl md:text-4xl font-black font-mono text-[hsl(var(--foreground))] mb-5 leading-tight">
                The archive starts at zero.{" "}
                <span className="text-[hsl(var(--primary))]">It starts with you.</span>
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
                No patches have been filed. No investigations published. The public record of this platform is completely empty — and the first crew to submit a verified Media Patch will be part of its permanent history.
              </p>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-8">
                Every patch filed in the founding period carries a <span className="font-mono text-[hsl(var(--accent))] font-bold">FOUNDING CREW</span> badge that never goes away.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Pick a mission from the library",
                  "Follow the 7-stage Reboot Protocol",
                  "File your patch with a public Evidence Receipt",
                  "Earn Founding Crew status — permanently",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-mono font-black text-xs text-[hsl(var(--primary)/0.5)] shrink-0 mt-0.5 w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-[hsl(var(--foreground)/0.8)]">{step}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link href="/create">
                  <Button className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-black text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] px-6">
                    File Patch #001 <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </Link>
                <Link href="/missions">
                  <Button variant="ghost" className="rounded-none font-mono text-xs tracking-widest uppercase border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:text-[hsl(var(--primary))]">
                    Browse Missions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="system-label mb-4">Why This Matters</p>
              <h2 className="text-3xl md:text-4xl font-black font-mono text-[hsl(var(--foreground))] mb-6 leading-tight">
                Young people should not only{" "}
                <span className="text-[hsl(var(--muted-foreground))] line-through decoration-[hsl(var(--destructive))]">consume</span>{" "}
                media critically.
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
                They should gain the skills, tools, confidence, and public platform to reshape the information systems affecting their lives. CTRL+ALT+MEDIA equips young people not just to read the system — but to rewrite it.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Zap, text: "Investigate real information failures in their communities" },
                  { icon: Shield, text: "Build verified, evidence-based alternative media" },
                  { icon: Send, text: "Deliver their work directly to decision-makers" },
                  { icon: CheckCircle, text: "Document what changes as a result" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-sm bg-[hsl(var(--primary)/0.1)] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-3 w-3 text-[hsl(var(--primary))]" />
                    </div>
                    <p className="text-sm text-[hsl(var(--foreground)/0.8)]">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="terminal-box">
              <div className="terminal-header">
                <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] tracking-widest">PROGRAM STATS</span>
              </div>
              <div className="p-6 space-y-6">
                {[
                  { label: "Ages Served", value: "14–24", sub: "Youth & young adults" },
                  { label: "Reboot Stages", value: "07", sub: "From crash to patch" },
                  { label: "Media Formats", value: "12+", sub: "Articles to zines" },
                  { label: "Required on every patch", value: "Evidence Receipt", sub: "No Receipt. No Reboot." },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="border-b border-[hsl(var(--primary)/0.1)] pb-5 last:border-0 last:pb-0">
                    <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest uppercase mb-1">{label}</div>
                    <div className="font-mono font-black text-2xl text-[hsl(var(--primary))]">{value}</div>
                    <div className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.6)]">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[hsl(0_0%_3%)] border-t border-[hsl(var(--border))]">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="system-label mb-6 justify-center flex">The Call</p>
          <h2 className="font-black font-mono text-4xl md:text-6xl text-[hsl(var(--foreground))] mb-6 leading-tight">
            Don't just read the system.{" "}
            <span className="text-[hsl(var(--primary))] text-glow-primary">Rewrite it.</span>
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] max-w-xl mx-auto mb-10 text-base leading-relaxed">
            Join a Reboot Crew, complete a mission, and build the media your community is missing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create">
              <Button
                size="lg"
                className="rounded-none px-10 py-6 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.85)] font-mono font-black text-sm tracking-widest uppercase shadow-xl shadow-[hsl(var(--primary)/0.3)] glow-primary"
              >
                Join a Reboot Crew
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-none px-10 py-6 border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.05)] font-mono text-sm tracking-widest uppercase text-[hsl(var(--foreground)/0.7)]"
              >
                Bring CTRL+ALT+MEDIA to Your Community
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
