import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { insertRebootProjectSchema } from "@shared/schema";
import { ArrowRight, ChevronLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

type FormData = z.infer<typeof insertRebootProjectSchema>;

const MEDIA_FORMATS = [
  { value: "article", label: "Article" },
  { value: "photo_essay", label: "Photo Essay" },
  { value: "podcast", label: "Podcast" },
  { value: "short_documentary", label: "Short Documentary" },
  { value: "social_video_series", label: "Social Video Series" },
  { value: "interactive_timeline", label: "Interactive Timeline" },
  { value: "data_story", label: "Data Story" },
  { value: "community_resource_guide", label: "Community Resource Guide" },
  { value: "myth_vs_evidence", label: "Myth vs. Evidence Explainer" },
  { value: "digital_zine", label: "Digital Zine" },
  { value: "public_information_page", label: "Public Information Page" },
  { value: "campaign_page", label: "Campaign Page" },
];

const STEPS = [
  { id: 1, label: "The Failure", desc: "Define the information gap" },
  { id: 2, label: "The Impact", desc: "Who's affected and why" },
  { id: 3, label: "The Approach", desc: "Format and audience" },
  { id: 4, label: "Safety Review", desc: "Privacy and risk check" },
];

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-xs font-bold text-[hsl(var(--foreground)/0.85)] tracking-widests uppercase">
        {label}
      </label>
      {hint && <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.7)] leading-relaxed">{hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 font-mono text-[10px] text-[hsl(var(--destructive))]">
          <AlertTriangle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}

const inputCls = "w-full bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[hsl(var(--primary)/0.5)] font-mono placeholder:text-[hsl(var(--muted-foreground)/0.4)] resize-none";

