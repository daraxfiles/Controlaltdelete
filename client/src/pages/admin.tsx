import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, CheckCircle, Clock, AlertTriangle, Users, FileCheck, Send, Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MediaPatch } from "@shared/schema";
import { useState } from "react";

function EmbedSnippet({ patchId }: { patchId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const snippet = `<div data-ctrl-patch="${patchId}"></div>\n<script src="${origin}/widget.js" async><\/script>`;

  function copy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mt-3">
      <Button
        size="sm"
        variant="ghost"
        className="rounded-none border border-[hsl(var(--border))] font-mono text-[10px] tracking-widest uppercase h-7 px-3 gap-1.5"
        onClick={() => setOpen(o => !o)}
      >
        <Code className="h-3 w-3" /> {open ? "Hide Embed" : "Embed"}
      </Button>

      {open && (
        <div className="mt-2 border border-[hsl(var(--border))] bg-[hsl(var(--background))] rounded-sm p-3">
          <p className="font-mono text-[9px] text-[hsl(var(--muted-foreground)/0.5)] mb-2 tracking-widest uppercase">Paste on any partner site</p>
          <pre className="font-mono text-[10px] text-[hsl(var(--primary)/0.9)] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-sm p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
            {snippet}
          </pre>
          <Button
            size="sm"
            className="mt-2 rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] h-7 px-3 gap-1.5"
            onClick={copy}
          >
            {copied ? <><Check className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy Snippet</>}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useUser();

  const { data: patches = [], isLoading } = useQuery<MediaPatch[]>({
    queryKey: ["/api/media-patches"],
  });

  const { data: pings = [] } = useQuery<any[]>({
    queryKey: ["/api/power-pings"],
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/admin/patches/${id}`, { verificationStatus: status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/media-patches"] }),
  });

  const pingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/admin/power-pings/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/power-pings"] }),
  });

  return (
    <main className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-5 w-5 text-[hsl(var(--primary))]" />
          <p className="system-label mb-0">Facilitator Panel</p>
        </div>
        <h1 className="font-mono font-black text-4xl text-[hsl(var(--foreground))] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-10 font-mono text-sm">
          Logged in as: <span className="text-[hsl(var(--foreground))]">{user?.primaryEmailAddress?.emailAddress}</span>
        </p>

        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-[hsl(var(--border))] mb-10">
          {[
            { label: "Total Patches", value: patches.length, Icon: FileCheck },
            { label: "Pending Review", value: patches.filter(p => p.verificationStatus === "pending").length, Icon: Clock },
            { label: "Verified", value: patches.filter(p => p.verificationStatus === "verified").length, Icon: CheckCircle },
            { label: "Power Pings", value: pings.length, Icon: Send },
          ].map(({ label, value, Icon }, i) => (
            <div key={label} className={cn("py-5 px-4 flex items-center gap-3", i < 3 && "border-r border-[hsl(var(--border))]")}>
              <Icon className="h-4 w-4 text-[hsl(var(--primary)/0.5)] shrink-0" />
              <div>
                <div className="font-mono font-black text-2xl text-[hsl(var(--primary))]">{value}</div>
                <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tracking-widests uppercase">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Patches review queue */}
        <section className="mb-10">
          <h2 className="font-mono font-black text-lg text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-[hsl(var(--primary)/0.6)]" />
            Media Patches Review Queue
          </h2>

          {isLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-[hsl(var(--card))] border border-[hsl(var(--border))] animate-pulse rounded-sm" />)}
            </div>
          ) : patches.length === 0 ? (
            <div className="border border-dashed border-[hsl(var(--border))] p-8 text-center rounded-sm">
              <p className="font-mono text-sm text-[hsl(var(--muted-foreground))]">No patches submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {patches.map(patch => (
                <div key={patch.id} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-mono font-black text-sm text-[hsl(var(--foreground))]">{patch.title}</p>
                      <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{patch.crewName} · {patch.community}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        "px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide rounded-sm",
                        patch.verificationStatus === "verified" ? "badge-verified"
                        : patch.verificationStatus === "pending" ? "badge-pending"
                        : "badge-error"
                      )}>
                        {patch.verificationStatus}
                      </span>
                      {patch.verificationStatus === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] h-7 px-3"
                            onClick={() => approveMutation.mutate({ id: patch.id, status: "verified" })}
                            disabled={approveMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-none border border-[hsl(var(--border))] font-mono text-[10px] tracking-widests uppercase h-7 px-3"
                            onClick={() => approveMutation.mutate({ id: patch.id, status: "disputed" })}
                            disabled={approveMutation.isPending}
                          >
                            Flag
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {patch.verificationStatus === "verified" && <EmbedSnippet patchId={patch.id} />}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Power Pings */}
        <section>
          <h2 className="font-mono font-black text-lg text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
            <Send className="h-4 w-4 text-[hsl(var(--primary)/0.6)]" />
            Power Ping Responses
          </h2>
          {pings.length === 0 ? (
            <div className="border border-dashed border-[hsl(var(--border))] p-8 text-center rounded-sm">
              <p className="font-mono text-sm text-[hsl(var(--muted-foreground))]">No power pings yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pings.map((ping: any) => (
                <div key={ping.id} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-sm p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-mono font-black text-sm text-[hsl(var(--foreground))]">{ping.projectTitle}</p>
                      <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">→ {ping.recipientName} · {ping.recipientOrg}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide rounded-sm",
                        ping.status === "responded" || ping.status === "action_promised" ? "badge-verified" : "badge-pending"
                      )}>
                        {ping.status.replace(/_/g, " ")}
                      </span>
                      {ping.status === "sent" && (
                        <>
                          <Button size="sm" className="rounded-none bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-[hsl(var(--primary)/0.85)] h-7 px-3"
                            onClick={() => pingMutation.mutate({ id: ping.id, status: "responded" })}>
                            Mark Responded
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-none border border-[hsl(var(--border))] font-mono text-[10px] tracking-widests uppercase h-7 px-3"
                            onClick={() => pingMutation.mutate({ id: ping.id, status: "no_response" })}>
                            No Response
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
