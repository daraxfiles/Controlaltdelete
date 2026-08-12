import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Wrench,
  PenLine,
  ImagePlay,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/resources",
    label: "Tools & Resources",
    icon: Wrench,
    description: "Apps, games & videos",
  },
  {
    href: "/create",
    label: "Create Your Project",
    icon: PenLine,
    description: "7-step project wizard",
  },
  {
    href: "/gallery",
    label: "Gallery",
    icon: ImagePlay,
    description: "Student showcase",
  },
  {
    href: "/schedule",
    label: "Schedule",
    icon: CalendarDays,
    description: "12-session program",
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out",
        "bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))]",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 h-14 border-b border-[hsl(var(--sidebar-border))] shrink-0",
          collapsed && "justify-center px-0"
        )}
      >
        <Link href="/resources" className="flex items-center gap-0 group min-w-0">
          {!collapsed ? (
            <div className="min-w-0 overflow-hidden">
              <p className="text-sm font-black text-[hsl(var(--sidebar-foreground))] leading-tight font-mono tracking-tight">
                CTRL+ALT+<span className="text-[hsl(var(--primary))]">MEDIA</span>
              </p>
            </div>
          ) : (
            <span className="text-[10px] font-black font-mono text-[hsl(var(--primary))] leading-none">C+A</span>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto" data-testid="nav-sidebar">
        <p
          className={cn(
            "px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]",
            collapsed && "hidden"
          )}
        >
          Navigation
        </p>

        {navItems.map(({ href, label, icon: Icon, description }) => {
          const active = location === href;
          return (
            <Link key={href} href={href}>
              <div
                data-testid={`nav-sidebar-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-150",
                  active
                    ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]"
                    : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]",
                  collapsed && "justify-center px-0"
                )}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-[hsl(var(--primary))]" />
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active
                      ? "text-[hsl(var(--primary))]"
                      : "text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--sidebar-foreground))]"
                  )}
                />

                {!collapsed && (
                  <div className="min-w-0 overflow-hidden">
                    <p className="text-sm font-medium leading-tight truncate">{label}</p>
                    <p className="text-[11px] leading-tight text-[hsl(var(--muted-foreground))] truncate">
                      {description}
                    </p>
                  </div>
                )}

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded-md bg-[hsl(var(--card))] border border-[hsl(var(--border))] px-2.5 py-1.5 text-xs font-medium shadow-lg">
                    {label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-[hsl(var(--sidebar-border))] shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          data-testid="button-sidebar-collapse"
          className={cn(
            "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))] transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
