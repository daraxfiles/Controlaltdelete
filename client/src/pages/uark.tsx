import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Search, Shield, Zap, MapPin, ChevronRight,
  Microscope, Radio, FileText, BarChart2, Lock, Users,
  BookOpen, CheckCircle2, Globe, MessageSquare,
} from "lucide-react";
import { UARK_MISSIONS, UARK_MISSION_CATEGORIES } from "@shared/uark-missions";
import { cn } from "@/lib/utils";

// ── UArk brand colour (cardinal red) without using official UA assets ──────
const CARDINAL = "#9e1b32";

const EXAMPLE_QUESTIONS = [
  "What does AI get wrong about Arkansas?",
  "Where do students actually get trustworthy campus information?",
  "Whose voices are missing from this story?",
  "Why did this campus rumor spread so fast?",
  "Can a typical student understand this public document?",
  "How do algorithms shape what Razorbacks see?",
  "Who gets quoted when our campus is in the news?",
  "What information do first-year students struggle to find?",
];

const REBOOT_STAGES = [
  { num: "01", id: "crash_report",   label: "Crash Report",    desc: "Identify the information problem and who it affects." },
  { num: "02", id: "system_trace",   label: "System Trace",    desc: "Map where the information originated and how it circulates." },
  { num: "03", id: "red_team",       label: "Red Team Room",   desc: "Challenge your assumptions and look for counter-evidence." },
  { num: "04", id: "build_patch",    label: "Build the Patch", desc: "Create evidence-backed media that fills the gap." },
  { num: "05", id: "ship_receipts",  label: "Ship With Receipts", desc: "Document every major claim with an Evidence Receipt." },
  { num: "06", id: "power_ping",     label: "Power Ping",      desc: "Contact someone positioned to respond and act." },
  { num: "07", id: "patch_notes",    label: "Patch Notes",     desc: "Publish your investigation as a UArk Media Patch." },
];

const IMPACT_EXAMPLES = [
  { icon: FileText, label: "Questions Investigated" },
  { icon: Shield,   label: "Evidence Receipts Published" },
  { icon: Radio,    label: "Media Patches Created" },
  { icon: Zap,      label: "Power Pings Sent" },
  { icon: CheckCircle2, label: "Responses Received" },
  { icon: Globe,    label: "Verified Contributions" },
];

