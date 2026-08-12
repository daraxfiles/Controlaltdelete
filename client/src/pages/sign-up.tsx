import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Terminal, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const inputCls = "w-full bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[hsl(var(--primary)/0.5)] font-mono placeholder:text-[hsl(var(--muted-foreground)/0.4)]";

const ROLES = [
  { value: "youth", label: "Youth Member (ages 14–24)" },
  { value: "facilitator", label: "Facilitator / Program Staff" },
  { value: "mentor", label: "Root Access Mentor (alumni / expert)" },
  { value: "educator", label: "Educator" },
  { value: "community_partner", label: "Community Partner / Organization" },
];

export default function SignUp() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="pt-24 min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="terminal-box p-8 mb-6">
            <CheckCircle className="h-12 w-12 text-[hsl(var(--primary))] mx-auto mb-4" />
            <h1 className="font-mono font-black text-xl text-[hsl(var(--primary))] mb-2">Access Request Sent</h1>
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">Your request has been received.</p>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 leading-relaxed">
            A program facilitator will review your request and send an invitation link to the email you provided. Account access is invitation-based to protect youth safety.
          </p>
          <Link href="/">
            <Button variant="ghost" className="rounded-none border border-[hsl(var(--border))] font-mono text-xs tracking-widests uppercase">
              Return to Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Terminal header */}
        <div className="terminal-box mb-6">
          <div className="terminal-header">
            <Terminal className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
            <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widests ml-2">
              CTRL+ALT+MEDIA :: ACCESS REQUEST
            </span>
          </div>
          <div className="p-5">
            <p className="font-mono text-xs text-[hsl(var(--primary))]">
              INVITATION-BASED ACCESS
            </p>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
              To protect youth safety, accounts are created through program facilitators. Submit a request below.
            </p>
          </div>
        </div>

        <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden card-accent-primary">
          <div className="bg-[hsl(0_0%_6%)] px-5 py-3 border-b border-[hsl(var(--border))]">
            <p className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground))]">Request Access</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
                    First Name
                  </label>
                  <input id="firstName" required placeholder="First" className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="displayName" className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
                    Display Name
                  </label>
                  <input id="displayName" placeholder="Optional" className={inputCls} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
                  Email
                </label>
                <input id="email" type="email" required placeholder="your@email.com" className={inputCls} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="role" className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
                  Your Role
                </label>
                <select id="role" required className={inputCls}>
                  <option value="">Select your role...</option>
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="program" className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
                  Program or Organization
                </label>
                <input id="program" placeholder="School, library, youth org, or program name" className={inputCls} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
                  Why do you want access?
                </label>
                <textarea id="message" rows={3} placeholder="Brief description of your interest..." className={inputCls} />
              </div>

              {/* Youth safety notice */}
              <div className="border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.04)] rounded-sm p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--primary)/0.7)] shrink-0 mt-0.5" />
                  <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
                    Youth accounts require facilitator sponsorship. If you are a young person, ask your program facilitator to create your account directly.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)]"
              >
                Submit Access Request <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.6)]">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-[hsl(var(--primary))] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
