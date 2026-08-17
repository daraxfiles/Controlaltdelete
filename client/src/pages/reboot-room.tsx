import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Shield, Volume2, Zap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaPatch } from "@shared/schema";

const ACTIONS = [
  {
    id: "verify",
    label: "Verify",
    icon: Shield,
    color: "hsl(var(--primary))",
    desc: "Offer evidence, expertise, or corrections that strengthen or challenge this patch.",
    placeholder: "Add evidence, expertise, or a correction (optional)...",
    inputLabel: null,
    requiresText: false,
  },
  {
    id: "amplify",
    label: "Amplify",
    icon: Volume2,
    color: "hsl(var(--accent))",
    desc: "Help this project reach a wider audience — share it, cite it, or connect the crew to decision-makers.",
    placeholder: "Describe how you'll amplify this patch...",
    inputLabel: "How will you amplify this?",
    requiresText: true,
  },
  {
    id: "apply",
    label: "Apply",
    icon: Zap,
    color: "hsl(var(--warning))",
    desc: "Commit to taking a concrete action based on what this crew documented.",
    placeholder: "Where will you use this? Describe your commitment...",
    inputLabel: "Where will you use this?",
    requiresText: true,
  },
];

type ResponseCounts = { verify: number; amplify: number; apply: number };
function AudienceCard({ patch }: { patch: MediaPatch }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [chosen, setChosen] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedAction, setSubmittedAction] = useState<string | null>(null);

  const { data: counts } = useQuery<ResponseCounts>({
    queryKey: ["/api/reboot-room/responses", patch.id],
    queryFn: async () => {
      const res = await fetch(`/api/reboot-room/responses/${patch.id}`);
      if (!res.ok) throw new Error("Failed to fetch response counts");
      return res.json();
    },
    staleTime: 30_000,
  });

  const totalCount = counts ? counts.verify + counts.amplify + counts.apply : 0;
  const countFor = (action: string): number => counts ? (counts as Record<string, number>)[action] ?? 0 : 0;

  const mutation = useMutation({
    mutationFn: async (body: Record<string, string | boolean>) => {
      const res = await fetch("/api/reboot-room/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to submit response");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reboot-room/responses", patch.id] });
      setSubmittedAction(chosen);
      setSubmitted(true);
    },
  });

  const handleSubmit = () => {
    if (!chosen) return;
    const action = ACTIONS.find(a => a.id === chosen);
    if (!action) return;
    if (action.requiresText && !text.trim()) return;

    const body: Record<string, string | boolean> = {
      patchId: patch.id,
      action: chosen,
      isAnonymous: !user,
    };
    if (chosen === "apply") {
      body.location = text.trim();
    } else if (text.trim()) {
      body.comment = text.trim();
    }

    mutation.mutate(body);
  };

  const selectedAction = ACTIONS.find(a => a.id === chosen);
  const canSubmit = !!chosen && (!selectedAction?.requiresText || text.trim().length > 0);

  return (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm overflow-hidden card-accent-primary">
      <div className="bg-[hsl(0_0%_6%)] px-5 py-3 border-b border-[hsl(var(--border))] flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))]">
          {patch.crewName} · {patch.community}
        </span>
        <span className="badge-verified px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold">
          <Shield className="inline h-2.5 w-2.5 mr-1" />
          Verified
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-black text-lg text-[hsl(var(--foreground))] mb-2 leading-tight">
          {patch.title}
        </h3>
        <p className="font-mono text-[10px] text-[hsl(var(--accent)/0.8)] uppercase tracking-wide mb-3">
          {patch.topic}
        </p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
          {patch.description}
        </p>

        {/* Live approved response counts */}
        {totalCount > 0 && (
          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[hsl(var(--border))]">
            {ACTIONS.map(a => (
              <ActionCount
                key={a.id}
                count={countFor(a.id)}
                icon={a.icon}
                color={a.color}
                label={a.label}
              />
            ))}
          </div>
        )}

        {!submitted ? (
          <>
            <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.6)] mb-3">
              Choose your response:
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {ACTIONS.map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      setChosen(chosen === action.id ? null : action.id);
                      setText("");
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 py-3 px-2 border rounded-sm transition-all text-center",
                      chosen === action.id
                        ? "border-[hsl(var(--primary)/0.6)] bg-[hsl(var(--primary)/0.08)]"
                        : "border-[hsl(var(--border))] hover:border-[hsl(var(--border)/1.5)]"
                    )}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: chosen === action.id ? action.color : "hsl(var(--muted-foreground))" }}
                    />
                    <span
                      className={cn(
                        "font-mono font-bold text-[10px] tracking-widest uppercase",
                        chosen === action.id ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]"
                      )}
                    >
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {chosen && selectedAction && (
              <div className="mb-4">
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3 leading-relaxed">
                  {selectedAction.desc}
                </p>
                {selectedAction.inputLabel && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground)/0.7)] mb-1.5">
                    {selectedAction.inputLabel}
                  </p>
                )}
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={selectedAction.placeholder}
                  className="w-full bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm p-3 rounded-sm resize-none focus:outline-none focus:border-[hsl(var(--primary)/0.5)] font-mono placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
                  rows={3}
                  aria-label={selectedAction.inputLabel ?? "Your response (optional)"}
                />
              </div>
            )}

            {mutation.isError && (
              <p className="text-xs text-red-400 font-mono mb-3">
                {(mutation.error as Error)?.message ?? "Something went wrong. Please try again."}
              </p>
            )}

            {chosen && (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || mutation.isPending}
                className="w-full rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] disabled:opacity-40"
              >
                {mutation.isPending ? "Submitting…" : "Submit Response"}
              </Button>
            )}
          </>
        ) : (
          <div className="border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)] rounded-sm p-4 text-center">
            <p className="font-mono font-bold text-sm text-[hsl(var(--primary))] mb-1">Response Submitted</p>
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
              Your {submittedAction} response will be reviewed by a facilitator before being added to the public record.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RebootRoom() {
  const { data: patches = [], isLoading } = useQuery<MediaPatch[]>({
    queryKey: ["/api/media-patches"],
  });

  const featured = patches.filter(p => p.featured && p.verificationStatus === "verified");

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <p className="system-label mb-4">Public Showcase</p>
        <h1 className="font-black font-mono text-4xl md:text-5xl text-[hsl(var(--foreground))] mb-4 leading-tight">
          The Reboot Room
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-xl mb-12 leading-relaxed">
          Selected learner investigations, open to the public. Read the work. Add your expertise. Commit to action. Every verified response is added to the patch's public record.
        </p>

        {/* Action legend */}
        <div className="grid grid-cols-3 gap-0 border border-[hsl(var(--border))] mb-12">
          {ACTIONS.map(({ id, label, icon: Icon, color, desc }, i) => (
            <div key={id} className={cn("p-5", i < 2 ? "border-r border-[hsl(var(--border))]" : "")}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" style={{ color }} />
                <span className="font-mono font-black text-sm" style={{ color }}>{label}</span>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Featured patches */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="border border-[hsl(var(--border))] h-80 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map(p => <AudienceCard key={p.id} patch={p} />)}
          </div>
        ) : patches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patches.slice(0, 2).map(p => <AudienceCard key={p.id} patch={p} />)}
          </div>
        ) : (
          <div className="border border-dashed border-[hsl(var(--border))] p-16 text-center">
            <MessageSquare className="h-8 w-8 text-[hsl(var(--muted-foreground)/0.3)] mx-auto mb-4" />
            <p className="font-mono text-sm text-[hsl(var(--muted-foreground))]">
              No patches in the Reboot Room yet. Check back soon.
            </p>
          </div>
        )}

        {/* Moderation note */}
        <div className="mt-12 border border-[hsl(var(--border))] p-6 bg-[hsl(0_0%_6%)]">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-[hsl(var(--primary)/0.6)] shrink-0 mt-0.5" />
            <div>
              <p className="font-mono font-bold text-xs text-[hsl(var(--foreground))] mb-1 tracking-wide">Moderation Notice</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                All audience responses are moderated by a facilitator before being added to the public record. Responses that contain harmful content, personal attacks, or unverified claims will not be published. Learner profiles are private by default.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ActionCount({ count, icon: Icon, color, label }: { count: number; icon: React.ElementType; color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3 w-3" style={{ color }} />
      <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
        <span className="font-bold" style={{ color }}>{count}</span> {label}
      </span>
    </div>
  );
}
