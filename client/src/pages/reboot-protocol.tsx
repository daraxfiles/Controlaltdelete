import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, AlertTriangle, Search, Users, Hammer,
  FileCheck, Send, BookOpen, CheckCircle, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    num: "01",
    id: "crash_report",
    label: "Crash Report",
    icon: AlertTriangle,
    color: "hsl(0 72% 55%)",
    summary: "Identify the failure",
    tag: "INITIATE",
    desc: "Define what has gone wrong in the information system. What claim, story, silence, stereotype, or information gap are you investigating? Who is affected, and what evidence suggests this is a real problem?",
    inputs: [
      "What has gone wrong?",
      "Who is affected and how?",
      "What evidence suggests this is real?",
      "What assumptions are you making?",
      "What do you still need to learn?",
      "What risks come from investigating or publishing?",
    ],
    output: "A formatted one-page Crash Report",
  },
  {
    num: "02",
    id: "system_trace",
    label: "System Trace",
    icon: Search,
    color: "hsl(28 100% 55%)",
    summary: "Map the ecosystem",
    tag: "INVESTIGATE",
    desc: "Build an interactive map of how information has moved, changed, and been controlled. Trace the origins of claims, who repeated them, who amplified or corrected them, and whose voice was missing.",
    inputs: [
      "Original claim sources",
      "Social media posts & shares",
      "News articles & coverage",
      "Public documents & records",
      "Organizational funding & interests",
      "Missing voices & ignored corrections",
    ],
    output: "A visual System Trace map with timeline view",
  },
  {
    num: "03",
    id: "red_team_room",
    label: "Red Team Room",
    icon: Users,
    color: "hsl(262 83% 65%)",
    summary: "Challenge your own work",
    tag: "VERIFY",
    desc: "A different Reboot Crew or facilitator challenges your investigation before you build the patch. They look for weak evidence, missing perspectives, exaggerated language, and ethical concerns.",
    inputs: [
      "Which claims need stronger evidence?",
      "Which voices or perspectives are missing?",
      "Is any language exaggerated or misleading?",
      "Is the project confusing fact and opinion?",
      "Has AI introduced unsupported information?",
      "Are there privacy, safety, or ethical concerns?",
    ],
    output: "Review decision: Continue, Revise, or Pause",
  },
  {
    num: "04",
    id: "build_the_patch",
    label: "Build the Patch",
    icon: Hammer,
    color: "hsl(185 90% 52%)",
    summary: "Create the alternative",
    tag: "BUILD",
    desc: "Build the media piece the public information system failed to provide. Choose the format that best serves the story and the audience — article, photo essay, podcast, documentary, data story, and more.",
    inputs: [
      "Select media format",
      "Draft with headings, images, video, audio",
      "Include community voice and verified sources",
      "Add multilingual versions if needed",
      "Preview in desktop and mobile formats",
    ],
    output: "A completed Media Patch ready for review",
  },
  {
    num: "05",
    id: "ship_with_receipts",
    label: "Ship With Receipts",
    icon: FileCheck,
    color: "hsl(145 85% 48%)",
    summary: "Every claim, sourced",
    tag: "DOCUMENT",
    desc: "Every published Media Patch must include a public Evidence Receipt. This is a transparent record of every claim, source, interview, document, and verification step. No Receipt. No Reboot.",
    inputs: [
      "Main claims and supporting sources",
      "Interviews conducted",
      "Documents reviewed",
      "Verification steps taken",
      "Corrections and conflicts of interest",
      "What remains uncertain",
    ],
    output: "A public Evidence Receipt linked to the patch",
  },
  {
    num: "06",
    id: "power_ping",
    label: "Power Ping",
    icon: Send,
    color: "hsl(145 85% 48%)",
    summary: "Reach the decision-maker",
    tag: "TRANSMIT",
    desc: "Send an evidence-based request for response to the person or institution with the power to act. The platform generates a professional message draft. Crews track whether they receive a response.",
    inputs: [
      "Recipient name, organization, and role",
      "Why this person or institution should respond",
      "Three specific questions",
      "Link to the published Media Patch",
      "Response deadline and follow-up date",
    ],
    output: "A tracked Power Ping with delivery and response status",
  },
  {
    num: "07",
    id: "patch_notes",
    label: "Patch Notes",
    icon: BookOpen,
    color: "hsl(145 85% 48%)",
    summary: "Document what changed",
    tag: "RECORD",
    desc: "Every Reboot ends with Patch Notes — a public record of what was broken, what the crew built, who responded, what action was promised, and what still needs to happen. The public accountability layer.",
    inputs: [
      "What was broken?",
      "What did we build?",
      "What changed?",
      "Who responded and what did they promise?",
      "What remains unresolved?",
      "What did our team learn?",
    ],
    output: "A visual project update timeline published to the record",
  },
];

