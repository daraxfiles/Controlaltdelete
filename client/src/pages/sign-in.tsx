import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Terminal, ArrowRight, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { role: "Youth Member", email: "youth@demo.ctrl", desc: "Access dashboard, missions, and project workspace" },
  { role: "Facilitator", email: "facilitator@demo.ctrl", desc: "Review, approve, and manage cohorts" },
  { role: "Root Access Mentor", email: "mentor@demo.ctrl", desc: "Review selected projects and give feedback" },
  { role: "Public Visitor", email: "", desc: "Browse Media Patches and the Reboot Room" },
];

const inputCls = "w-full bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[hsl(var(--primary)/0.5)] font-mono placeholder:text-[hsl(var(--muted-foreground)/0.4)]";

export default function SignIn() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("Authentication is not yet configured. Use a demo account or contact your program facilitator for access.");
  };

  return (
    <main className="pt-24 min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Terminal header */}
        <div className="terminal-box mb-6">
          <div className="terminal-header">
            <Terminal className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
            <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widests ml-2">
              CTRL+ALT+MEDIA :: AUTHENTICATION
            </span>
          </div>
          <div className="p-5">
            <p className="font-mono text-xs text-[hsl(var(--primary))]">
              <span className="cursor-blink">█</span>{" "}
              IDENTITY VERIFICATION REQUIRED
            </p>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
              Only verified program participants may access the platform.
            </p>
          </div>
        </div>

        {/* Sign in form */}
        <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden card-accent-primary">
          <div className="bg-[hsl(0_0%_6%)] px-5 py-3 border-b border-[hsl(var(--border))]">
            <p className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">Sign In</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="email" className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="your@email.com"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className={cn(inputCls, "pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground)/0.5)] hover:text-[hsl(var(--foreground))] transition-colors"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.06)] rounded-sm px-4 py-3">
                  <p className="flex items-start gap-2 font-mono text-[10px] text-[hsl(var(--warning)/0.9)] leading-relaxed">
                    <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" /> {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)]"
              >
                Sign In <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.6)]">
                No account?{" "}
                <Link href="/sign-up" className="text-[hsl(var(--primary))] hover:underline">
                  Request access
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-6 border border-[hsl(var(--border))] rounded-sm overflow-hidden">
          <div className="bg-[hsl(0_0%_6%)] px-4 py-2.5 border-b border-[hsl(var(--border))]">
            <p className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">Demo Accounts Available</p>
          </div>
          <div className="divide-y divide-[hsl(var(--border)/0.5)]">
            {DEMO_ACCOUNTS.map(acc => (
              <div key={acc.role} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs text-[hsl(var(--foreground)/0.85)]">{acc.role}</span>
                  {acc.email && (
                    <span className="font-mono text-[10px] text-[hsl(var(--accent)/0.8)]">{acc.email}</span>
                  )}
                </div>
                <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.6)] mt-0.5">{acc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Browse without signing in */}
        <div className="mt-4 text-center">
          <Link href="/media-patches">
            <span className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.6)] hover:text-[hsl(var(--primary))] transition-colors">
              Browse Media Patches without signing in →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
