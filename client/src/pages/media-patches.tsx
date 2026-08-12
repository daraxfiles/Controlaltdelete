import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaPatch } from "@shared/schema";

const MEDIA_TYPE_LABELS: Record<string, string> = {
  article: "Article",
  photo_essay: "Photo Essay",
  podcast: "Podcast",
  short_documentary: "Documentary",
  social_video_series: "Social Video",
  interactive_timeline: "Interactive Timeline",
  data_story: "Data Story",
  community_resource_guide: "Resource Guide",
  myth_vs_evidence: "Myth vs. Evidence",
  digital_zine: "Digital Zine",
  public_information_page: "Public Info Page",
  campaign_page: "Campaign",
};

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
  const map: Record<string, { label: string; cls: string; Icon: typeof CheckCircle }> = {
    responded: { label: "Response Received", cls: "badge-responded", Icon: CheckCircle },
    action_promised: { label: "Action Promised", cls: "badge-verified", Icon: CheckCircle },
    pending: { label: "Awaiting Response", cls: "badge-pending", Icon: Clock },
    no_response: { label: "No Response", cls: "badge-error", Icon: AlertTriangle },
  };
  const s = map[status] ?? map["pending"];
  const Icon = s.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-wide", s.cls)}>
      <Icon className="h-2.5 w-2.5" /> {s.label}
    </span>
  );
}

function PatchCard({ patch }: { patch: MediaPatch }) {
  return (
    <article className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden hover:border-[hsl(var(--primary)/0.45)] transition-colors group card-accent-primary flex flex-col">
      {/* Type bar */}
      <div className="bg-[hsl(0_0%_6%)] px-4 py-2.5 border-b border-[hsl(var(--border))] flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
          {MEDIA_TYPE_LABELS[patch.mediaType] ?? patch.mediaType}
        </span>
        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)]">
          #{patch.id.slice(-6).toUpperCase()}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h2 className="font-black text-base text-[hsl(var(--foreground))] mb-1 leading-tight group-hover:text-[hsl(var(--primary))] transition-colors">
          {patch.title}
        </h2>
        <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mb-1">
          {patch.crewName}
        </p>
        <p className="font-mono text-[10px] text-[hsl(var(--accent)/0.8)] mb-1 uppercase tracking-wide">
          {patch.community}
        </p>
        <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.6)] mb-3 uppercase tracking-wide">
          Topic: {patch.topic}
        </p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4 flex-1">
          {patch.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <VerificationBadge status={patch.verificationStatus} />
          <ResponseBadge status={patch.institutionalResponseStatus} />
        </div>
      </div>

      <div className="px-5 py-3 border-t border-[hsl(var(--border))] flex items-center justify-between">
        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] uppercase tracking-widest">
          {patch.stage.replace(/_/g, " ")}
        </span>
        <span className="flex items-center gap-1 font-mono text-xs text-[hsl(var(--primary))] group-hover:gap-2 transition-all">
          View Patch <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </article>
  );
}

export default function MediaPatches() {
  const { data: patches = [], isLoading } = useQuery<MediaPatch[]>({
    queryKey: ["/api/media-patches"],
  });

  const [filter, setFilter] = useState<"all" | "verified" | "responded">("all");

  const filtered = patches.filter(p => {
    if (filter === "verified") return p.verificationStatus === "verified";
    if (filter === "responded") return p.institutionalResponseStatus === "responded" || p.institutionalResponseStatus === "action_promised";
    return true;
  });

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <p className="system-label mb-4">Public Archive</p>
        <h1 className="font-black font-mono text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4 leading-tight">
          Media Patches
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-xl mb-3 leading-relaxed">
          Verified investigations, alternative media, and civic documentation built by youth crews. Every patch includes a public Evidence Receipt.
        </p>
        <p className="font-mono text-xs text-[hsl(var(--primary)/0.7)] mb-10 tracking-widest">
          NO RECEIPT. NO REBOOT.
        </p>

        {/* Stats bar — honest zero state */}
        <div className="grid grid-cols-3 gap-0 border border-[hsl(var(--border))] mb-8">
          {[
            { label: "Total Patches", value: patches.length },
            { label: "Verified",      value: patches.filter(p => p.verificationStatus === "verified").length },
            { label: "Response Received", value: patches.filter(p => ["responded", "action_promised"].includes(p.institutionalResponseStatus)).length },
          ].map(({ label, value }, i) => (
            <div key={label} className={cn("py-5 px-6 text-center", i < 2 ? "border-r border-[hsl(var(--border))]" : "")}>
              <div className="font-mono font-black text-3xl text-[hsl(var(--primary))]">{value}</div>
              <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters — only show when there are patches */}
        {patches.length > 0 && (
          <div className="flex gap-2 mb-8">
            {[
              { id: "all" as const, label: "All Patches" },
              { id: "verified" as const, label: "Verified" },
              { id: "responded" as const, label: "Response Received" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-4 py-1.5 font-mono text-xs tracking-widest uppercase border transition-colors rounded-sm",
                  filter === f.id
                    ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]"
                    : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.4)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Patches grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] h-64 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : patches.length === 0 ? (
          /* ── Zero state: archive is empty ── */
          <div className="py-16">
            <div className="terminal-box max-w-2xl mx-auto overflow-hidden mb-10">
              <div className="terminal-header">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest ml-2">
                  ARCHIVE :: QUERY RESULT
                </span>
              </div>
              <div className="p-6 font-mono text-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[hsl(var(--primary)/0.5)]">›</span>
                  <span className="text-[hsl(var(--muted-foreground))]">SELECT * FROM media_patches ORDER BY published_at;</span>
                </div>
                <div className="flex items-center gap-3 pl-4 text-[hsl(var(--muted-foreground)/0.5)] text-xs italic">
                  — 0 rows returned
                </div>
                <div className="border-t border-[hsl(var(--border))] pt-4 flex items-start gap-3">
                  <span className="text-[hsl(var(--primary)/0.5)] shrink-0">›</span>
                  <span className="text-[hsl(var(--primary))]">
                    PATCH #001 STATUS: <span className="font-black">UNASSIGNED</span><span className="cursor-blink">█</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center max-w-xl mx-auto">
              <h2 className="font-mono font-black text-2xl text-[hsl(var(--foreground))] mb-3">
                No patches have been filed.
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] mb-2 leading-relaxed">
                This archive is empty. That means the first verified investigation published here becomes part of the platform's permanent record.
              </p>
              <p className="text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
                Crews that publish during the founding period earn a{" "}
                <span className="font-mono text-[hsl(var(--accent))] font-bold">FOUNDING CREW</span>{" "}
                badge that stays on their patch forever.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
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
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map(p => <PatchCard key={p.id} patch={p} />)}
          </div>
        ) : (
          <div className="border border-dashed border-[hsl(var(--border))] p-16 text-center rounded-sm">
            <p className="font-mono text-sm text-[hsl(var(--muted-foreground))] mb-4">
              No patches match this filter.
            </p>
            <Button variant="ghost" onClick={() => setFilter("all")} className="font-mono text-xs rounded-none border border-[hsl(var(--border))]">
              View All Patches
            </Button>
          </div>
        )}

        {/* Submit CTA */}
        <div className="mt-16 border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.04)] p-8 text-center rounded-sm">
          <p className="font-mono font-black text-xl text-[hsl(var(--foreground))] mb-2">
            We do not go viral. We go verified.
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 max-w-md mx-auto">
            Ready to publish your crew's investigation? Start the Reboot Protocol and submit your patch for review.
          </p>
          <Link href="/create">
            <Button className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)]">
              Start Your Reboot <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