/* ── Node status ─────────────────────────────────────────────────────────── */
type NodeStatus = "complete" | "active" | "future";

function nodeStatus(index: number, active: number): NodeStatus {
  if (index < active) return "complete";
  if (index === active) return "active";
  return "future";
}

/* ── Stage node ──────────────────────────────────────────────────────────── */
function StageNode({
  stage,
  index,
  status,
  isLast,
  onClick,
}: {
  stage: typeof STAGES[number];
  index: number;
  status: NodeStatus;
  isLast: boolean;
  onClick: () => void;
}) {
  const Icon = stage.icon;

  return (
    <div className="flex gap-0">
      {/* Left: connector track */}
      <div className="flex flex-col items-center" style={{ width: 56 }}>
        {/* Node circle */}
        <button
          onClick={onClick}
          aria-label={`Go to stage ${stage.num}: ${stage.label}`}
          className={cn(
            "relative z-10 w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))]",
            status === "active"
              ? "node-active border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.12)]"
              : status === "complete"
              ? "border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.06)] hover:border-[hsl(var(--primary)/0.7)]"
              : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.3)]"
          )}
        >
          {status === "complete" ? (
            <CheckCircle className="h-4 w-4 text-[hsl(var(--primary)/0.6)]" />
          ) : (
            <Icon
              className="h-4 w-4 transition-colors"
              style={{ color: status === "active" ? stage.color : "hsl(var(--muted-foreground) / 0.4)" }}
            />
          )}

          {/* Pulsing ring for active node */}
          {status === "active" && (
            <span
              className="absolute inset-0 rounded-full node-active-ring border-2"
              style={{ borderColor: stage.color, opacity: 0.4 }}
            />
          )}
        </button>

        {/* Connector line */}
        {!isLast && (
          <div className="relative flex-1 w-px my-1" style={{ minHeight: 40, background: "hsl(var(--border))" }}>
            {status === "active" && (
              <div className="connector-dot" />
            )}
          </div>
        )}
      </div>

      {/* Right: stage content */}
      <div className="flex-1 min-w-0 pb-2">
        {/* Stage header row */}
        <button
          onClick={onClick}
          className="w-full text-left group py-3 pl-4 pr-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Stage num + tag */}
              <span className={cn(
                "font-mono text-[10px] font-bold tracking-widest shrink-0 px-2 py-0.5 rounded-sm",
                status === "active"
                  ? "text-[hsl(0_0%_5%)] bg-[hsl(var(--primary))]"
                  : status === "complete"
                  ? "text-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.08)]"
                  : "text-[hsl(var(--muted-foreground)/0.4)] bg-[hsl(var(--border)/0.5)]"
              )}>
                {stage.num}
              </span>
              <div className="min-w-0">
                <h2 className={cn(
                  "font-mono font-black text-base leading-tight transition-colors",
                  status === "active"
                    ? "text-[hsl(var(--foreground))]"
                    : status === "complete"
                    ? "text-[hsl(var(--foreground)/0.5)]"
                    : "text-[hsl(var(--foreground)/0.4)] group-hover:text-[hsl(var(--foreground)/0.7)]"
                )}>
                  {stage.label}
                </h2>
                <p className={cn(
                  "font-mono text-[10px] tracking-widest uppercase",
                  status === "active" ? "text-[hsl(var(--muted-foreground))]" : "text-[hsl(var(--muted-foreground)/0.35)]"
                )}>
                  {stage.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={cn(
                "font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-sm hidden sm:inline",
                status === "active"
                  ? "border border-current opacity-100"
                  : "opacity-0"
              )}
                style={{ color: stage.color, borderColor: `${stage.color}50` }}
              >
                {stage.tag}
              </span>
              <ChevronRight className={cn(
                "h-4 w-4 transition-all",
                status === "active"
                  ? "text-[hsl(var(--primary))] rotate-90"
                  : "text-[hsl(var(--muted-foreground)/0.3)] group-hover:text-[hsl(var(--muted-foreground)/0.6)]"
              )} />
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {status === "active" && (
          <div className="slide-down ml-4 mr-3 mb-4 border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden"
            style={{ borderLeftColor: stage.color, borderLeftWidth: 2 }}>
            <div className="p-6 grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-5">
                  {stage.desc}
                </p>
                <div className="border-t border-[hsl(var(--border))] pt-4">
                  <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.6)] tracking-widest uppercase mb-2">Output</p>
                  <p className="font-mono text-sm font-bold" style={{ color: stage.color }}>{stage.output}</p>
                </div>
              </div>

              <div>
                <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.6)] tracking-widest uppercase mb-3">
                  Key Questions
                </p>
                <div className="space-y-2">
                  {stage.inputs.map((input, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5 border-b border-[hsl(var(--border)/0.4)] last:border-0">
                      <span className="font-mono text-[10px] font-bold shrink-0 mt-0.5" style={{ color: `${stage.color}70` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-[hsl(var(--foreground)/0.75)]">{input}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage nav footer */}
            <div className="border-t border-[hsl(var(--border))] px-6 py-3 flex items-center justify-between bg-[hsl(0_0%_5%)]">
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)] tracking-widest">
                STAGE {stage.num} / 07
              </span>
              {index < STAGES.length - 1 ? (
                <button
                  className="flex items-center gap-1.5 font-mono text-xs text-[hsl(var(--primary))] hover:gap-2.5 transition-all"
                  onClick={() => {}}
                >
                  Next: {STAGES[index + 1].label}
                  <ArrowRight className="h-3 w-3" />
                </button>
              ) : (
                <Link href="/create">
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[hsl(var(--primary))] hover:gap-2.5 transition-all">
                    Start Your Reboot <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function RebootProtocol() {
  const [active, setActive] = useState(0);

  function goTo(i: number) {
    setActive(i);
  }

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <p className="system-label mb-4">Framework</p>
          <h1 className="font-black font-mono text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4 leading-tight">
            The Reboot Protocol
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mb-4 text-base leading-relaxed">
            A seven-stage investigation and media production framework. Every stage builds on the last — from identifying an information failure to documenting what changed as a result.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {["Find the failure.", "Build the alternative.", "Shift the record."].map((line, i) => (
              <span key={i} className="font-mono text-xs text-[hsl(var(--primary)/0.6)] px-3 py-1 border border-[hsl(var(--primary)/0.2)] rounded-sm">
                {line}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-10 flex items-center gap-4">
            <div className="flex-1 h-1 bg-[hsl(var(--border))] rounded-full overflow-hidden">
              <div
                className="h-full bg-[hsl(var(--primary))] transition-all duration-500 rounded-full"
                style={{ width: `${((active + 1) / STAGES.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs text-[hsl(var(--primary))] shrink-0 tabular-nums">
              {active + 1} / {STAGES.length}
            </span>
          </div>

          {/* Two-column layout: timeline left, quick-jump right */}
          <div className="grid lg:grid-cols-[1fr_220px] gap-8 items-start">

            {/* Timeline */}
            <div>
              {STAGES.map((stage, i) => (
                <StageNode
                  key={stage.id}
                  stage={stage}
                  index={i}
                  status={nodeStatus(i, active)}
                  isLast={i === STAGES.length - 1}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            {/* Quick-jump sidebar */}
            <div className="hidden lg:block sticky top-28">
              <div className="terminal-box overflow-hidden">
                <div className="terminal-header">
                  <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest">
                    JUMP TO STAGE
                  </span>
                </div>
                <div className="divide-y divide-[hsl(var(--border)/0.5)]">
                  {STAGES.map((s, i) => {
                    const status = nodeStatus(i, active);
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => goTo(i)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
                          status === "active"
                            ? "bg-[hsl(var(--primary)/0.1)]"
                            : "hover:bg-[hsl(var(--foreground)/0.03)]"
                        )}
                      >
                        <Icon
                          className="h-3 w-3 shrink-0"
                          style={{ color: status === "active" ? s.color : status === "complete" ? "hsl(var(--primary) / 0.4)" : "hsl(var(--muted-foreground) / 0.3)" }}
                        />
                        <span className={cn(
                          "font-mono text-[10px] truncate",
                          status === "active" ? "text-[hsl(var(--foreground))] font-bold" : status === "complete" ? "text-[hsl(var(--muted-foreground)/0.5)]" : "text-[hsl(var(--muted-foreground)/0.3)]"
                        )}>
                          {s.num} {s.label}
                        </span>
                        {status === "complete" && (
                          <CheckCircle className="h-2.5 w-2.5 text-[hsl(var(--primary)/0.4)] ml-auto shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Link href="/create" className="block mt-4">
                <Button className="w-full rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-black text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                  Start Reboot <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="lg:hidden mt-10 text-center">
            <Link href="/create">
              <Button className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-black text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] px-8">
                Start Your Reboot <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// Need ChevronRight
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
