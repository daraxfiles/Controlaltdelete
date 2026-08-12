import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <main className="pt-24 min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="terminal-box mb-8">
          <div className="terminal-header">
            <Terminal className="h-3.5 w-3.5 text-[hsl(var(--destructive))]" />
            <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widests ml-2">
              SYSTEM ERROR
            </span>
          </div>
          <div className="p-6">
            <div className="font-mono font-black text-6xl text-[hsl(var(--destructive)/0.3)] mb-2">404</div>
            <p className="font-mono text-sm text-[hsl(var(--destructive))] mb-1">PAGE NOT FOUND</p>
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
              The record you are looking for does not exist or has been moved.
            </p>
          </div>
        </div>
        <Link href="/">
          <Button className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)]">
            Return to Home Base
          </Button>
        </Link>
      </div>
    </main>
  );
}
