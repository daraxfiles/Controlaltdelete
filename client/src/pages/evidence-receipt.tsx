import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileCheck, ArrowRight, Shield, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  projectTitle: z.string().min(1, "Required"),
  mainClaims: z.string().min(10, "Describe the main claims your patch makes"),
  sources: z.string().min(10, "List your sources — one per line"),
  interviews: z.string().optional(),
  documents: z.string().optional(),
  verificationSteps: z.string().min(10, "Describe how you verified each claim"),
  uncertainties: z.string().optional(),
  conflictsOfInterest: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  { key: "projectTitle", label: "Project Title", step: 1 },
  { key: "mainClaims", label: "Main Claims", step: 2 },
  { key: "sources", label: "Sources", step: 3 },
  { key: "verificationSteps", label: "Verification", step: 4 },
];

export default function EvidenceReceipt() {
  const [submitted, setSubmitted] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPublic: true },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/evidence-receipts", data),
    onSuccess: async (res) => {
      const json = await res.json();
      setReceiptId(json.id);
      setSubmitted(true);
    },
  });

  const copy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/evidence-receipt/${receiptId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <main className="pt-24 min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-xl w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.3)] flex items-center justify-center mx-auto mb-6">
            <Shield className="h-6 w-6 text-[hsl(var(--primary))]" />
          </div>
          <p className="system-label mb-3 justify-center flex">Receipt Filed</p>
          <h1 className="font-mono font-black text-3xl text-[hsl(var(--foreground))] mb-4">
            Evidence Receipt Created
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
            Your public Evidence Receipt has been filed. Attach the link to your Media Patch so readers can verify every claim.
          </p>
          {receiptId && (
            <div className="terminal-box mb-6">
              <div className="terminal-header">
                <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widest">RECEIPT ID</span>
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-[hsl(var(--primary))] truncate">
                  {window.location.origin}/evidence-receipt/{receiptId}
                </span>
                <button onClick={copy} className="shrink-0 flex items-center gap-1.5 font-mono text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                  <Copy className="h-3 w-3" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
          <p className="font-mono text-xs text-[hsl(var(--primary)/0.7)] tracking-widest">
            NO RECEIPT. NO REBOOT.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-6 py-12">
        <p className="system-label mb-4">Documentation Tool</p>
        <h1 className="font-mono font-black text-4xl text-[hsl(var(--foreground))] mb-3 leading-tight">
          Evidence Receipt Builder
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-3 leading-relaxed max-w-xl">
          Every published Media Patch requires a public Evidence Receipt — a transparent record of every claim, source, and verification step. Fill it out before you publish.
        </p>
        <p className="font-mono text-xs text-[hsl(var(--primary)/0.7)] tracking-widest mb-10">
          NO RECEIPT. NO REBOOT.
        </p>

        <form onSubmit={form.handleSubmit(data => mutation.mutate(data))} className="space-y-8">
          {/* Project Title */}
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6 card-accent-primary">
            <label className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.7)] block mb-3">
              01 — Project Title
            </label>
            <input
              {...form.register("projectTitle")}
              placeholder="e.g. The Bus Route Blackout"
              className="w-full px-4 py-3 bg-[hsl(0_0%_8%)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono text-sm placeholder:text-[hsl(var(--muted-foreground)/0.3)] focus:outline-none focus:border-[hsl(var(--primary)/0.5)] transition-colors rounded-sm"
            />
            {form.formState.errors.projectTitle && (
              <p className="font-mono text-xs text-[hsl(var(--destructive))] mt-2">{form.formState.errors.projectTitle.message}</p>
            )}
          </div>

          {/* Main Claims */}
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6">
            <label className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground)/0.7)] block mb-1">
              02 — Main Claims
            </label>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] mb-3">What specific claims does your Media Patch make? List each one.</p>
            <textarea
              {...form.register("mainClaims")}
              rows={5}
              placeholder="Claim 1: The district changed bus routes in October without notifying families.&#10;Claim 2: Over 200 students were affected.&#10;Claim 3: No translation was provided for non-English-speaking families."
              className="w-full px-4 py-3 bg-[hsl(0_0%_8%)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono text-sm placeholder:text-[hsl(var(--muted-foreground)/0.3)] focus:outline-none focus:border-[hsl(var(--primary)/0.5)] transition-colors rounded-sm resize-y"
            />
            {form.formState.errors.mainClaims && (
              <p className="font-mono text-xs text-[hsl(var(--destructive))] mt-2">{form.formState.errors.mainClaims.message}</p>
            )}
          </div>

          {/* Sources */}
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6">
            <label className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.7)] block mb-1">
              03 — Sources
            </label>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] mb-3">List every source you used — articles, websites, public documents. One per line.</p>
            <textarea
              {...form.register("sources")}
              rows={5}
              placeholder="- District transportation memo, Oct 14 (obtained via public records request)&#10;- Interview with Rosa M., parent (Oct 20)&#10;- School board meeting minutes, Nov 2&#10;- Local news article: 'District Updates Routes' (Oct 16)"
              className="w-full px-4 py-3 bg-[hsl(0_0%_8%)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono text-sm placeholder:text-[hsl(var(--muted-foreground)/0.3)] focus:outline-none focus:border-[hsl(var(--primary)/0.5)] transition-colors rounded-sm resize-y"
            />
            {form.formState.errors.sources && (
              <p className="font-mono text-xs text-[hsl(var(--destructive))] mt-2">{form.formState.errors.sources.message}</p>
            )}
          </div>

          {/* Interviews (optional) */}
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6">
            <label className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.7)] block mb-1">
              04 — Interviews <span className="text-[hsl(var(--muted-foreground)/0.4)] normal-case font-normal">(optional)</span>
            </label>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] mb-3">Who did you interview? Note consent status. Do not include personal details of minors.</p>
            <textarea
              {...form.register("interviews")}
              rows={3}
              placeholder="- Parent (anonymous, consented) — Oct 20&#10;- District communications officer — no response to interview request&#10;- Youth journalist team member (internal)"
              className="w-full px-4 py-3 bg-[hsl(0_0%_8%)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono text-sm placeholder:text-[hsl(var(--muted-foreground)/0.3)] focus:outline-none focus:border-[hsl(var(--primary)/0.5)] transition-colors rounded-sm resize-y"
            />
          </div>

          {/* Verification Steps */}
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6 card-accent-primary">
            <label className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground)/0.7)] block mb-1">
              05 — Verification Steps <span className="text-[hsl(var(--destructive))]">*</span>
            </label>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] mb-3">How did you verify each claim? At least two independent sources per major claim.</p>
            <textarea
              {...form.register("verificationSteps")}
              rows={5}
              placeholder="- Claim 1 verified by: district memo + two parent interviews + board meeting minutes&#10;- Claim 2 verified by: district enrollment data (FOIA request) cross-checked with parent accounts&#10;- Claim 3 verified by: review of all district communications sent during October"
              className="w-full px-4 py-3 bg-[hsl(0_0%_8%)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono text-sm placeholder:text-[hsl(var(--muted-foreground)/0.3)] focus:outline-none focus:border-[hsl(var(--primary)/0.5)] transition-colors rounded-sm resize-y"
            />
            {form.formState.errors.verificationSteps && (
              <p className="font-mono text-xs text-[hsl(var(--destructive))] mt-2">{form.formState.errors.verificationSteps.message}</p>
            )}
          </div>

          {/* Uncertainties */}
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6">
            <label className="font-mono text-[10px] tracking-widests uppercase text-[hsl(var(--muted-foreground)/0.7)] block mb-1">
              06 — What Remains Uncertain <span className="text-[hsl(var(--muted-foreground)/0.4)] normal-case font-normal">(optional but recommended)</span>
            </label>
            <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] mb-3">Transparency about uncertainty makes your patch stronger, not weaker.</p>
            <textarea
              {...form.register("uncertainties")}
              rows={3}
              placeholder="We could not confirm the total number of students affected — our estimate is based on partial data. The district did not respond to our interview request."
              className="w-full px-4 py-3 bg-[hsl(0_0%_8%)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono text-sm placeholder:text-[hsl(var(--muted-foreground)/0.3)] focus:outline-none focus:border-[hsl(var(--primary)/0.5)] transition-colors rounded-sm resize-y"
            />
          </div>

          {/* Public toggle */}
          <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-sm font-bold text-[hsl(var(--foreground))] mb-0.5">Make this receipt public</p>
              <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.6)]">Public receipts are linked from your published Media Patch and visible to all readers.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" {...form.register("isPublic")} className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-[hsl(var(--border))] peer-checked:bg-[hsl(var(--primary))] rounded-full transition-colors peer-focus:outline-none" />
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5" />
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-black text-sm tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] py-6"
          >
            {mutation.isPending ? "Filing Receipt…" : "File Evidence Receipt"}
            <FileCheck className="ml-2 h-4 w-4" />
          </Button>

          {mutation.isError && (
            <p className="font-mono text-xs text-[hsl(var(--destructive))] text-center">
              Failed to file receipt. Please try again.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
