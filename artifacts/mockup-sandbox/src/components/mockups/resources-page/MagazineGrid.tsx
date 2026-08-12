import React from "react";
import { 
  Play, 
  Gamepad2, 
  Search, 
  PenTool,
  ExternalLink,
  ChevronRight,
  MonitorPlay,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export function MagazineGrid() {
  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Header */}
      <header className="px-8 py-12 md:py-24 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-indigo-400 font-mono tracking-widest uppercase text-sm mb-4">
            Curated Collection
          </p>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-6 leading-none">
            Creative<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
              Arsenal
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl font-light">
            Everything you need to master media creation and navigate the digital landscape with a critical eye.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* 01. TOOLS */}
        <section className="border-b border-white/10">
          {/* Banner */}
          <div className="relative h-[40vh] md:h-[60vh] overflow-hidden group">
            <img 
              src="/__mockup/images/tools-banner.jpg" 
              alt="Tools Banner" 
              className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-60 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex items-end justify-between">
              <div>
                <span className="text-6xl md:text-9xl font-black text-white/10 leading-none -ml-2 select-none tracking-tighter">01</span>
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight -mt-4 md:-mt-8 relative z-10 flex items-center gap-4">
                  Tools <PenTool className="w-8 h-8 md:w-12 md:h-12 text-indigo-400" />
                </h2>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Media Software / 4 Items</p>
              </div>
            </div>
          </div>
          
          {/* Content Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/10">
            {/* Featured Item */}
            <div className="md:col-span-8 bg-[#13131a] p-8 md:p-12 hover:bg-[#16161e] transition-colors group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
              <div className="flex flex-col h-full justify-between min-h-[300px]">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1 text-xs font-mono tracking-wider text-white/60">
                    VIDEO & AUDIO
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">CapCut & Audacity</h3>
                  <p className="text-white/50 text-lg leading-relaxed max-w-2xl font-light">
                    Industry-standard free tools for cutting your video masterpieces and recording crisp podcast audio. Master the timeline and audio waveforms.
                  </p>
                </div>
              </div>
            </div>

            {/* Smaller Items */}
            <div className="md:col-span-4 flex flex-col gap-px bg-white/10">
              <div className="bg-[#13131a] p-8 hover:bg-[#16161e] transition-colors group cursor-pointer flex-1">
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono tracking-wider text-white/60 inline-block mb-6">
                  GRAPHICS
                </div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  Canva Pro
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-white/50 font-light text-sm">
                  Design eye-catching thumbnails, posters, and social graphics in minutes with powerful templates.
                </p>
              </div>
              <div className="bg-[#13131a] p-8 hover:bg-[#16161e] transition-colors group cursor-pointer flex-1">
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono tracking-wider text-white/60 inline-block mb-6">
                  PHOTO
                </div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  Photopea
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-white/50 font-light text-sm">
                  Advanced browser-based photo editing. Basically Photoshop, but free and runs anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 02. FACT-CHECK */}
        <section className="border-b border-white/10">
          <div className="relative h-[30vh] md:h-[50vh] overflow-hidden group">
            <img 
              src="/__mockup/images/fact-banner.jpg" 
              alt="Fact Check Banner" 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-50 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex items-end justify-between">
              <div>
                <span className="text-6xl md:text-9xl font-black text-white/10 leading-none -ml-2 select-none tracking-tighter">02</span>
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight -mt-4 md:-mt-8 relative z-10 flex items-center gap-4">
                  Truth <Search className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />
                </h2>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {/* The SIFT Method - Heavy text block */}
            <div className="bg-[#13131a] p-8 md:p-12 md:col-span-1">
              <h3 className="text-3xl font-bold mb-8 tracking-tight text-emerald-100">The SIFT Method</h3>
              <div className="space-y-8">
                {[
                  { letter: "S", title: "Stop", desc: "Before you share, ask yourself if you know the source and their reputation." },
                  { letter: "I", title: "Investigate", desc: "Look into the source. Are they credible on this topic?" },
                  { letter: "F", title: "Find Better Coverage", desc: "Read laterally. What do other trusted sources say?" },
                  { letter: "T", title: "Trace to Original", desc: "Find the original context of the quote, image, or claim." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="text-4xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors w-12 text-center">
                      {item.letter}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-white/50 font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Signs */}
            <div className="bg-[#13131a] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 text-[20rem] font-black text-white/[0.02] leading-none pointer-events-none tracking-tighter">
                FAKE
              </div>
              <h3 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3">
                <AlertTriangle className="text-amber-500" />
                Red Flags
              </h3>
              <ul className="space-y-4">
                {[
                  "Outrageous, highly emotional headlines designed to make you angry",
                  "Missing author names or sketchy \"about us\" pages",
                  "Grainy images that don't match the story context",
                  "Lots of ALL CAPS and exclamation points!!!",
                  "Asking you to share immediately before reading"
                ].map((flag, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 border border-white/5 rounded-lg bg-white/[0.02]">
                    <CheckCircle2 className="w-5 h-5 text-amber-500/50 mt-0.5 shrink-0" />
                    <span className="text-white/70 font-light">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 03. GAMES */}
        <section className="border-b border-white/10">
          <div className="relative h-[30vh] md:h-[50vh] overflow-hidden group">
            <img 
              src="/__mockup/images/games-banner.jpg" 
              alt="Games Banner" 
              className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-60 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex items-end justify-between">
              <div>
                <span className="text-6xl md:text-9xl font-black text-white/10 leading-none -ml-2 select-none tracking-tighter">03</span>
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight -mt-4 md:-mt-8 relative z-10 flex items-center gap-4">
                  Games <Gamepad2 className="w-8 h-8 md:w-12 md:h-12 text-pink-500" />
                </h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {[
              { title: "Bad News", desc: "Step into the shoes of a fake news tycoon. Drop all pretense of ethics and learn the dark arts of disinformation to understand how they work.", tag: "SIMULATOR" },
              { title: "Harmony Square", desc: "Defend a peaceful town from a malicious troll spreading political polarization and chaos.", tag: "STRATEGY" },
              { title: "Go Viral!", desc: "Learn how the COVID-19 infodemic spread by becoming the viral vector yourself.", tag: "EDUCATIONAL" }
            ].map((game, i) => (
              <div key={i} className="bg-[#13131a] p-8 md:p-10 hover:bg-[#16161e] transition-colors group cursor-pointer flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono tracking-wider text-pink-400/80 inline-block mb-6">
                    {game.tag}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{game.title}</h3>
                  <p className="text-white/50 font-light mb-8 line-clamp-4">
                    {game.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono text-white/30 group-hover:text-pink-400 transition-colors uppercase tracking-widest">
                  Play Now <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 04. VIDEOS */}
        <section className="mb-24">
          <div className="relative h-[30vh] md:h-[50vh] overflow-hidden group">
            <img 
              src="/__mockup/images/videos-banner.jpg" 
              alt="Videos Banner" 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-50 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex items-end justify-between">
              <div>
                <span className="text-6xl md:text-9xl font-black text-white/10 leading-none -ml-2 select-none tracking-tighter">04</span>
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight -mt-4 md:-mt-8 relative z-10 flex items-center gap-4">
                  Videos <MonitorPlay className="w-8 h-8 md:w-12 md:h-12 text-cyan-400" />
                </h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/10">
            {/* Featured Video */}
            <div className="md:col-span-8 bg-[#13131a] p-8 md:p-12 group cursor-pointer hover:bg-[#16161e] transition-colors relative">
              <div className="aspect-video bg-black rounded-lg mb-8 relative overflow-hidden flex items-center justify-center border border-white/10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 grayscale group-hover:scale-105 group-hover:opacity-40 transition-all duration-700" />
                <div className="w-20 h-20 rounded-full bg-cyan-500/90 flex items-center justify-center pl-2 backdrop-blur-sm z-10 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                  <Play className="w-8 h-8 text-black" fill="currentColor" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">The Power of Algorithms</h3>
              <p className="text-white/50 text-lg font-light">
                Dive deep into how social media recommendation engines work, how they create echo chambers, and why they prioritize engaging (often polarizing) content over truthful information.
              </p>
            </div>

            {/* Video List */}
            <div className="md:col-span-4 flex flex-col gap-px bg-white/10">
              {[
                { title: "What is Misinformation vs Disinformation?", dur: "5:23" },
                { title: "Deepfakes Explained in 3 Minutes", dur: "3:41" },
                { title: "How to Spot AI Generated Images", dur: "7:12" },
                { title: "The Psychology of Fake News", dur: "9:05" }
              ].map((vid, i) => (
                <div key={i} className="bg-[#13131a] p-6 flex-1 hover:bg-[#16161e] transition-colors group cursor-pointer flex flex-col justify-center">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
                      <Play className="w-5 h-5 ml-1" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 group-hover:text-cyan-100 transition-colors leading-snug">
                        {vid.title}
                      </h4>
                      <p className="text-white/30 font-mono text-xs">{vid.dur}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer minimal */}
      <footer className="py-12 text-center text-white/20 font-mono text-sm border-t border-white/5">
        &copy; Creative Media Bootcamp. Navigate the Noise.
      </footer>
    </div>
  );
}
