import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Shield, ArrowRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const CARDINAL = "#9e1b32";

const TOPIC_FILTERS = [
  { id: "all",               label: "All Topics" },
  { id: "AI Literacy",       label: "AI Literacy" },
  { id: "Misinformation",    label: "Misinformation" },
  { id: "Campus Information",label: "Campus Information" },
  { id: "Representation",    label: "Representation" },
  { id: "Accessibility",     label: "Accessibility" },
  { id: "Algorithms",        label: "Algorithms" },
  { id: "Community",         label: "Community" },
  { id: "Journalism",        label: "Journalism" },
  { id: "Data",              label: "Data" },
  { id: "Information Access",label: "Information Access" },
];

const MEDIA_TYPE_LABELS: Record<string, string> = {
  article: "Article", podcast: "Podcast", video: "Video", infographic: "Infographic",
  "data story": "Data Story", zine: "Zine", interactive: "Interactive",
  documentary: "Documentary", guide: "Guide", "ai audit": "AI Audit",
};

export default function UArkPatches() {
  const [topicFilter, setTopicFilter] = useState("all");
  const [mediaFilter, setMediaFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: patches = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/community/uark/patches"],
    staleTime: 30_000,
  });

  const displayed = patches
    .filter(p => topicFilter === "all" || p.topic === topicFilter)
    .filter(p => mediaFilter === "all" || p.mediaType === mediaFilter)
    .filter(p =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.crewName.toLowerCase().includes(search.toLowerCase())
    );

  const mediaTypes = Array.from(new Set(patches.map((p: any) => p.mediaType))).filter(Boolean);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <Link href="/community/uark">
            <button className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] hover:text-[hsl(var(--primary))] flex items-center gap-1 mb-4 transition-colors">
              ← UArk Hub
            </button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8" style={{ background: CARDINAL }} />
            <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: CARDINAL }}>
              UArk Media Patches
            </span>
          </div>
          <h1 className="font-mono font-black text-3xl md:text-4xl leading-tight mb-3">
            Evidence-backed work from Razorback investigators.
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-2xl leading-relaxed">
            Every Media Patch is connected to real evidence, an Evidence Receipt, and a question that
            mattered enough to investigate.
          </p>
        </div>

        {/* Search + filters */}
        <div className="space-y-3 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--muted-foreground)/0.4)]" />
            <input
              type="text"
              placeholder="Search patches by title, crew, or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm font-mono focus:outline-none focus:border-[hsl(var(--primary))] rounded-none"
            />
          </div>

          {/* Topic pills */}
          <div className="flex flex-wrap gap-1.5">
            {TOPIC_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setTopicFilter(f.id)}
                className={cn(
                  "px-2.5 py-1 font-mono text-xs rounded-none border transition-colors",
                  topicFilter === f.id
                    ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                    : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground)/0.3)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Media type pills */}
          {mediaTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setMediaFilter("all")}
                className={cn(
                  "px-2.5 py-1 font-mono text-xs rounded-none border transition-colors",
                  mediaFilter === "all"
                    ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                    : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                )}
              >
                All Formats
              </button>
              {mediaTypes.map(mt => (
                <button
                  key={mt}
                  onClick={() => setMediaFilter(mt)}
                  className={cn(
                    "px-2.5 py-1 font-mono text-xs rounded-none border transition-colors",
                    mediaFilter === mt
                      ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {MEDIA_TYPE_LABELS[mt] ?? mt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)] mb-4">
            {displayed.length} patch{displayed.length !== 1 ? "es" : ""} found
          </p>
        )}

        {/* Patch grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="border border-[hsl(var(--border))] p-5 animate-pulse">
                <div className="h-3 bg-[hsl(var(--border))] rounded w-1/4 mb-3" />
                <div className="h-5 bg-[hsl(var(--border))] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[hsl(var(--border))] rounded w-full mb-1" />
                <div className="h-3 bg-[hsl(var(--border))] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="border border-dashed border-[hsl(var(--border))] p-16 text-center">
            <FileText className="h-10 w-10 mx-auto mb-4 text-[hsl(var(--muted-foreground)/0.2)]" />
            <p className="font-mono text-sm text-[hsl(var(--muted-foreground))] mb-1">
              {patches.length === 0
                ? "The public record is waiting for its first patch."
                : "No patches match your current filters."}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground)/0.5)] mb-6">
              {patches.length === 0
                ? "Start a UArk investigation and publish the first Media Patch."
                : "Try adjusting your topic, format, or search filters."}
            </p>
            {patches.length === 0 && (
              <Link href="/create">
                <Button size="sm" className="rounded-none font-mono text-xs tracking-widest uppercase" style={{ background: CARDINAL, color: "#fff" }}>
                  Start an Investigation
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {displayed.map((patch: any) => (
              <PatchCard key={patch.id} patch={patch} />
            ))}
          </div>
        )}

        {/* Platform link */}
        <div className="mt-12 text-center border-t border-[hsl(var(--border))] pt-8">
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)] mb-3">
            Looking for all platform patches?
          </p>
          <Link href="/media-patches">
            <Button variant="outline" className="rounded-none font-mono text-xs tracking-widest uppercase">
              View All Media Patches
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function PatchCard({ patch }: { patch: any }) {
  return (
    <div className="border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)] transition-colors p-5 flex flex-col">
      {/* Badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge variant="outline" className="font-mono text-[10px] rounded-none capitalize">
          {patch.mediaType}
        </Badge>
        {patch.topic && (
          <Badge variant="outline" className="font-mono text-[10px] rounded-none" style={{ borderColor: CARDINAL, color: CARDINAL }}>
            {patch.topic}
          </Badge>
        )}
        {patch.verificationStatus === "verified" && (
          <Badge className="font-mono text-[10px] rounded-none bg-[hsl(145_85%_48%/0.12)] text-[hsl(145_85%_48%)] border border-[hsl(145_85%_48%/0.3)]">
            <Shield className="h-2.5 w-2.5 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      <h3 className="font-mono font-bold text-sm leading-snug mb-2">{patch.title}</h3>
      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed flex-1 line-clamp-3 mb-4">
        {patch.description}
      </p>

      <div className="flex items-end justify-between gap-2 mt-auto">
        <div>
          <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)]">
            {patch.crewName}
          </p>
          <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)]">
            {patch.community}
          </p>
          <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.3)] mt-0.5">
            {new Date(patch.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <Link href="/media-patches">
          <button
            className="font-mono text-[10px] tracking-widest uppercase flex items-center gap-1 hover:underline transition-colors"
            style={{ color: CARDINAL }}
          >
            Read
            <ArrowRight className="h-3 w-3" />
          </button>
        </Link>
      </div>
    </div>
  );
}
