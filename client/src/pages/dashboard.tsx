import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, CheckCircle, AlertTriangle, Zap, MessageSquare, FileText, Users, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const PROTOCOL_STAGES = [
  { id: "crash_report", label: "Crash Report", status: "complete" },
  { id: "system_trace", label: "System Trace", status: "complete" },
  { id: "red_team_room", label: "Red Team Room", status: "active" },
  { id: "build_the_patch", label: "Build the Patch", status: "locked" },
  { id: "ship_with_receipts", label: "Ship With Receipts", status: "locked" },
  { id: "power_ping", label: "Power Ping", status: "locked" },
  { id: "patch_notes", label: "Patch Notes", status: "locked" },
];

const BADGES = [
  { id: "source-tracer", label: "Source Tracer", earned: true, icon: Shield },
  { id: "interview-builder", label: "Interview Builder", earned: true, icon: MessageSquare },
  { id: "ai-debugger", label: "AI Debugger", earned: false, icon: Zap },
  { id: "verification-lead", label: "Verification Lead", earned: false, icon: CheckCircle },
];

const STATUS_LABELS: Record<string, { label: string; cls: string; icon: typeof CheckCircle }> = {
  complete: { label: "Complete", cls: "badge-verified", icon: CheckCircle },
  active: { label: "In Progress", cls: "badge-progress", icon: Clock },
  locked: { label: "Locked", cls: "badge-pending", icon: Clock },
};

