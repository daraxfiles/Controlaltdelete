import React, { useState } from "react";
import { Wrench, ShieldCheck, Gamepad2, PlaySquare, Search, ChevronRight, ExternalLink } from "lucide-react";

type Category = "tools" | "fact-check" | "games" | "videos";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  url?: string;
}

const data: Record<Category, ContentItem[]> = {
  tools: [
    {
      id: "t1",
      title: "Canva for Education",
      description: "Design graphics, presentations, and videos easily. Includes premium templates for students.",
      tags: ["Design", "Video", "Free"],
      icon: <Wrench className="w-5 h-5 text-blue-400" />,
    },
    {
      id: "t2",
      title: "CapCut Web",
      description: "In-browser video editor with powerful effects, transitions, and text-to-speech tools.",
      tags: ["Video Editing", "Browser-based"],
      icon: <PlaySquare className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: "t3",
      title: "Audacity",
      description: "Free, open source, cross-platform audio software for multi-track recording and editing.",
      tags: ["Audio", "Download required"],
      icon: <Wrench className="w-5 h-5 text-orange-400" />,
    },
    {
      id: "t4",
      title: "Pixlr E",
      description: "Advanced photo editor similar to Photoshop, directly in your browser.",
      tags: ["Photo Editing", "Web"],
      icon: <Wrench className="w-5 h-5 text-teal-400" />,
    }
  ],
  "fact-check": [
    {
      id: "f1",
      title: "The SIFT Method",
      description: "Stop, Investigate the source, Find better coverage, Trace claims, quotes and media to the original context.",
      tags: ["Methodology", "Core Skill"],
      icon: <ShieldCheck className="w-5 h-5 text-green-400" />,
    },
    {
      id: "f2",
      title: "Snopes",
      description: "The internet's definitive fact-checking resource, investigating urban legends, hoaxes, and folklore.",
      tags: ["Reference", "Database"],
      icon: <Search className="w-5 h-5 text-yellow-400" />,
    },
    {
      id: "f3",
      title: "Google Reverse Image Search",
      description: "Find the original source of an image to see if it's been manipulated or taken out of context.",
      tags: ["Tool", "Verification"],
      icon: <Search className="w-5 h-5 text-blue-400" />,
    }
  ],
  games: [
    {
      id: "g1",
      title: "Bad News",
      description: "Drop your ethics and become a fake news tycoon. Learn the tactics used to spread misinformation.",
      tags: ["Interactive", "Award-winning"],
      icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
    },
    {
      id: "g2",
      title: "Harmony Square",
      description: "A short game about fake news. Defend your peaceful town from a malicious disinformation campaign.",
      tags: ["Quick play", "Educational"],
      icon: <Gamepad2 className="w-5 h-5 text-pink-400" />,
    },
    {
      id: "g3",
      title: "Go Viral!",
      description: "A 5-minute game that helps protect you against COVID-19 misinformation by learning their tricks.",
      tags: ["Health", "Short"],
      icon: <Gamepad2 className="w-5 h-5 text-red-400" />,
    }
  ],
  videos: [
    {
      id: "v1",
      title: "Crash Course: Navigating Digital Information",
      description: "A 10-episode series teaching you how to evaluate the information you read online.",
      tags: ["Series", "YouTube"],
      icon: <PlaySquare className="w-5 h-5 text-red-500" />,
    },
    {
      id: "v2",
      title: "How false news can spread",
      description: "Noah Tavlin explores how false news spreads and the consequences of echo chambers.",
      tags: ["TED-Ed", "Animation"],
      icon: <PlaySquare className="w-5 h-5 text-red-500" />,
    },
    {
      id: "v3",
      title: "Deepfakes: Is This Video Real?",
      description: "Understanding AI-generated video manipulation and how to spot synthetic media.",
      tags: ["AI", "Tech"],
      icon: <PlaySquare className="w-5 h-5 text-purple-500" />,
    }
  ]
};

export function SidebarFilter() {
  const [activeCategory, setActiveCategory] = useState<Category>("tools");

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: "tools", label: "Media Tools", icon: <Wrench className="w-4 h-4" /> },
    { id: "fact-check", label: "Fact-Checking", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "games", label: "Learning Games", icon: <Gamepad2 className="w-4 h-4" /> },
    { id: "videos", label: "Video Resources", icon: <PlaySquare className="w-4 h-4" /> },
  ];

  return (
    <div 
      className="w-full min-h-[800px] flex text-zinc-300 font-sans"
      style={{ backgroundColor: "#0b0b0e" }}
    >
      {/* Sidebar */}
      <div className="w-[240px] shrink-0 border-r border-white/5 p-6 flex flex-col gap-6" style={{ backgroundColor: "#0b0b0e" }}>
        <div className="px-2">
          <h2 className="text-xl font-semibold text-white tracking-tight">Resources</h2>
          <p className="text-xs text-zinc-500 mt-1">Creative Media Bootcamp</p>
        </div>

        <nav className="flex flex-col gap-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "text-white bg-[#7c3aed]/10 shadow-[inset_2px_0_0_0_#7c3aed]" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <div className={`${isActive ? "text-[#7c3aed]" : "text-zinc-500"}`}>
                  {cat.icon}
                </div>
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {categories.find(c => c.id === activeCategory)?.label}
            </h1>
            <p className="text-zinc-400">
              {activeCategory === "tools" && "Software and platforms for creating digital media."}
              {activeCategory === "fact-check" && "Techniques and databases to verify online information."}
              {activeCategory === "games" && "Playable experiences teaching media literacy concepts."}
              {activeCategory === "videos" && "Educational series and deep-dives on digital literacy."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {data[activeCategory].map((item) => (
              <div 
                key={item.id}
                className="group relative flex items-start gap-4 p-5 rounded-xl border border-white/5 transition-all duration-200 hover:border-white/10 hover:-translate-y-[1px]"
                style={{ backgroundColor: "#13131a" }}
              >
                <div className="shrink-0 p-3 rounded-lg bg-black/50 border border-white/5 group-hover:scale-105 transition-transform duration-200">
                  {item.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="text-base font-semibold text-zinc-100 truncate">
                      {item.title}
                    </h3>
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[#7c3aed]">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-zinc-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
