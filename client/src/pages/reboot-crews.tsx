import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE_CREWS = [
  {
    name: "Transit Truth Crew",
    community: "Southside School District",
    members: 5,
    project: "The Bus Route Blackout",
    stage: "Red Team Room",
    status: "active",
  },
  {
    name: "The Record Crew",
    community: "Riverside Neighborhood",
    members: 4,
    project: "What the Headline Left Out",
    stage: "Patch Notes",
    status: "published",
  },
  {
    name: "Archive Reboots",
    community: "Eastbrook Community",
    members: 6,
    project: "AI Does Not Know Our History",
    stage: "Power Ping",
    status: "active",
  },
];

const CREW_ROLES = [
  { role: "Crew Lead", desc: "Creates the project, assigns responsibilities, and submits work for review." },
  { role: "Evidence Lead", desc: "Manages the Evidence Stack and verifies all sources." },
  { role: "Interview Lead", desc: "Plans and conducts interviews, manages consent records." },
  { role: "Media Builder", desc: "Leads the Media Patch construction in the chosen format." },
  { role: "AI Monitor", desc: "Maintains the AI Use Log and flags unsupported AI outputs." },
  { role: "Power Ping Lead", desc: "Drafts and tracks institutional communications." },
];

export default function RebootCrews() {
  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <p className="system-label mb-4">Collaborative Teams</p>
        <h1 className="font-black font-mono text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4 leading-tight">
          Reboot Crews
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-xl mb-12 leading-relaxed">
          Every investigation is built by a Reboot Crew — a small team of youth working together through all seven stages of the Reboot Protocol. No solo reboots. The record requires collaboration.
        </p>

        {/* How crews work */}
        <section className="mb-16">
          <p className="system-label mb-6">How Crews Work</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[hsl(var(--border))]">
            {[
              { icon: Users, color: "hsl(var(--primary))", title: "2–6 Youth Members", desc: "Each crew has between 2 and 6 members. Smaller crews move faster; larger crews can take on more complex investigations." },
              { icon: Zap, color: "hsl(var(--accent))", title: "One Project at a Time", desc: "Crews focus on a single Reboot Project from Crash Report through Patch Notes before starting a new investigation." },
              { icon: Shield, color: "hsl(var(--warning))", title: "Facilitator Oversight", desc: "Every crew is connected to a facilitator who can review work, approve publication, and pause a project if safety concerns arise." },
              { icon: Clock, color: "hsl(var(--chart-5))", title: "Red Team Review Required", desc: "Before building the Media Patch, a different crew must complete a Red Team Review. No crew reviews its own work." },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div
                key={title}
                className={cn(
                  "p-7 border-[hsl(var(--border))]",
                  i % 2 === 0 ? "border-r" : "",
                  i < 2 ? "border-b" : ""
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)]">
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <h3 className="font-mono font-bold text-sm text-[hsl(var(--foreground))]">{title}</h3>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Crew roles */}
        <section className="mb-16">
          <p className="system-label mb-6">Crew Roles</p>
          <div className="space-y-2">
            {CREW_ROLES.map(({ role, desc }) => (
              <div key={role} className="flex items-start gap-4 border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 rounded-sm hover:border-[hsl(var(--primary)/0.3)] transition-colors">
                <span className="font-mono font-bold text-xs text-[hsl(var(--primary))] mt-0.5 shrink-0 w-28">{role}</span>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Active crews */}
        <section className="mb-16">
          <p className="system-label mb-6">Active Crews</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_CREWS.map((crew) => (
              <div key={crew.name} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden card-accent-primary">
                <div className="bg-[hsl(0_0%_6%)] px-4 py-2.5 border-b border-[hsl(var(--border))] flex items-center justify-between">
                  <span className={cn(
                    "px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-wide",
                    crew.status === "published" ? "badge-verified" : "badge-progress"
                  )}>
                    {crew.status === "published" ? "Published" : "Active"}
                  </span>
                  <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)]">
                    {crew.members} members
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-mono font-black text-sm text-[hsl(var(--foreground))] mb-1">{crew.name}</h3>
                  <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.7)] mb-3">{crew.community}</p>
                  <p className="text-xs text-[hsl(var(--foreground)/0.7)] mb-3">{crew.project}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)] uppercase tracking-widests">Stage:</span>
                    <span className="font-mono text-[10px] text-[hsl(var(--accent))]">{crew.stage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.04)] p-10 text-center rounded-sm">
          <h2 className="font-mono font-black text-2xl text-[hsl(var(--foreground))] mb-3">
            Ready to form your crew?
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mx-auto mb-6 leading-relaxed">
            Start a Reboot Project and invite your team. Your facilitator will connect you to a cohort and assign a Red Team reviewer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create">
              <Button className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                Start a Project <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="ghost" className="rounded-none border border-[hsl(var(--border))] font-mono text-xs tracking-widests uppercase hover:border-[hsl(var(--primary)/0.4)]">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