export default function Dashboard() {
  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">

        {/* Demo banner */}
        <div className="mb-8 border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.06)] px-5 py-3 rounded-sm flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] shrink-0" />
          <p className="font-mono text-xs text-[hsl(var(--warning)/0.9)]">
            <span className="font-bold">DEMO MODE</span> — This is a preview dashboard. Sign in to access your real crew, missions, and projects.
          </p>
          <Link href="/sign-in" className="ml-auto shrink-0">
            <Button size="sm" className="rounded-none font-mono text-xs tracking-widests bg-[hsl(var(--warning))] text-[hsl(0_0%_5%)] hover:bg-[hsl(var(--warning)/0.85)]">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Welcome */}
        <div className="terminal-box mb-8">
          <div className="terminal-header">
            <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] tracking-widests">SYSTEM DASHBOARD :: YOUTH MEMBER</span>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="system-label mb-1">Welcome back,</p>
                <h1 className="font-mono font-black text-3xl text-[hsl(var(--primary))]">Alex Rivera</h1>
                <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  Cohort: Spring 2026 · Crew: Transit Truth Crew
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
                <span className="font-mono text-xs text-[hsl(var(--primary))] tracking-widests">SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">

            {/* Active project */}
            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden card-accent-primary">
              <div className="bg-[hsl(0_0%_6%)] px-5 py-3 border-b border-[hsl(var(--border))]">
                <p className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">Active Project</p>
              </div>
              <div className="p-5">
                <h2 className="font-mono font-black text-lg text-[hsl(var(--foreground))] mb-1">The Bus Route Blackout</h2>
                <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mb-4">Transportation Access · Southside School District</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.7)] tracking-widests uppercase">Reboot Protocol Progress</p>
                    <p className="font-mono text-[10px] text-[hsl(var(--primary))]">Stage 3 / 7</p>
                  </div>
                  <div className="h-1.5 bg-[hsl(var(--border))] rounded-full overflow-hidden">
                    <div className="h-full bg-[hsl(var(--primary))] rounded-full" style={{ width: "43%" }} />
                  </div>
                </div>

                {/* Stage list */}
                <div className="space-y-2">
                  {PROTOCOL_STAGES.map((stage) => {
                    const s = STATUS_LABELS[stage.status];
                    const Icon = s.icon;
                    return (
                      <div key={stage.id} className="flex items-center justify-between py-1.5 border-b border-[hsl(var(--border)/0.5)] last:border-0">
                        <span className={cn(
                          "font-mono text-xs",
                          stage.status === "active" ? "text-[hsl(var(--primary))] font-bold" : stage.status === "complete" ? "text-[hsl(var(--foreground)/0.6)]" : "text-[hsl(var(--muted-foreground)/0.4)]"
                        )}>
                          {stage.label}
                        </span>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold", s.cls)}>
                          <Icon className="h-2.5 w-2.5" /> {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <div className="border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)] rounded-sm p-3 mb-4">
                    <p className="font-mono text-[10px] text-[hsl(var(--primary))] tracking-widests uppercase mb-1">Current Status</p>
                    <p className="font-mono text-xs text-[hsl(var(--foreground)/0.8)]">Red Team Review Pending — awaiting peer review from Crew #4</p>
                  </div>
                  <Link href="/create">
                    <Button className="w-full rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                      Continue Project <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden">
              <div className="bg-[hsl(0_0%_6%)] px-5 py-3 border-b border-[hsl(var(--border))]">
                <p className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">Recent Activity</p>
              </div>
              <div className="divide-y divide-[hsl(var(--border)/0.5)]">
                {[
                  { icon: FileText, text: "System Trace map updated — 6 new nodes added", time: "2 hours ago", color: "hsl(var(--primary))" },
                  { icon: Users, text: "Jordan Chen joined Transit Truth Crew", time: "Yesterday", color: "hsl(var(--accent))" },
                  { icon: MessageSquare, text: "Facilitator feedback received on Crash Report", time: "2 days ago", color: "hsl(var(--warning))" },
                  { icon: Shield, text: "3 evidence items marked as Verified", time: "3 days ago", color: "hsl(var(--primary))" },
                  { icon: Send, text: "AI Use Log entry recorded — Transcription task", time: "4 days ago", color: "hsl(var(--muted-foreground))" },
                ].map(({ icon: Icon, text, time, color }, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0 bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                      <Icon className="h-3 w-3" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[hsl(var(--foreground)/0.85)] leading-relaxed">{text}</p>
                    </div>
                    <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)] shrink-0">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Quick stats */}
            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden">
              <div className="bg-[hsl(0_0%_6%)] px-4 py-3 border-b border-[hsl(var(--border))]">
                <p className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">My Stats</p>
              </div>
              <div className="divide-y divide-[hsl(var(--border)/0.5)]">
                {[
                  { label: "Evidence Items", value: "14" },
                  { label: "Verified Sources", value: "9" },
                  { label: "AI Log Entries", value: "3" },
                  { label: "Missions Completed", value: "1" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{label}</span>
                    <span className="font-mono font-black text-sm text-[hsl(var(--primary))]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden">
              <div className="bg-[hsl(0_0%_6%)] px-4 py-3 border-b border-[hsl(var(--border))]">
                <p className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">Skill Badges</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {BADGES.map(({ id, label, earned, icon: Icon }) => (
                  <div
                    key={id}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 border rounded-sm text-center",
                      earned
                        ? "border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)]"
                        : "border-[hsl(var(--border)/0.5)] opacity-40"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", earned ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground))]")} />
                    <span className={cn("font-mono text-[9px] tracking-wide leading-tight text-center", earned ? "text-[hsl(var(--foreground)/0.8)]" : "text-[hsl(var(--muted-foreground)/0.5)]")}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden">
              <div className="bg-[hsl(0_0%_6%)] px-4 py-3 border-b border-[hsl(var(--border))]">
                <p className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">Upcoming</p>
              </div>
              <div className="divide-y divide-[hsl(var(--border)/0.5)]">
                {[
                  { label: "Red Team Review", date: "Tomorrow", urgent: true },
                  { label: "Crew Session", date: "Thu, May 8", urgent: false },
                  { label: "Facilitator Check-in", date: "Fri, May 9", urgent: false },
                ].map(({ label, date, urgent }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      {urgent && <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--warning))] animate-pulse shrink-0" />}
                      <span className="font-mono text-xs text-[hsl(var(--foreground)/0.8)]">{label}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.6)]">{date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
