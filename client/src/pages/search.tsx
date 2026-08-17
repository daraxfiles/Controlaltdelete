import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search as SearchIcon, ArrowRight, Shield, FileText, Target } from "lucide-react";
import { missions } from "@shared/schema";
import { cn } from "@/lib/utils";
import type { MediaPatch } from "@shared/schema";

type ResultType = "patch" | "mission";

interface Result {
  type: ResultType;
  id: string;
  title: string;
  description: string;
  tag: string;
  href: string;
  tagColor?: string;
}

export default function Search() {
  const [query, setQuery] = useState("");

  const { data: patches = [] } = useQuery<MediaPatch[]>({
    queryKey: ["/api/media-patches"],
  });

  const results = useMemo<Result[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const patchResults: Result[] = patches
      .filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        p.community.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.crewName.toLowerCase().includes(q)
      )
      .map(p => ({
        type: "patch" as const,
        id: p.id,
        title: p.title,
        description: p.description,
        tag: p.topic,
        href: "/media-patches",
        tagColor: "hsl(var(--accent))",
      }));

    const missionResults: Result[] = ([...missions] as typeof missions[number][])
      .filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.objective.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q))
      )
      .map(m => ({
        type: "mission" as const,
        id: m.id,
        title: m.title,
        description: m.objective,
        tag: m.category,
        href: "/missions",
        tagColor: "hsl(var(--primary))",
      }));

    return [...patchResults, ...missionResults];
  }, [query, patches]);

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-6 py-12">
        <p className="system-label mb-4">Search</p>
        <h1 className="font-black font-mono text-4xl text-[hsl(var(--foreground))] mb-8">
          Find missions &amp; patches
        </h1>

        {/* Search input */}
        <div className="relative mb-10">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground)/0.5)]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, topic, community, skills..."
            autoFocus
            className="w-full pl-11 pr-4 py-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono text-sm placeholder:text-[hsl(var(--muted-foreground)/0.4)] focus:outline-none focus:border-[hsl(var(--primary)/0.6)] transition-colors rounded-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground)/0.5)] hover:text-[hsl(var(--foreground))] font-mono text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim() === "" ? (
          <div className="space-y-6">
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)] uppercase tracking-widest">Suggestions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["headline", "algorithm", "translation", "AI", "investigation", "community"].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-left px-4 py-3 border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.04)] transition-colors rounded-sm font-mono text-sm text-[hsl(var(--foreground)/0.7)]"
                >
                  <SearchIcon className="inline h-3 w-3 mr-2 text-[hsl(var(--muted-foreground)/0.4)]" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="border border-dashed border-[hsl(var(--border))] p-12 text-center rounded-sm">
            <p className="font-mono text-sm text-[hsl(var(--muted-foreground))] mb-2">
              No results for "<span className="text-[hsl(var(--foreground))]">{query}</span>"
            </p>
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)]">
              Try a different topic, community name, or skill.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)] uppercase tracking-widest mb-4">
              {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
            </p>
            {results.map(r => (
              <Link key={`${r.type}-${r.id}`} href={r.href}>
                <div className="group border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/0.4)] transition-colors rounded-sm p-5 cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {r.type === "patch"
                          ? <Shield className="h-3 w-3 shrink-0" style={{ color: r.tagColor }} />
                          : <Target className="h-3 w-3 shrink-0" style={{ color: r.tagColor }} />
                        }
                        <span className="font-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: r.tagColor }}>
                          {r.type === "patch" ? "Media Patch" : "Mission"} · {r.tag}
                        </span>
                      </div>
                      <h3 className="font-mono font-black text-base text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors mb-1">
                        {r.title}
                      </h3>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2">
                        {r.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[hsl(var(--muted-foreground)/0.3)] group-hover:text-[hsl(var(--primary))] transition-colors shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
