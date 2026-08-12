import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Media Literacy",
  "Investigative Journalism",
  "Fact-Checking",
  "AI Literacy",
  "Interviewing",
  "Data & Visualization",
  "Audio Production",
  "Video Production",
  "Digital Safety",
  "Public Records",
  "Youth Rights",
  "Copyright & Fair Use",
  "Accessibility",
];

const RESOURCES = [
  { title: "News Literacy Project", category: "Media Literacy", type: "Platform", desc: "Interactive tools and lessons for evaluating news and information sources.", url: "https://newslit.org", free: true },
  { title: "First Draft News", category: "Fact-Checking", type: "Guide", desc: "Essential guides for verifying photos, videos, and eyewitness accounts online.", url: "https://firstdraftnews.org", free: true },
  { title: "InVID / WeVerify", category: "Fact-Checking", type: "Tool", desc: "Browser plugin for verifying videos and images circulating online.", url: "https://weverify.eu", free: true },
  { title: "SIFT Method", category: "Media Literacy", type: "Framework", desc: "Stop, Investigate the source, Find better coverage, Trace claims — a four-move framework.", url: "https://cor.stanford.edu", free: true },
  { title: "ProPublica Fact-Checking Guide", category: "Investigative Journalism", type: "Guide", desc: "How investigative journalists verify claims and build bulletproof stories.", url: "https://propublica.org", free: true },
  { title: "MuckRock", category: "Public Records", type: "Platform", desc: "File public records requests and access a library of already-released documents.", url: "https://muckrock.com", free: true },
  { title: "RCFP Reporters Committee", category: "Public Records", type: "Legal Resource", desc: "Know your rights when accessing government records, including as a student journalist.", url: "https://rcfp.org", free: true },
  { title: "AI Literacy Project", category: "AI Literacy", type: "Curriculum", desc: "Free lessons on how AI systems work, what they get wrong, and how to use them responsibly.", url: "https://ailiteracy.org", free: true },
  { title: "Algorithm Watch", category: "AI Literacy", type: "Research", desc: "Investigative reports on algorithmic decision-making and its societal impact.", url: "https://algorithmwatch.org", free: true },
  { title: "Interviewing Techniques — SPJ", category: "Interviewing", type: "Guide", desc: "Society of Professional Journalists guide to interviewing sources ethically and effectively.", url: "https://spj.org", free: true },
  { title: "Datawrapper", category: "Data & Visualization", type: "Tool", desc: "Create charts, maps, and tables for your Media Patch — no coding required.", url: "https://datawrapper.de", free: true },
  { title: "Flourish", category: "Data & Visualization", type: "Tool", desc: "Interactive data visualizations and story formats for digital journalism.", url: "https://flourish.studio", free: true },
  { title: "Audacity", category: "Audio Production", type: "Tool", desc: "Free, open-source audio editor for recording and editing podcast content.", url: "https://audacityteam.org", free: true },
  { title: "Descript", category: "Audio Production", type: "Tool", desc: "Edit audio and video by editing text — great for podcast transcription and cleanup.", url: "https://descript.com", free: false },
  { title: "CapCut", category: "Video Production", type: "Tool", desc: "Free video editor with captions, effects, and mobile-friendly workflow.", url: "https://capcut.com", free: true },
  { title: "Digital Security Lab", category: "Digital Safety", type: "Guide", desc: "Protect your sources, your data, and yourself while investigating sensitive topics.", url: "https://securityinabox.org", free: true },
  { title: "EFF Surveillance Self-Defense", category: "Digital Safety", type: "Guide", desc: "Electronic Frontier Foundation's practical guide to protecting digital privacy.", url: "https://ssd.eff.org", free: true },
  { title: "Student Press Law Center", category: "Youth Rights", type: "Legal Resource", desc: "Know your rights as a student journalist — censorship, prior review, and more.", url: "https://splc.org", free: true },
  { title: "Creative Commons Explained", category: "Copyright & Fair Use", type: "Guide", desc: "Understand which content you can legally use, share, and remix in your Media Patch.", url: "https://creativecommons.org", free: true },
  { title: "Web Accessibility Initiative (WAI)", category: "Accessibility", type: "Guide", desc: "Make your Media Patch accessible to people with disabilities — WCAG guidelines explained.", url: "https://w3.org/WAI", free: true },
];

export default function Resources() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = RESOURCES.filter(r => {
    const matchCat = category === "All" || r.category === category;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <p className="system-label mb-4">Tools & Learning</p>
        <h1 className="font-black font-mono text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4 leading-tight">
          Resource Vault
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-xl mb-10 leading-relaxed">
          Curated tools, guides, and platforms for every stage of the Reboot Protocol. Organized by skill area. Vetted by facilitators.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground)/0.5)]" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm pl-10 pr-4 py-3 rounded-sm focus:outline-none focus:border-[hsl(var(--primary)/0.5)] font-mono placeholder:text-[hsl(var(--muted-foreground)/0.4)]"
            aria-label="Search resources"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-3 py-1.5 font-mono text-[10px] tracking-widests uppercase border transition-colors rounded-sm",
                category === c
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]"
                  : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary)/0.4)] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.6)] mb-6 tracking-widests">
          {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Resources grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((r) => (
              <a
                key={r.title}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 rounded-sm hover:border-[hsl(var(--primary)/0.45)] transition-colors group card-accent-primary"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground)/0.6)]">
                        {r.category}
                      </span>
                      <span className={cn(
                        "px-1.5 py-0.5 font-mono text-[9px] rounded-sm tracking-wide",
                        r.free ? "badge-verified" : "badge-pending"
                      )}>
                        {r.free ? "Free" : "Paid"}
                      </span>
                    </div>
                    <h2 className="font-mono font-black text-sm text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">
                      {r.title}
                    </h2>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground)/0.4)] group-hover:text-[hsl(var(--primary))] transition-colors shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{r.desc}</p>
                <span className="inline-block mt-3 font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)] tracking-widests uppercase border border-[hsl(var(--border))] px-2 py-0.5 rounded-sm">
                  {r.type}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[hsl(var(--border))] p-12 text-center rounded-sm">
            <p className="font-mono text-sm text-[hsl(var(--muted-foreground))]">
              No resources match your search.
            </p>
            <Button
              variant="ghost"
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-4 font-mono text-xs rounded-none border border-[hsl(var(--border))]"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