export default function UArkHub() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [missionFilter, setMissionFilter] = useState("all");

  // Rotate example questions
  useEffect(() => {
    const t = setInterval(() => setQuestionIdx(i => (i + 1) % EXAMPLE_QUESTIONS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const { data: statsData } = useQuery<{
    patches: number; questions: number; pings: number; evidenceReceipts: number;
  }>({
    queryKey: ["/api/community/uark/stats"],
    staleTime: 60_000,
  });

  const { data: recentQuestions } = useQuery<any[]>({
    queryKey: ["/api/community-questions/uark"],
    staleTime: 30_000,
  });

  const { data: recentPatches } = useQuery<any[]>({
    queryKey: ["/api/community/uark/patches"],
    staleTime: 30_000,
  });

  const filteredMissions = missionFilter === "all"
    ? UARK_MISSIONS
    : UARK_MISSIONS.filter(m => m.category === missionFilter);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Subtle cardinal gradient wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${CARDINAL} 0%, transparent 100%)`,
          }}
        />

        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-px flex-1 max-w-[40px]"
              style={{ background: CARDINAL }}
            />
            <span
              className="font-mono text-[11px] tracking-widest uppercase font-semibold"
              style={{ color: CARDINAL }}
            >
              Communities / UArk
            </span>
          </div>

          <h1 className="font-mono font-black text-4xl md:text-6xl leading-none tracking-tight mb-4">
            <span className="text-[hsl(var(--foreground))]">CTRL+ALT+MEDIA</span>
            <br />
            <span style={{ color: CARDINAL }}>@ UArk</span>
          </h1>

          <p className="font-mono text-base md:text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mb-3 leading-relaxed">
            Investigate campus. Verify the evidence. Build better information.
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground)/0.7)] max-w-2xl mb-10 leading-relaxed">
            A student-powered civic media and AI literacy lab where Razorbacks investigate how
            information works across campus and community life, identify gaps and misinformation,
            build evidence-backed media, and bring their findings to people who can respond.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/create">
              <Button
                size="lg"
                className="rounded-none font-mono font-black text-xs tracking-widest uppercase px-6"
                style={{ background: CARDINAL, color: "#fff" }}
              >
                Start a UArk Investigation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/community/uark/questions">
              <Button variant="outline" size="lg" className="rounded-none font-mono text-xs tracking-widest uppercase px-6">
                Explore Razorback Questions
              </Button>
            </Link>
            <Link href="/community/uark/patches">
              <Button variant="ghost" size="lg" className="rounded-none font-mono text-xs tracking-widest uppercase px-6">
                View Media Patches
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Rotating example questions ────────────────────────────────────── */}
      <section className="border-y border-[hsl(var(--border))] py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] mb-4">
            What will you investigate?
          </p>
          <div className="relative h-12 overflow-hidden">
            {EXAMPLE_QUESTIONS.map((q, i) => (
              <p
                key={q}
                className={cn(
                  "absolute inset-0 flex items-center font-mono text-lg md:text-2xl font-bold transition-all duration-700",
                  i === questionIdx
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                )}
                style={{ color: i === questionIdx ? CARDINAL : undefined }}
              >
                {q}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Missions ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="UArk Missions"
            title="Eight Ways to Investigate"
            sub="Structured investigations designed for Razorbacks. Each mission produces real evidence-backed media."
          />

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {UARK_MISSION_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setMissionFilter(cat.id)}
                className={cn(
                  "px-3 py-1 font-mono text-xs rounded-none border transition-colors",
                  missionFilter === cat.id
                    ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                    : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground)/0.3)]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredMissions.map((m, i) => (
              <MissionCard key={m.id} mission={m} index={i} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/missions">
              <Button variant="outline" className="rounded-none font-mono text-xs tracking-widest uppercase">
                View All Platform Missions
                <ChevronRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Razorback Question ────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/0.4)]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="The Razorback Question"
            title="Every investigation starts with a question."
            sub="Community members submit questions about campus information. Students investigate the best ones."
          />

          {recentQuestions && recentQuestions.length > 0 ? (
            <div className="space-y-3 mb-8">
              {recentQuestions.slice(0, 4).map((q: any) => (
                <div
                  key={q.id}
                  className="flex items-center gap-4 p-4 border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)] transition-colors"
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))]" />
                  <p className="font-mono text-sm flex-1 leading-relaxed">{q.question}</p>
                  <StatusPill status={q.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[hsl(var(--border))] p-10 text-center mb-8">
              <p className="font-mono text-sm text-[hsl(var(--muted-foreground))] mb-1">
                No Razorback Questions yet.
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground)/0.6)]">
                Every investigation starts with a question. What information problem have you noticed
                around campus or community life?
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Link href="/community/uark/questions">
              <Button
                className="rounded-none font-mono text-xs tracking-widest uppercase"
                style={{ background: CARDINAL, color: "#fff" }}
              >
                Submit a Question
              </Button>
            </Link>
            <Link href="/community/uark/questions">
              <Button variant="outline" className="rounded-none font-mono text-xs tracking-widest uppercase">
                Browse All Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Reboot the Information ────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-[hsl(var(--border))]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Reboot the Information"
            title="A seven-stage investigation framework."
            sub="The Reboot Protocol guides every UArk investigation from problem identification to published evidence."
          />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {REBOOT_STAGES.map(stage => (
              <div
                key={stage.id}
                className="border border-[hsl(var(--border))] p-4 hover:border-[hsl(var(--primary)/0.4)] transition-colors group"
              >
                <span
                  className="font-mono text-2xl font-black mb-2 block"
                  style={{ color: CARDINAL, opacity: 0.7 }}
                >
                  {stage.num}
                </span>
                <p className="font-mono text-xs font-bold text-[hsl(var(--foreground))] mb-1">
                  {stage.label}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/reboot-protocol">
              <Button variant="outline" className="rounded-none font-mono text-xs tracking-widest uppercase">
                Explore the Full Reboot Protocol
                <ChevronRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest UArk Media Patches ─────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/0.4)]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Latest UArk Media Patches"
            title="Evidence-backed work from Razorback investigators."
            sub="Every patch is verified and connected to real evidence."
          />

          {recentPatches && recentPatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recentPatches.slice(0, 4).map((p: any) => (
                <PatchCard key={p.id} patch={p} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[hsl(var(--border))] p-10 text-center">
              <p className="font-mono text-sm text-[hsl(var(--muted-foreground))] mb-1">
                The public record is waiting for its first patch.
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground)/0.6)] mb-4">
                Start an investigation and publish UArk's first Media Patch.
              </p>
              <Link href="/create">
                <Button size="sm" className="rounded-none font-mono text-xs tracking-widest uppercase" style={{ background: CARDINAL, color: "#fff" }}>
                  Start an Investigation
                </Button>
              </Link>
            </div>
          )}

          {recentPatches && recentPatches.length > 0 && (
            <div className="mt-8">
              <Link href="/community/uark/patches">
                <Button variant="outline" className="rounded-none font-mono text-xs tracking-widest uppercase">
                  View All UArk Media Patches
                  <ChevronRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Evidence Matters ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-[hsl(var(--border))]">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="Evidence Matters"
                title="Every claim needs a receipt."
                sub=""
                left
              />
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
                UArk investigations require an Evidence Receipt — a structured record of every major
                claim, its source, how it was verified, and what uncertainty remains. This isn't busywork.
                It's the practice that separates journalism from rumor.
              </p>
              <ul className="space-y-2">
                {["Claims documented with sources", "Verification method recorded", "Uncertainty acknowledged", "Conflicts of interest disclosed"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: CARDINAL }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/evidence-receipt">
                  <Button variant="outline" size="sm" className="rounded-none font-mono text-xs tracking-widest uppercase">
                    File an Evidence Receipt
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <div className="border border-[hsl(var(--border))] p-6 font-mono">
                <p className="text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] mb-4">
                  Evidence Receipt — Sample
                </p>
                {[
                  { label: "Claim", val: "The university's housing waitlist has grown 40% in two years." },
                  { label: "Source", val: "UA Housing Office Annual Report 2022–2024" },
                  { label: "Verified via", val: "Document review + direct email confirmation" },
                  { label: "Confidence", val: "High" },
                ].map(row => (
                  <div key={row.label} className="mb-3 pb-3 border-b border-[hsl(var(--border))] last:border-0 last:mb-0 last:pb-0">
                    <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground)/0.5)] mb-0.5">{row.label}</p>
                    <p className="text-xs text-[hsl(var(--foreground)/0.8)]">{row.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── From Evidence to Action ───────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/0.4)]">
        <div className="container mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="From Evidence to Action"
            title="Power Pings close the loop."
            sub=""
          />
          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-8 max-w-2xl">
            After building evidence-backed media, UArk investigators send a Power Ping to someone
            positioned to respond — a university office, faculty member, journalist, or community
            organization. The goal is not confrontation, but connection: bringing good evidence to
            people who can act on it.
          </p>
          <div className="flex items-center gap-4 font-mono text-xs flex-wrap">
            {["Investigation", "Evidence Receipt", "Media Patch", "Power Ping", "Response / Impact"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-4">
                <span
                  className="px-3 py-1.5 border text-[hsl(var(--foreground)/0.8)]"
                  style={{ borderColor: i === 3 ? CARDINAL : undefined, color: i === 3 ? CARDINAL : undefined }}
                >
                  {step}
                </span>
                {i < arr.length - 1 && <ChevronRight className="h-3 w-3 text-[hsl(var(--muted-foreground)/0.4)]" />}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/power-ping">
              <Button variant="outline" size="sm" className="rounded-none font-mono text-xs tracking-widest uppercase">
                Send a Power Ping
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Campus Impact stats ───────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-[hsl(var(--border))]">
        <div className="container mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Campus Impact"
            title="Meaningful work, not vanity metrics."
            sub="Real contributions from UArk investigators."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: MessageSquare, label: "Questions Submitted",     val: statsData?.questions ?? 0 },
              { icon: Shield,        label: "Evidence Receipts",        val: statsData?.evidenceReceipts ?? 0 },
              { icon: FileText,      label: "Media Patches",            val: statsData?.patches ?? 0 },
              { icon: Zap,           label: "Power Pings",              val: statsData?.pings ?? 0 },
              { icon: Users,         label: "UArk Investigations",      val: "—" },
              { icon: CheckCircle2,  label: "Responses Received",       val: "—" },
            ].map(stat => (
              <div key={stat.label} className="border border-[hsl(var(--border))] p-5">
                <stat.icon className="h-4 w-4 mb-3 text-[hsl(var(--muted-foreground))]" />
                <p className="font-mono text-2xl font-black mb-1" style={{ color: CARDINAL }}>
                  {stat.val}
                </p>
                <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ethics notice ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/0.4)]">
        <div className="container mx-auto max-w-4xl">
          <div className="border border-[hsl(var(--border))] p-6 md:p-8">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] mb-3">
              Constructive Critical Inquiry
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
              CTRL+ALT+MEDIA encourages rigorous questioning. Investigations should seek understanding,
              evidence, accountability, and better information — not harassment or public shaming. Every
              UArk investigation asks students to acknowledge the following before they begin.
            </p>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1.5">
              {[
                "Investigate systems and claims, not individuals",
                "Do not publish private personal information",
                "Obtain appropriate consent for interviews",
                "Verify claims before publication",
                "Acknowledge uncertainty and missing evidence",
                "Allow people/organizations to respond",
                "Follow applicable university policies",
                "Distinguish evidence from opinion",
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                  <span style={{ color: CARDINAL }} className="font-bold">›</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Join CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-[hsl(var(--border))]">
        <div className="container mx-auto max-w-3xl text-center">
          <p
            className="font-mono text-[10px] tracking-widest uppercase mb-4"
            style={{ color: CARDINAL }}
          >
            Join the Investigation
          </p>
          <h2 className="font-mono font-black text-3xl md:text-4xl leading-tight mb-4">
            Students are not just consuming information.
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-10 max-w-xl mx-auto text-sm">
            They are investigating how information works, verifying evidence, creating better public
            knowledge, and learning that they have agency within the information ecosystem.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="rounded-none font-mono font-black text-xs tracking-widest uppercase px-8"
                style={{ background: CARDINAL, color: "#fff" }}
              >
                Start Your First Investigation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="rounded-none font-mono text-xs tracking-widest uppercase px-6">
                About CTRL+ALT+MEDIA
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow, title, sub, left = false,
}: { eyebrow: string; title: string; sub: string; left?: boolean }) {
  return (
    <div className={cn("mb-8", !left && "")}>
      <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] mb-2">
        {eyebrow}
      </p>
      <h2 className="font-mono font-black text-2xl md:text-3xl leading-tight mb-3">{title}</h2>
      {sub && <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-2xl">{sub}</p>}
    </div>
  );
}

function MissionCard({ mission, index }: { mission: (typeof UARK_MISSIONS)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)] transition-colors p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] block mb-1">
            {mission.topics.join(" · ")}
          </span>
          <h3 className="font-mono font-bold text-sm leading-snug">{mission.title}</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{mission.subtitle}</p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 font-mono text-[10px] rounded-none"
          style={{ borderColor: CARDINAL, color: CARDINAL }}
        >
          {mission.level}
        </Badge>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{mission.description}</p>
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.4)] mb-1">Steps</p>
            <ol className="space-y-1">
              {mission.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="font-mono font-bold shrink-0" style={{ color: CARDINAL }}>{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.4)] mb-1">Final Question</p>
            <p className="text-xs italic text-[hsl(var(--foreground)/0.7)]">"{mission.finalQuestion}"</p>
          </div>
          <div className="pt-2">
            <Link href="/create">
              <Button size="sm" className="rounded-none font-mono text-xs tracking-widest uppercase" style={{ background: CARDINAL, color: "#fff" }}>
                Investigate This
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="mt-3 font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] hover:text-[hsl(var(--primary))] flex items-center gap-1 transition-colors"
      >
        {open ? "Close" : "Details"}
        <ChevronRight className={cn("h-3 w-3 transition-transform", open && "rotate-90")} />
      </button>
    </div>
  );
}

function PatchCard({ patch }: { patch: any }) {
  return (
    <div className="border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)] transition-colors p-5">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="font-mono text-[10px] rounded-none">{patch.mediaType}</Badge>
        {patch.verificationStatus === "verified" && (
          <Badge className="font-mono text-[10px] rounded-none bg-[hsl(145_85%_48%/0.15)] text-[hsl(145_85%_48%)] border-[hsl(145_85%_48%/0.3)]">
            Verified
          </Badge>
        )}
      </div>
      <h3 className="font-mono font-bold text-sm leading-snug mb-1">{patch.title}</h3>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3 line-clamp-2">{patch.description}</p>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)]">{patch.crewName}</span>
        <Link href="/media-patches">
          <button className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--primary))] hover:underline flex items-center gap-1">
            Read <ChevronRight className="h-3 w-3" />
          </button>
        </Link>
      </div>
    </div>
  );
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  submitted:               { label: "Submitted",              color: "#6b7280" },
  under_review:            { label: "Under Review",           color: "#f59e0b" },
  open_for_investigation:  { label: "Open for Investigation", color: "#3b82f6" },
  investigation_started:   { label: "Under Investigation",    color: "#8b5cf6" },
  patch_published:         { label: "Patch Published",        color: "hsl(145 85% 48%)" },
  closed:                  { label: "Closed",                 color: "#6b7280" },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? { label: status, color: "#6b7280" };
  return (
    <span
      className="font-mono text-[10px] px-2 py-0.5 rounded-sm shrink-0"
      style={{ background: `${s.color}20`, color: s.color }}
    >
      {s.label}
    </span>
  );
}
