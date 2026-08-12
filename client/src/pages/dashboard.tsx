import { useUser, useClerk } from "@clerk/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { useState } from "react";
import { missions } from "@shared/schema";
import {
  Terminal, CheckCircle, Clock, Shield, Send, FileCheck,
  Target, LogOut, Plus, ChevronRight, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [profileSaved, setProfileSaved] = useState(false);

  // Profile data
  const { data: profile } = useQuery<any>({
    queryKey: ["/api/profile"],
  });

  // Mission progress
  const { data: progress = [] } = useQuery<any[]>({
    queryKey: ["/api/mission-progress"],
  });

  // Power pings
  const { data: pings = [] } = useQuery<any[]>({
    queryKey: ["/api/power-pings"],
  });

  // Evidence receipts
  const { data: receipts = [] } = useQuery<any[]>({
    queryKey: ["/api/evidence-receipts"],
  });

  const profileMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    },
  });

  const completedMissions = progress.filter(p => p.status === "completed").length;
  const respondedPings = pings.filter(p => ["responded", "action_promised"].includes(p.status)).length;

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="system-label mb-2">Crew Dashboard</p>
            <h1 className="font-mono font-black text-4xl text-[hsl(var(--foreground))]">
              {user?.firstName ? `${user.firstName}'s Workspace` : "My Workspace"}
            </h1>
            <p className="font-mono text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            {profile?.foundingCrew && (
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 border border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.08)] rounded-sm">
                <Star className="h-3 w-3 text-[hsl(var(--primary))]" />
                <span className="font-mono text-[10px] tracking-widest text-[hsl(var(--primary))] uppercase font-bold">
                  Founding Crew Member
                </span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ redirectUrl: "/" })}
            className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)] hover:text-[hsl(var(--foreground))] rounded-none"
          >
            <LogOut className="h-3 w-3 mr-1.5" /> Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[hsl(var(--border))] mb-10">
          {[
            { label: "Missions", value: completedMissions, Icon: Target, sub: `of ${missions.length}` },
            { label: "Power Pings", value: pings.length, Icon: Send, sub: `${respondedPings} responded` },
            { label: "Receipts", value: receipts.length, Icon: FileCheck, sub: "filed" },
            { label: "Patches", value: 0, Icon: Shield, sub: "published" },
          ].map(({ label, value, Icon, sub }, i) => (
            <div key={label} className={cn("py-5 px-4 flex items-center gap-3", i < 3 && "border-r border-[hsl(var(--border))]")}>
              <Icon className="h-4 w-4 text-[hsl(var(--primary)/0.5)] shrink-0" />
              <div>
                <div className="font-mono font-black text-2xl text-[hsl(var(--primary))]">{value}</div>
                <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest uppercase">{label}</div>
                <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)]">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">

            {/* Profile */}
            <section className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6">
              <h2 className="font-mono font-black text-sm text-[hsl(var(--foreground))] mb-4">Your Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground)/0.6)] block mb-1.5">Display Name</label>
                  <input
                    defaultValue={profile?.displayName ?? user?.fullName ?? ""}
                    id="displayName"
                    className="input-terminal w-full"
                    placeholder="Your name or alias"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground)/0.6)] block mb-1.5">Crew Name</label>
                  <input
                    defaultValue={profile?.crewName ?? ""}
                    id="crewName"
                    className="input-terminal w-full"
                    placeholder="e.g. Southside Truth Squad"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground)/0.6)] block mb-1.5">Bio</label>
                  <textarea
                    defaultValue={profile?.bio ?? ""}
                    id="bio"
                    rows={2}
                    className="input-terminal w-full resize-none"
                    placeholder="Tell us about your crew's work..."
                  />
                </div>
                <Button
                  className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] w-full"
                  onClick={() => {
                    const displayName = (document.getElementById("displayName") as HTMLInputElement)?.value;
                    const crewName = (document.getElementById("crewName") as HTMLInputElement)?.value;
                    const bio = (document.getElementById("bio") as HTMLTextAreaElement)?.value;
                    profileMutation.mutate({ displayName: displayName || user?.fullName || "Crew Member", crewName, bio });
                  }}
                  disabled={profileMutation.isPending}
                >
                  {profileSaved ? "Saved ✓" : profileMutation.isPending ? "Saving…" : "Save Profile"}
                </Button>
              </div>
            </section>

            {/* Quick actions */}
            <section className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6">
              <h2 className="font-mono font-black text-sm text-[hsl(var(--foreground))] mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { href: "/create", label: "Start a New Reboot", Icon: Plus },
                  { href: "/evidence-receipt", label: "Build an Evidence Receipt", Icon: FileCheck },
                  { href: "/power-ping", label: "Log a Power Ping", Icon: Send },
                  { href: "/missions", label: "View All Missions", Icon: Target },
                  { href: "/admin", label: "Facilitator Panel", Icon: Shield },
                ].map(({ href, label, Icon }) => (
                  <Link key={href} href={href}>
                    <div className="flex items-center justify-between px-4 py-3 border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.04)] transition-colors cursor-pointer rounded-sm group">
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-3.5 w-3.5 text-[hsl(var(--primary)/0.6)] group-hover:text-[hsl(var(--primary))] transition-colors" />
                        <span className="font-mono text-sm text-[hsl(var(--foreground)/0.8)] group-hover:text-[hsl(var(--foreground))] transition-colors">{label}</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-[hsl(var(--muted-foreground)/0.3)] group-hover:text-[hsl(var(--primary))] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Mission progress */}
            <section className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-mono font-black text-sm text-[hsl(var(--foreground))]">Mission Progress</h2>
                <Link href="/missions">
                  <span className="font-mono text-[10px] text-[hsl(var(--primary))] hover:underline cursor-pointer">View all →</span>
                </Link>
              </div>

              {missions.length === 0 ? (
                <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)]">No missions started yet.</p>
              ) : (
                <div className="space-y-2">
                  {(missions as typeof missions[number][]).slice(0, 5).map(mission => {
                    const prog = progress.find((p: any) => p.missionId === mission.id);
                    return (
                      <Link key={mission.id} href="/missions">
                        <div className="flex items-center justify-between px-3 py-2.5 border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)] transition-colors rounded-sm cursor-pointer group">
                          <span className="font-mono text-xs text-[hsl(var(--foreground)/0.8)] group-hover:text-[hsl(var(--foreground))] truncate">{mission.title}</span>
                          {prog ? (
                            <span className={cn(
                              "shrink-0 ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-wide",
                              prog.status === "completed" ? "badge-verified" : "badge-pending"
                            )}>
                              {prog.status === "completed" ? <CheckCircle className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                              {prog.status}
                            </span>
                          ) : (
                            <span className="shrink-0 font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.3)]">not started</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent power pings */}
            <section className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-mono font-black text-sm text-[hsl(var(--foreground))]">Recent Power Pings</h2>
                <Link href="/power-ping">
                  <span className="font-mono text-[10px] text-[hsl(var(--primary))] hover:underline cursor-pointer">View all →</span>
                </Link>
              </div>
              {pings.length === 0 ? (
                <div className="text-center py-4">
                  <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)] mb-3">No pings sent yet.</p>
                  <Link href="/power-ping">
                    <Button size="sm" className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-[10px] tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                      <Send className="h-3 w-3 mr-1.5" /> Log First Ping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {pings.slice(0, 3).map((ping: any) => (
                    <div key={ping.id} className="px-3 py-2.5 border border-[hsl(var(--border))] rounded-sm">
                      <p className="font-mono text-xs font-bold text-[hsl(var(--foreground)/0.9)] truncate">{ping.projectTitle}</p>
                      <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)] truncate">→ {ping.recipientName}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
