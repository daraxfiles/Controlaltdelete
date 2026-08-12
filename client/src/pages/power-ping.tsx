import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, Clock, AlertTriangle, ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  projectTitle: z.string().min(1, "Required"),
  recipientName: z.string().min(1, "Recipient name required"),
  recipientOrg: z.string().min(1, "Organization required"),
  recipientRole: z.string().min(1, "Role required"),
  questions: z.string().min(10, "Add at least one specific question"),
  patchUrl: z.string().optional(),
  responseDeadline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STATUS_CONFIG = {
  sent: { label: "Sent", cls: "badge-pending", Icon: Send },
  responded: { label: "Responded", cls: "badge-verified", Icon: CheckCircle },
  action_promised: { label: "Action Promised", cls: "badge-verified", Icon: CheckCircle },
  no_response: { label: "No Response", cls: "badge-error", Icon: AlertTriangle },
} as const;

export default function PowerPing() {
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);

  const { data: pings = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/power-pings"],
  });

  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      apiRequest("POST", "/api/power-pings", {
        ...data,
        questions: data.questions,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/power-pings"] });
      setSent(true);
      setTimeout(() => { setSent(false); setShowForm(false); form.reset(); }, 3000);
    },
  });

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <p className="system-label mb-4">Stage 06</p>
        <h1 className="font-mono font-black text-4xl text-[hsl(var(--foreground))] mb-3 leading-tight">
          Power Ping Tracker
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] max-w-xl mb-10 leading-relaxed">
          Send evidence-based requests to decision-makers and track whether they respond. Every Power Ping is logged here so nothing gets lost.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 border border-[hsl(var(--border))] mb-8">
          {[
            { label: "Total Sent", value: pings.length },
            { label: "Responded", value: pings.filter(p => ["responded", "action_promised"].includes(p.status)).length },
            { label: "Awaiting", value: pings.filter(p => p.status === "sent").length },
          ].map(({ label, value }, i) => (
            <div key={label} className={cn("py-5 px-6 text-center", i < 2 && "border-r border-[hsl(var(--border))]")}>
              <div className="font-mono font-black text-3xl text-[hsl(var(--primary))]">{value}</div>
              <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Add button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-black text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] mb-8"
          >
            <Plus className="h-3 w-3 mr-2" /> Log a Power Ping
          </Button>
        )}

        {/* Form */}
        {showForm && !sent && (
          <div className="border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--card))] rounded-sm p-6 mb-8 slide-down">
            <p className="font-mono font-black text-sm text-[hsl(var(--foreground))] mb-6">New Power Ping</p>
            <form onSubmit={form.handleSubmit(data => mutation.mutate(data))} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Project Title" error={form.formState.errors.projectTitle?.message}>
                  <input {...form.register("projectTitle")} placeholder="Your Media Patch title" className="input-terminal" />
                </Field>
                <Field label="Recipient Name" error={form.formState.errors.recipientName?.message}>
                  <input {...form.register("recipientName")} placeholder="e.g. Superintendent Jane Smith" className="input-terminal" />
                </Field>
                <Field label="Organization" error={form.formState.errors.recipientOrg?.message}>
                  <input {...form.register("recipientOrg")} placeholder="e.g. Southside School District" className="input-terminal" />
                </Field>
                <Field label="Their Role" error={form.formState.errors.recipientRole?.message}>
                  <input {...form.register("recipientRole")} placeholder="e.g. Superintendent of Transportation" className="input-terminal" />
                </Field>
                <Field label="Link to Media Patch (optional)">
                  <input {...form.register("patchUrl")} placeholder="https://..." className="input-terminal" />
                </Field>
                <Field label="Response Deadline (optional)">
                  <input {...form.register("responseDeadline")} type="date" className="input-terminal" />
                </Field>
              </div>
              <Field label="Your Questions — Three specific questions they must answer" error={form.formState.errors.questions?.message}>
                <textarea
                  {...form.register("questions")}
                  rows={4}
                  placeholder="1. Why were families not notified before route changes took effect?&#10;2. What is the plan to provide multilingual communications?&#10;3. Who is accountable for the 200+ students who arrived late?"
                  className="input-terminal resize-y"
                />
              </Field>
              <div className="flex gap-3">
                <Button type="submit" disabled={mutation.isPending} className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                  {mutation.isPending ? "Sending…" : "Send Power Ping"} <Send className="ml-2 h-3 w-3" />
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-none border border-[hsl(var(--border))] font-mono text-xs">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {sent && (
          <div className="border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)] rounded-sm p-5 mb-8 flex items-center gap-3 slide-down">
            <CheckCircle className="h-4 w-4 text-[hsl(var(--primary))]" />
            <p className="font-mono text-sm text-[hsl(var(--foreground))]">Power Ping logged. You'll be notified when they respond.</p>
          </div>
        )}

        {/* Ping list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => <div key={i} className="h-20 bg-[hsl(var(--card))] border border-[hsl(var(--border))] animate-pulse rounded-sm" />)}
          </div>
        ) : pings.length === 0 ? (
          <div className="border border-dashed border-[hsl(var(--border))] p-12 text-center rounded-sm">
            <Send className="h-8 w-8 text-[hsl(var(--muted-foreground)/0.3)] mx-auto mb-3" />
            <p className="font-mono text-sm text-[hsl(var(--muted-foreground))] mb-1">No Power Pings yet.</p>
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)]">Log your first outreach to a decision-maker above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pings.map((ping: any) => {
              const cfg = STATUS_CONFIG[ping.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.sent;
              const Icon = cfg.Icon;
              return (
                <div key={ping.id} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono font-black text-sm text-[hsl(var(--foreground))] mb-0.5">{ping.projectTitle}</p>
                      <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
                        → {ping.recipientName}, {ping.recipientRole} · {ping.recipientOrg}
                      </p>
                    </div>
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-wide shrink-0", cfg.cls)}>
                      <Icon className="h-2.5 w-2.5" /> {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground)/0.7)] block mb-1.5">{label}</label>
      {children}
      {error && <p className="font-mono text-xs text-[hsl(var(--destructive))] mt-1">{error}</p>}
    </div>
  );
}
