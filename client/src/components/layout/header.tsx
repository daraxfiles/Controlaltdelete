import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/reboot-protocol", label: "The Reboot Protocol" },
  { href: "/missions", label: "Missions" },
  { href: "/reboot-crews", label: "Reboot Crews" },
  { href: "/media-patches", label: "Media Patches" },
  { href: "/reboot-room", label: "Reboot Room" },
  { href: "/resources", label: "Resource Vault" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
        <Link href="/" className="flex items-center gap-0 shrink-0 group">
          <span className={cn(
            "font-black text-sm tracking-tight leading-none font-mono transition-colors",
            "text-[hsl(var(--foreground))]"
          )}>
            CTRL+ALT+
          </span>
          <span className="font-black text-sm tracking-tight leading-none font-mono text-[hsl(var(--primary))] text-glow-primary">
            MEDIA
          </span>
        </Link>

        {/* Center nav — hidden on smaller screens */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.slice(0, 5).map((link) => (
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
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/about" className="hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-xs font-mono tracking-wide px-3",
                location === "/about"
                  ? "text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                  : "text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--foreground))]"
              )}
            >
              About
            </Button>
          </Link>
          <Link href="/sign-in" className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-mono tracking-wide px-3 text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--foreground))]"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/create" className="hidden md:block">
            <Button
              size="sm"
              className="rounded-none px-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.85)] font-mono font-bold text-xs tracking-widest uppercase"
            >
              Start Reboot
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-[hsl(var(--foreground)/0.8)] hover:bg-[hsl(var(--foreground)/0.06)]"
                aria-label="Open navigation menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-[hsl(0_0%_5%)] border-[hsl(var(--border))]"
              aria-describedby={undefined}
            >
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>

              {/* Terminal header */}
              <div className="flex items-center gap-2 mt-2 mb-6 pb-4 border-b border-[hsl(var(--border))]">
                <Terminal className="h-4 w-4 text-[hsl(var(--primary))]" />
                <span className="font-mono text-xs text-[hsl(var(--primary))] tracking-widest uppercase">
                  Navigation
                </span>
              </div>

              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start font-mono text-xs tracking-wide rounded-none border-l-2 pl-4",
                        location === link.href
                          ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.08)]"
                          : "border-transparent text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.04)]"
                      )}
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}

                <div className="border-t border-[hsl(var(--border))] my-4" />

                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-mono text-xs tracking-wide rounded-none border-l-2 border-transparent text-[hsl(var(--foreground)/0.6)]">
                    Sign In
                  </Button>
                </Link>

                <Link href="/create" onClick={() => setOpen(false)}>
                  <Button className="w-full mt-2 rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                    Start Reboot
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
