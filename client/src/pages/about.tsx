import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, Zap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    title: "Undergraduate Student",
    icon: Users,
    color: "hsl(var(--primary))",
    capabilities: [
      "Join a Reboot Crew",
      "Complete missions",
      "Add and verify evidence",
      "Upload media and build a Media Patch",
      "Record AI use in the AI Use Log",
      "Submit work for review and publish approved patches",
      "Track institutional responses",
    ],
  },
  {
    title: "Reboot Crew Lead",
    icon: Zap,
    color: "hsl(var(--accent))",
    capabilities: [
      "Create a team project",
      "Invite crew members",
      "Assign responsibilities and manage tasks",
      "Submit work for facilitator review",
    ],
  },
  {
    title: "Facilitator",
    icon: Shield,
    color: "hsl(var(--warning))",
    capabilities: [
      "Create cohorts and assign missions",
      "Review and approve projects for publication",
      "Give structured feedback",
      "Manage safety and privacy settings",
      "Create program announcements",
    ],
  },
  {
    title: "Root Access Mentor",
    icon: BookOpen,
    color: "hsl(var(--chart-5))",
    capabilities: [
      "Review selected youth projects",
      "Give structured feedback",
      "Support youth teams in mentor sessions",
      "Cannot publish or edit without crew permission",
    ],
  },
];

const VALUES = [
  {
    label: "We do not go viral. We go verified.",
    desc: "Every claim in a Media Patch is sourced, documented, and reviewable. The Evidence Receipt is not optional.",
  },
  {
    label: "No Receipt. No Reboot.",
    desc: "Transparency is not a feature — it is the foundation. Students publish their work with full sourcing or they do not publish at all.",
  },
  {
    label: "Erasure is part of the problem.",
    desc: "We replaced DELETE with MEDIA in our name deliberately. Students build what the system failed to create, not what it erased.",
  },
  {
    label: "Students don't just consume. They reshape.",
    desc: "CTRL+ALT+MEDIA gives undergraduate students the skills, tools, platform, and confidence to act on the information systems that affect their lives.",
  },
];

export default function About() {
  return (
    <main className="pt-24 min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 px-6 border-b border-[hsl(var(--border))] bg-[hsl(0_0%_4%)]">
        <div className="container mx-auto max-w-4xl">
          <p className="system-label mb-4">What We Are</p>
          <h1 className="font-black font-mono text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-6 leading-tight">
            A student-powered lab for{" "}
            <span className="gradient-text">civic media</span> and{" "}
            <span className="gradient-text">information accountability</span>
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-lg leading-relaxed max-w-2xl mb-8">
            CTRL+ALT+MEDIA is not a traditional online course, student newspaper, or fact-checking website. It is a bold, student-led digital newsroom, creative technology lab, and civic action platform.
          </p>
          <div className="terminal-box inline-block px-5 py-3">
            <p className="font-mono text-xs text-[hsl(var(--primary))]">
              The public record has crashed. Students reboot it.
            </p>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <p className="system-label mb-4">Who We Serve</p>
          <h2 className="font-black font-mono text-3xl text-[hsl(var(--foreground))] mb-6">
            Built for undergraduate students — freshmen, sophomores, and juniors
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] mb-12 max-w-2xl leading-relaxed">
            Enrolled in a college or university program. The platform also supports faculty facilitators, mentors, professional journalists, and community partners working alongside student crews.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.title} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 rounded-sm card-accent-primary">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-sm flex items-center justify-center bg-[hsl(var(--primary)/0.1)]">
                      <Icon className="h-4 w-4" style={{ color: role.color }} />
                    </div>
                    <h3 className="font-mono font-bold text-sm text-[hsl(var(--foreground))]">{role.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {role.capabilities.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                        <span className="text-[hsl(var(--primary)/0.5)] font-mono mt-0.5">›</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-[hsl(0_0%_5%)] border-y border-[hsl(var(--border))]">
        <div className="container mx-auto max-w-5xl">
          <p className="system-label mb-4">Our Values</p>
          <h2 className="font-black font-mono text-3xl text-[hsl(var(--foreground))] mb-12">
            Principles we don't compromise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[hsl(var(--border))]">
            {VALUES.map((v, i) => (
              <div
                key={i}
                className={cn(
                  "p-8 border-[hsl(var(--border))]",
                  i % 2 === 0 ? "border-r" : "",
                  i < 2 ? "border-b" : ""
                )}
              >
                <p className="font-mono font-bold text-sm text-[hsl(var(--primary))] mb-3 leading-tight">{v.label}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="system-label mb-4">Safety & Privacy</p>
              <h2 className="font-mono font-black text-3xl text-[hsl(var(--foreground))] mb-6">
                Built for student safety
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
                Because this platform serves students and their communities, every feature is built with strong privacy and moderation defaults.
              </p>
              <div className="space-y-3">
                {[
                  "Private-by-default profiles with display name options",
                  "Facilitator approval required before public publication",
                  "Interview consent tracking built into the workflow",
                  "Anonymity options for sensitive investigations",
                  "Clear escalation pathways to a trusted adult",
                  "No location tracking or unsolicited contact",
                  "Safety review before publishing sensitive investigations",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Shield className="h-3.5 w-3.5 text-[hsl(var(--primary))] shrink-0 mt-1" />
                    <p className="text-sm text-[hsl(var(--foreground)/0.8)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="system-label mb-4">Get Involved</p>
              <h2 className="font-mono font-black text-3xl text-[hsl(var(--foreground))] mb-6">
                Bring CTRL+ALT+MEDIA to your community
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-8">
                Whether you're a faculty member, program coordinator, community organization, or journalist — we want to work with you.
              </p>
              <div className="space-y-3">
                <Link href="/create">
                  <Button className="w-full rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                    Start a Reboot Project <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </Link>
                <Link href="/reboot-protocol">
                  <Button variant="ghost" className="w-full rounded-none border border-[hsl(var(--border))] font-mono text-xs tracking-widest uppercase hover:border-[hsl(var(--primary)/0.5)]">
                    Learn the Reboot Protocol
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
