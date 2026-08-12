import { 
  Wrench, 
  Search, 
  Gamepad2, 
  Video, 
  ExternalLink,
  ShieldAlert,
  Eye,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import React from 'react';

const TOOLS = [
  {
    title: "CapCut",
    desc: "Easy-to-use video editor with cool effects and transitions.",
    tags: ["Video", "Editor", "Free"],
    icon: Wrench,
    color: "#00f0ff"
  },
  {
    title: "Canva",
    desc: "Design graphics, posters, and thumbnails in minutes.",
    tags: ["Design", "Graphics", "Web"],
    icon: Wrench,
    color: "#00f0ff",
    glowing: true
  },
  {
    title: "Audacity",
    desc: "Record and edit audio for your podcasts or voiceovers.",
    tags: ["Audio", "Desktop", "Pro"],
    icon: Wrench,
    color: "#00f0ff"
  },
  {
    title: "Pixlr",
    desc: "Browser-based photo editor for quick image touch-ups.",
    tags: ["Photo", "Web", "Free"],
    icon: Wrench,
    color: "#00f0ff"
  }
];

const FACT_CHECK = [
  {
    title: "Stop",
    desc: "Pause before you share. Don't let your emotions dictate your clicks.",
    tags: ["SIFT", "Mindfulness"],
    icon: ShieldAlert,
    color: "#ff00e5"
  },
  {
    title: "Investigate",
    desc: "Find the original source. Is it reputable? Who created it?",
    tags: ["SIFT", "Research"],
    icon: Search,
    color: "#ff00e5",
    glowing: true
  },
  {
    title: "Find Better Coverage",
    desc: "Read laterally. What do other trusted sources say?",
    tags: ["SIFT", "Context"],
    icon: Eye,
    color: "#ff00e5"
  },
  {
    title: "Trace Claims",
    desc: "Trace quotes, media, and claims back to their original context.",
    tags: ["SIFT", "Verification"],
    icon: CheckCircle2,
    color: "#ff00e5"
  }
];

const GAMES = [
  {
    title: "Bad News",
    desc: "Play the role of a fake news tycoon. Learn the tactics by using them.",
    tags: ["Web Game", "Strategy"],
    icon: Gamepad2,
    color: "#7000ff",
    glowing: true
  },
  {
    title: "Harmony Square",
    desc: "Protect your town square from political polarization and trolls.",
    tags: ["Web Game", "Story"],
    icon: Gamepad2,
    color: "#7000ff"
  },
  {
    title: "Go Viral!",
    desc: "A 5-minute game that helps protect you against COVID-19 misinformation.",
    tags: ["Web Game", "Quick"],
    icon: Gamepad2,
    color: "#7000ff"
  }
];

const VIDEOS = [
  {
    title: "How False News Can Spread",
    desc: "A quick animated breakdown of how misinformation goes viral.",
    tags: ["TED-Ed", "Animation", "4 mins"],
    icon: Video,
    color: "#ffae00"
  },
  {
    title: "Navigating Digital Media",
    desc: "Crash Course on how to navigate the overwhelming digital media landscape.",
    tags: ["Crash Course", "Educational", "10 mins"],
    icon: Video,
    color: "#ffae00",
    glowing: true
  },
  {
    title: "Deepfakes Explained",
    desc: "What are deepfakes, how are they made, and how to spot them.",
    tags: ["Tech", "AI", "8 mins"],
    icon: Video,
    color: "#ffae00"
  },
  {
    title: "The Algorithm",
    desc: "How social media algorithms decide what you see every day.",
    tags: ["Tech", "Social", "6 mins"],
    icon: Video,
    color: "#ffae00"
  },
  {
    title: "Fact-Checking 101",
    desc: "Basic steps to verify information before sharing.",
    tags: ["Guide", "Basics", "5 mins"],
    icon: Video,
    color: "#ffae00"
  }
];

export function CardWall() {
  const getGlowStyle = (color: string, isGlowing?: boolean) => {
    return isGlowing
      ? {
          boxShadow: `0 0 20px -5px ${color}, inset 0 0 10px -5px ${color}`,
          borderColor: color
        }
      : {};
  };

  return (
    <div className="min-h-screen p-8 lg:p-16 text-slate-200 font-sans" style={{ backgroundColor: '#0b0b0e' }}>
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Header */}
        <header className="text-center space-y-4 mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff00e5] to-[#7000ff] drop-shadow-[0_0_15px_rgba(255,0,229,0.3)]">
            Command Center
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Your essential toolkit for the Creative Media Bootcamp. Create content, check facts, and level up your media literacy.
          </p>
        </header>

        {/* Tools Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-[#00f0ff]/20 pb-4">
            <Wrench className="w-8 h-8 text-[#00f0ff]" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-blue-500 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
              Creation Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOOLS.map((tool, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#13131a',
                  ...getGlowStyle(tool.color, tool.glowing)
                }}
                className={`relative group rounded-xl p-6 border border-white/5 transition-all duration-300 hover:scale-[1.02] ${!tool.glowing && 'hover:border-[#00f0ff]/50'}`}
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-5 h-5 text-[#00f0ff]" />
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center mb-6">
                  <tool.icon className="w-6 h-6 text-[#00f0ff]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-slate-400 mb-6">{tool.desc}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {tool.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fact Check Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-[#ff00e5]/20 pb-4">
            <ShieldAlert className="w-8 h-8 text-[#ff00e5]" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00e5] to-pink-500 drop-shadow-[0_0_8px_rgba(255,0,229,0.4)]">
              Fact-Check (SIFT)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FACT_CHECK.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#13131a',
                  ...getGlowStyle(item.color, item.glowing)
                }}
                className={`rounded-xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1 ${!item.glowing && 'hover:border-[#ff00e5]/50 hover:shadow-[0_0_20px_-5px_#ff00e5]'}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#ff00e5]/10 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-[#ff00e5]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 mb-6">{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full border border-[#ff00e5]/30 text-[#ff00e5]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Games Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-[#7000ff]/20 pb-4">
            <Gamepad2 className="w-8 h-8 text-[#7000ff]" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7000ff] to-purple-500 drop-shadow-[0_0_8px_rgba(112,0,255,0.4)]">
              Training Sims
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {GAMES.map((game, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#13131a',
                  ...getGlowStyle(game.color, game.glowing)
                }}
                className={`group flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-xl p-6 border border-white/5 transition-all duration-500 ${!game.glowing && 'hover:border-[#7000ff]/60 hover:bg-[#7000ff]/5'}`}
              >
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7000ff]/20 to-transparent flex items-center justify-center border border-[#7000ff]/20 group-hover:rotate-12 transition-transform">
                  <game.icon className="w-8 h-8 text-[#7000ff]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {game.title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#7000ff]" />
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{game.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 rounded bg-[#7000ff]/20 text-purple-300 font-medium tracking-wide uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Videos Section */}
        <section className="space-y-8 pb-16">
          <div className="flex items-center gap-4 border-b border-[#ffae00]/20 pb-4">
            <Video className="w-8 h-8 text-[#ffae00]" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffae00] to-yellow-500 drop-shadow-[0_0_8px_rgba(255,174,0,0.4)]">
              Video Archives
            </h2>
          </div>
          <div className="space-y-4">
            {VIDEOS.map((video, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#13131a',
                  ...getGlowStyle(video.color, video.glowing)
                }}
                className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-lg p-4 border border-white/5 transition-all duration-300 cursor-pointer ${!video.glowing && 'hover:border-[#ffae00]/40'}`}
              >
                <div className="w-full sm:w-48 h-28 bg-black/50 rounded flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#ffae00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-[#ffae00] border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="flex-1 py-2 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white mb-1">{video.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{video.desc}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {video.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-[#ffae00]/30 text-[#ffae00]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
