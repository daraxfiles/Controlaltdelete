import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Terminal, LogOut, User, Shield, Search, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useClerk, useUser, Show } from "@clerk/react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/reboot-protocol", label: "The Reboot Protocol" },
  { href: "/missions", label: "Missions" },
  { href: "/reboot-crews", label: "Reboot Crews" },
  { href: "/media-patches", label: "Media Patches" },
  { href: "/reboot-room", label: "Reboot Room" },
];

const COMMUNITIES = [
  {
    href: "/community/uark",
    label: "CTRL+ALT+MEDIA @ UArk",
    sub: "University of Arkansas · Fayetteville",
    color: "#9e1b32",
  },
];

function CommunitiesDropdown({ location }: { location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = location.startsWith("/community/");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-1 text-xs font-mono tracking-wide px-3 py-1.5 rounded-sm transition-colors",
          isActive
            ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
            : "text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.06)]"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Communities
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-[hsl(0_0%_6%)] border border-[hsl(var(--border))] shadow-xl z-50 py-1">
          {COMMUNITIES.map(c => (
            <Link key={c.href} href={c.href} onClick={() => setOpen(false)}>
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-[hsl(var(--foreground)/0.05)] cursor-pointer group">
                <div
                  className="w-2 h-2 rounded-full mt-1 shrink-0"
                  style={{ background: c.color }}
                />
                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold text-[hsl(var(--foreground)/0.9)] group-hover:text-[hsl(var(--foreground))] leading-snug">
                    {c.label}
                  </p>
                  <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.6)] mt-0.5">
                    {c.sub}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          <div className="border-t border-[hsl(var(--border))] mt-1 pt-1 px-4 pb-2">
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] italic">
              More communities coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-[hsl(0_0%_5%/0.95)] backdrop-blur-md border-b border-[hsl(var(--border))]"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 shrink-0">
          <span className="font-black text-sm tracking-tight leading-none font-mono text-[hsl(var(--foreground))]">
            CTRL+ALT+
          </span>
          <span className="font-black text-sm tracking-tight leading-none font-mono text-[hsl(var(--primary))] text-glow-primary">
            MEDIA
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs font-mono tracking-wide transition-colors px-3",
                  location === link.href
                    ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                    : "text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.06)]"
                )}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          <CommunitiesDropdown location={location} />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <Link href="/search" className="hidden md:block">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[hsl(var(--foreground)/0.5)] hover:text-[hsl(var(--foreground))]">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {/* Auth: signed out */}
          <Show when="signed-out">
            <Link href="/sign-in" className="hidden md:block">
              <Button variant="ghost" size="sm" className="text-xs font-mono tracking-wide px-3 text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--foreground))]">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" className="hidden md:block">
              <Button size="sm" className="rounded-none px-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.85)] font-mono font-bold text-xs tracking-widest uppercase">
                Start Reboot
              </Button>
            </Link>
          </Show>

          {/* Auth: signed in */}
          <Show when="signed-in">
            <Link href="/dashboard" className="hidden md:block">
              <Button variant="ghost" size="sm" className={cn(
                "text-xs font-mono tracking-wide px-3",
                location === "/dashboard"
                  ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                  : "text-[hsl(var(--foreground)/0.7)] hover:text-[hsl(var(--foreground))]"
              )}>
                <User className="h-3 w-3 mr-1.5" />
                {user?.firstName ?? "Dashboard"}
              </Button>
            </Link>
            <Link href="/create" className="hidden md:block">
              <Button size="sm" className="rounded-none px-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.85)] font-mono font-bold text-xs tracking-widest uppercase">
                + New Reboot
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-8 w-8 text-[hsl(var(--foreground)/0.4)] hover:text-[hsl(var(--foreground)/0.8)]"
              onClick={() => signOut({ redirectUrl: "/" })}
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </Show>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-[hsl(var(--foreground)/0.8)] hover:bg-[hsl(var(--foreground)/0.06)]" aria-label="Open navigation menu">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-[hsl(0_0%_5%)] border-[hsl(var(--border))]" aria-describedby={undefined}>
              <VisuallyHidden><SheetTitle>Navigation Menu</SheetTitle></VisuallyHidden>

              <div className="flex items-center gap-2 mt-2 mb-6 pb-4 border-b border-[hsl(var(--border))]">
                <Terminal className="h-4 w-4 text-[hsl(var(--primary))]" />
                <span className="font-mono text-xs text-[hsl(var(--primary))] tracking-widest uppercase">Navigation</span>
              </div>

              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                    <Button variant="ghost" className={cn(
                      "w-full justify-start font-mono text-xs tracking-wide rounded-none border-l-2 pl-4",
                      location === link.href
                        ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]"
                        : "border-transparent text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.04)]"
                    )}>
                      {link.label}
                    </Button>
                  </Link>
                ))}
                <Link href="/search" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-mono text-xs tracking-wide rounded-none border-l-2 border-transparent text-[hsl(var(--foreground)/0.6)]">
                    <Search className="h-3 w-3 mr-2" /> Search
                  </Button>
                </Link>

                {/* Communities section in mobile menu */}
                <div className="border-t border-[hsl(var(--border))] my-3 pt-3">
                  <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.4)] px-4 mb-1">
                    Communities
                  </p>
                  {COMMUNITIES.map(c => (
                    <Link key={c.href} href={c.href} onClick={() => setOpen(false)}>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[hsl(var(--foreground)/0.04)] cursor-pointer">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                        <div>
                          <p className="font-mono text-xs text-[hsl(var(--foreground)/0.7)]">{c.label}</p>
                          <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.5)]">{c.sub}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-[hsl(var(--border))] my-2" />

                <Show when="signed-out">
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start font-mono text-xs tracking-wide rounded-none border-l-2 border-transparent text-[hsl(var(--foreground)/0.6)]">Sign In</Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setOpen(false)}>
                    <Button className="w-full mt-2 rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                      Start Reboot
                    </Button>
                  </Link>
                </Show>

                <Show when="signed-in">
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start font-mono text-xs tracking-wide rounded-none border-l-2 border-transparent text-[hsl(var(--foreground)/0.6)]">
                      <User className="h-3 w-3 mr-2" /> Dashboard
                    </Button>
                  </Link>
                  <Link href="/create" onClick={() => setOpen(false)}>
                    <Button className="w-full mt-2 rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                      + New Reboot
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start font-mono text-xs tracking-wide rounded-none border-l-2 border-transparent text-[hsl(var(--foreground)/0.4)] mt-1"
                    onClick={() => { signOut({ redirectUrl: "/" }); setOpen(false); }}>
                    <LogOut className="h-3 w-3 mr-2" /> Sign Out
                  </Button>
                </Show>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
