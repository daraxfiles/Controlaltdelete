import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser, Show } from "@clerk/react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare, ThumbsUp, ArrowRight, Filter, ChevronRight, Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

const CARDINAL = "#9e1b32";

const STATUS_META: Record<string, { label: string; color: string }> = {
  submitted:               { label: "Submitted",              color: "#6b7280" },
  under_review:            { label: "Under Review",           color: "#f59e0b" },
  open_for_investigation:  { label: "Open for Investigation", color: "#3b82f6" },
  investigation_started:   { label: "Under Investigation",    color: "#8b5cf6" },
  patch_published:         { label: "Patch Published",        color: "hsl(145 85% 48%)" },
  closed:                  { label: "Closed",                 color: "#6b7280" },
};

const STATUS_FILTERS = [
  { id: "all",                    label: "All" },
  { id: "open_for_investigation", label: "Open for Investigation" },
  { id: "under_review",           label: "Under Review" },
  { id: "investigation_started",  label: "Under Investigation" },
  { id: "patch_published",        label: "Patch Published" },
];

export default function UArkQuestions() {
  const { user } = useUser();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");

  const { data: questions = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/community-questions/uark"],
    staleTime: 30_000,
  });

  const { data: myUpvotes = [] } = useQuery<string[]>({
    queryKey: ["/api/community-questions/uark/my-upvotes"],
    enabled: !!user,
    staleTime: 30_000,
  });

  const submitMutation = useMutation({
    mutationFn: (data: { question: string; context?: string }) =>
      apiRequest("POST", "/api/community-questions/uark", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/community-questions/uark"] });
      setQuestion("");
      setContext("");
      setShowForm(false);
      toast({ title: "Question submitted", description: "It will be reviewed before appearing publicly." });
    },
    onError: () => toast({ title: "Submission failed", variant: "destructive" }),
  });

  const upvoteMutation = useMutation({
    mutationFn: (questionId: string) =>
      apiRequest("POST", `/api/community-questions/${questionId}/upvote`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/community-questions/uark"] });
      qc.invalidateQueries({ queryKey: ["/api/community-questions/uark/my-upvotes"] });
    },
    onError: () => toast({ title: "Could not upvote", variant: "destructive" }),
  });

  const displayed = questions
    .filter(q => filter === "all" || q.status === filter)
    .filter(q =>
      !search ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      (q.context && q.context.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] pt-24 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <Link href="/community/uark">
            <button className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] hover:text-[hsl(var(--primary))] flex items-center gap-1 mb-4 transition-colors">
              ← UArk Hub
            </button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8" style={{ background: CARDINAL }} />
            <span
              className="font-mono text-[11px] tracking-widest uppercase"
              style={{ color: CARDINAL }}
            >
              The Razorback Question
            </span>
          </div>
          <h1 className="font-mono font-black text-3xl md:text-4xl leading-tight mb-3">
            What should Razorbacks investigate?
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-2xl leading-relaxed">
            Submit questions about campus information problems. Approved questions become open
            investigations. Track whether an investigation has started and whether a Media Patch
            has been published.
          </p>
        </div>

        {/* Submit form */}
        <Show when="signed-in">
          {!showForm ? (
            <Button
              className="mb-8 rounded-none font-mono text-xs tracking-widest uppercase"
              style={{ background: CARDINAL, color: "#fff" }}
              onClick={() => setShowForm(true)}
            >
              Submit a Question
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          ) : (
            <div className="border border-[hsl(var(--border))] p-6 mb-8">
              <p className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground)/0.5)] mb-4">
                New Razorback Question
              </p>
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-1.5">
                    Your question <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] font-mono p-3 resize-none focus:outline-none focus:border-[hsl(var(--primary))] rounded-none"
                    rows={3}
                    maxLength={300}
                    placeholder="E.g. Why is it so hard to find information about the housing waitlist?"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                  />
                  <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)] mt-0.5">
                    {question.length}/300 characters
                  </p>
                </div>
                <div>
                  <label className="font-mono text-xs tracking-widest uppercase text-[hsl(var(--muted-foreground))] block mb-1.5">
                    Context <span className="text-[hsl(var(--muted-foreground)/0.4)]">(optional)</span>
                  </label>
                  <textarea
                    className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] font-mono p-3 resize-none focus:outline-none focus:border-[hsl(var(--primary))] rounded-none"
                    rows={2}
                    maxLength={500}
                    placeholder="Why does this matter? What have you noticed?"
                    value={context}
                    onChange={e => setContext(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="rounded-none font-mono text-xs tracking-widest uppercase"
                    style={{ background: CARDINAL, color: "#fff" }}
                    disabled={!question.trim() || submitMutation.isPending}
                    onClick={() => submitMutation.mutate({ question: question.trim(), context: context.trim() || undefined })}
                  >
                    {submitMutation.isPending ? "Submitting…" : "Submit for Review"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-none font-mono text-xs"
                    onClick={() => { setShowForm(false); setQuestion(""); setContext(""); }}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground)/0.5)]">
                  Questions are reviewed before appearing publicly. Do not submit questions that
                  target individuals, include private information, or are defamatory.
                </p>
              </div>
            </div>
          )}
        </Show>

        <Show when="signed-out">
          <div className="border border-dashed border-[hsl(var(--border))] p-6 mb-8 text-center">
            <p className="font-mono text-sm mb-3">Sign in to submit a Razorback Question.</p>
            <Link href="/sign-in">
              <Button size="sm" className="rounded-none font-mono text-xs tracking-widest uppercase" style={{ background: CARDINAL, color: "#fff" }}>
                Sign In
              </Button>
            </Link>
          </div>
        </Show>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[hsl(var(--muted-foreground)/0.4)]" />
            <input
              type="text"
              placeholder="Search questions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm font-mono focus:outline-none focus:border-[hsl(var(--primary))] rounded-none"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-2.5 py-1.5 font-mono text-xs rounded-none border transition-colors",
                  filter === f.id
                    ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]"
                    : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground)/0.3)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="border border-[hsl(var(--border))] p-5 animate-pulse">
                <div className="h-4 bg-[hsl(var(--border))] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[hsl(var(--border))] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="border border-dashed border-[hsl(var(--border))] p-12 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-3 text-[hsl(var(--muted-foreground)/0.3)]" />
            <p className="font-mono text-sm text-[hsl(var(--muted-foreground))] mb-1">
              {questions.length === 0
                ? "No Razorback Questions yet."
                : "No questions match your filter."}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground)/0.5)]">
              {questions.length === 0
                ? "Every investigation starts with a question. What information problem have you noticed?"
                : "Try a different status filter or clear your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((q: any) => {
              const alreadyVoted = myUpvotes.includes(q.id);
              const meta = STATUS_META[q.status] ?? { label: q.status, color: "#6b7280" };
              return (
                <div
                  key={q.id}
                  className="border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.2)] transition-colors p-5"
                >
                  <div className="flex items-start gap-4">
                    {/* Upvote */}
                    <button
                      aria-label="Upvote question"
                      disabled={!user || upvoteMutation.isPending}
                      onClick={() => user && !alreadyVoted && upvoteMutation.mutate(q.id)}
                      className={cn(
                        "flex flex-col items-center gap-0.5 pt-0.5 shrink-0 transition-colors",
                        alreadyVoted
                          ? "text-[hsl(var(--primary))]"
                          : "text-[hsl(var(--muted-foreground)/0.4)] hover:text-[hsl(var(--muted-foreground))]",
                        !user && "cursor-default"
                      )}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-mono text-[10px]">{q.upvotes}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm leading-relaxed mb-1">{q.question}</p>
                      {q.context && (
                        <p className="text-xs text-[hsl(var(--muted-foreground)/0.6)] leading-relaxed mb-2">
                          {q.context}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="font-mono text-[10px] px-2 py-0.5"
                          style={{ background: `${meta.color}20`, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground)/0.4)]">
                          {new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        {q.linkedPatchId && (
                          <Link href="/media-patches">
                            <span className="font-mono text-[10px] underline text-[hsl(var(--primary))] cursor-pointer">
                              View Patch →
                            </span>
                          </Link>
                        )}
                        {(q.status === "open_for_investigation" || q.status === "submitted") && (
                          <Link href="/create">
                            <span className="font-mono text-[10px] underline cursor-pointer" style={{ color: CARDINAL }}>
                              Investigate This →
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
