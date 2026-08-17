import { Link } from "wouter";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(0_0%_4%)]">
      <div className="rainbow-line" />
      <div className="container mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-0 mb-4">
              <span className="font-black text-base tracking-tight font-mono text-[hsl(var(--foreground))]">CTRL+ALT+</span>
              <span className="font-black text-base tracking-tight font-mono text-[hsl(var(--primary))]">MEDIA</span>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
              A student-powered creative technology, AI literacy, civic media, and alternative journalism lab.
            </p>
            <p className="font-mono text-xs text-[hsl(var(--primary)/0.7)] tracking-widest uppercase">
              No Receipt. No Reboot.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-mono font-bold text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/reboot-protocol", label: "The Reboot Protocol" },
                { href: "/missions", label: "Missions" },
                { href: "/reboot-crews", label: "Reboot Crews" },
                { href: "/media-patches", label: "Media Patches" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors font-mono text-xs">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-mono font-bold text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/reboot-room", label: "Reboot Room" },
                { href: "/resources", label: "Resource Vault" },
                { href: "/about", label: "About" },
                { href: "/create", label: "Start a Project" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors font-mono text-xs">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Manifesto */}
          <div>
            <h4 className="font-mono font-bold text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] mb-4">
              The Mission
            </h4>
            <div className="terminal-box p-4 space-y-2">
              {[
                "Find the failure.",
                "Build the alternative.",
                "Shift the record.",
              ].map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[hsl(var(--primary)/0.5)] text-xs font-mono mt-0.5">›</span>
                  <span className="text-xs font-mono text-[hsl(var(--foreground)/0.7)]">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[hsl(var(--border))] mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[hsl(var(--muted-foreground))] font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="h-3 w-3 text-[hsl(var(--primary)/0.5)]" />
            <span>CTRL+ALT+MEDIA · We do not go viral. We go verified.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