export default function Create() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(insertRebootProjectSchema),
    defaultValues: { visibility: "private", currentStage: "crash_report" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/projects", data),
    onSuccess: () => setSubmitted(true),
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  if (submitted) {
    return (
      <main className="pt-24 min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="terminal-box p-8 mb-6">
            <CheckCircle className="h-12 w-12 text-[hsl(var(--primary))] mx-auto mb-4" />
            <h1 className="font-mono font-black text-2xl text-[hsl(var(--primary))] mb-2">Project Created</h1>
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mb-1">Stage: Crash Report</p>
            <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">Your project workspace is ready.</p>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 leading-relaxed">
            Your Reboot Project has been submitted. Sign in to access your full project workspace and invite your crew.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <Button className="w-full rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)]">
                Go to Dashboard <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
            <Link href="/reboot-protocol">
              <Button variant="ghost" className="w-full rounded-none border border-[hsl(var(--border))] font-mono text-xs tracking-widests uppercase">
                Review the Reboot Protocol
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <p className="system-label mb-4">Project Creation</p>
        <h1 className="font-black font-mono text-3xl md:text-4xl text-[hsl(var(--foreground))] mb-2 leading-tight">
          Start Your Reboot
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-8 text-sm leading-relaxed">
          Define your investigation. Your answers will generate a project workspace with all seven Reboot Protocol stages.
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10 border border-[hsl(var(--border))] overflow-hidden rounded-sm">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "flex-1 py-3 px-3 text-center border-r last:border-r-0 border-[hsl(var(--border))] transition-colors",
                step === s.id
                  ? "bg-[hsl(var(--primary)/0.1)] border-b-2 border-b-[hsl(var(--primary))]"
                  : step > s.id
                    ? "bg-[hsl(var(--primary)/0.04)]"
                    : ""
              )}
            >
              <div className={cn("font-mono text-[10px] font-black mb-0.5", step === s.id ? "text-[hsl(var(--primary))]" : step > s.id ? "text-[hsl(var(--primary)/0.5)]" : "text-[hsl(var(--muted-foreground)/0.4)]")}>
                {String(s.id).padStart(2, "0")}
              </div>
              <div className={cn("font-mono text-[9px] tracking-widests uppercase hidden sm:block leading-tight", step === s.id ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--muted-foreground)/0.4)]")}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: The Failure */}
          {step === 1 && (
            <div className="space-y-6">
              <Field label="Project Title" error={errors.title?.message}>
                <input
                  {...register("title")}
                  placeholder="e.g. The Bus Route Blackout"
                  className={inputCls}
                />
              </Field>
              <Field label="Community or Location" error={errors.community?.message}>
                <input
                  {...register("community")}
                  placeholder="e.g. Southside School District, Chicago"
                  className={inputCls}
                />
              </Field>
              <Field
                label="What information failure have you identified?"
                hint="Describe the specific claim, silence, distortion, or information gap you are investigating."
                error={errors.informationFailure?.message}
              >
                <textarea {...register("informationFailure")} rows={4} placeholder="What has gone wrong in the information system?" className={inputCls} />
              </Field>
              <Field
                label="What information is currently missing?"
                hint="What does your community not know that it should?"
              >
                <textarea {...register("missingInfo")} rows={3} placeholder="What is absent from the current record?" className={inputCls} />
              </Field>
            </div>
          )}

          {/* Step 2: The Impact */}
          {step === 2 && (
            <div className="space-y-6">
              <Field label="Who is affected?" hint="Be specific. Who experiences the consequences of this information failure?">
                <textarea {...register("affectedGroup")} rows={3} placeholder="Describe the affected community or group" className={inputCls} />
              </Field>
              <Field label="Who currently controls or shapes this narrative?" hint="Who decides what information exists, how it's framed, or whose voice is heard?">
                <textarea {...register("narrativeControllers")} rows={3} placeholder="Media outlets, institutions, platforms, individuals..." className={inputCls} />
              </Field>
              <Field label="Why does this matter?" hint="What changes if this information gap is filled?">
                <textarea {...register("whyItMatters")} rows={4} placeholder="Explain the impact and importance" className={inputCls} />
              </Field>
            </div>
          )}

          {/* Step 3: The Approach */}
          {step === 3 && (
            <div className="space-y-6">
              <Field label="What media format best addresses this problem?">
                <select {...register("mediaFormat")} className={inputCls}>
                  <option value="">Select a format...</option>
                  {MEDIA_FORMATS.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Who has the power to respond?" hint="Name the person or institution that should act on your investigation.">
                <textarea {...register("powerToRespond")} rows={3} placeholder="e.g. District Transportation Director, City Council Member..." className={inputCls} />
              </Field>
              <Field label="Project Visibility">
                <select {...register("visibility")} className={inputCls}>
                  <option value="private">Private — only my crew and facilitator</option>
                  <option value="cohort">Cohort — visible to program participants</option>
                  <option value="public">Public — visible after facilitator approval</option>
                </select>
              </Field>
            </div>
          )}

          {/* Step 4: Safety */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.06)] rounded-sm p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono font-bold text-xs text-[hsl(var(--warning))] mb-2 tracking-widests uppercase">Safety Review Required</p>
                    <p className="text-xs text-[hsl(var(--foreground)/0.7)] leading-relaxed">
                      Do not confront dangerous individuals directly. All sensitive investigations require facilitator review before publication. If your project involves personal safety risk, legal concerns, or sensitive community information, flag it here.
                    </p>
                  </div>
                </div>
              </div>

              <Field
                label="Are there safety or privacy concerns?"
                hint="Optional. Describe any risks — to you, your crew, your sources, or the community — that your facilitator should know about."
              >
                <textarea {...register("safetyConcerns")} rows={4} placeholder="Describe any risks, sensitivities, or concerns..." className={inputCls} />
              </Field>

              <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 rounded-sm space-y-3">
                <p className="font-mono font-bold text-xs text-[hsl(var(--foreground)/0.7)] tracking-widests uppercase">Before you submit:</p>
                {[
                  "I will not publish personal information without consent",
                  "I understand my work requires facilitator approval before going public",
                  "I will log all AI use in the AI Use Log",
                  "I will not confront individuals I am investigating directly",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--primary)/0.6)] shrink-0 mt-0.5" />
                    <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[hsl(var(--border))]">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(s => s - 1)}
                className="rounded-none border border-[hsl(var(--border))] font-mono text-xs tracking-widests"
              >
                <ChevronLeft className="mr-1 h-3 w-3" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < STEPS.length ? (
              <Button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)]"
              >
                Continue <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono font-bold text-xs tracking-widests uppercase hover:bg-[hsl(var(--primary)/0.85)] disabled:opacity-50"
              >
                {mutation.isPending ? "Submitting..." : "Launch Project"}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>

          {mutation.isError && (
            <div className="mt-4 border border-[hsl(var(--destructive)/0.4)] bg-[hsl(var(--destructive)/0.06)] rounded-sm px-4 py-3">
              <p className="font-mono text-xs text-[hsl(var(--destructive))]">
                <AlertTriangle className="inline h-3 w-3 mr-1" />
                Failed to submit. Please check your answers and try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
