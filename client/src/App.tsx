import { useEffect, useRef } from "react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Missions from "@/pages/missions";
import RebootProtocol from "@/pages/reboot-protocol";
import RebootCrews from "@/pages/reboot-crews";
import MediaPatches from "@/pages/media-patches";
import RebootRoom from "@/pages/reboot-room";
import Resources from "@/pages/resources";
import Dashboard from "@/pages/dashboard";
import Create from "@/pages/create";
import Search from "@/pages/search";
import EvidenceReceipt from "@/pages/evidence-receipt";
import PowerPing from "@/pages/power-ping";
import AdminPanel from "@/pages/admin";
import NotFound from "@/pages/not-found";

// ── Clerk config ─────────────────────────────────────────────────────────
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// REQUIRED — copy verbatim. Resolves the key from hostname for multi-domain support.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — copy verbatim. Empty in dev (intentional), auto-set in prod.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

// ── Clerk appearance — terminal dark theme ────────────────────────────────
const clerkAppearance = {
  theme: shadcn,
  // No cssLayerName — Tailwind 3 project
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "bottom" as const,
  },
  variables: {
    colorPrimary: "hsl(145, 85%, 48%)",
    colorForeground: "hsl(0, 0%, 95%)",
    colorMutedForeground: "hsl(0, 0%, 55%)",
    colorDanger: "hsl(0, 72%, 55%)",
    colorBackground: "hsl(0, 0%, 5%)",
    colorInput: "hsl(0, 0%, 10%)",
    colorInputForeground: "hsl(0, 0%, 95%)",
    colorNeutral: "hsl(0, 0%, 20%)",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    borderRadius: "2px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "w-[440px] max-w-full overflow-hidden border border-[hsl(0,0%,15%)]",
    card: "!shadow-none !border-0 !bg-[hsl(0,0%,5%)] !rounded-none",
    footer: "!shadow-none !border-0 !bg-[hsl(0,0%,5%)] !rounded-none",
    headerTitle: "text-[hsl(0,0%,95%)] font-mono font-black",
    headerSubtitle: "text-[hsl(0,0%,55%)] font-mono text-sm",
    socialButtonsBlockButtonText: "text-[hsl(0,0%,85%)] font-mono text-xs",
    socialButtonsBlockButton: "border border-[hsl(0,0%,18%)] bg-[hsl(0,0%,8%)] hover:bg-[hsl(0,0%,12%)] rounded-none",
    formFieldLabel: "text-[hsl(0,0%,75%)] font-mono text-xs tracking-widest uppercase",
    formFieldInput: "bg-[hsl(0,0%,10%)] border border-[hsl(0,0%,18%)] text-[hsl(0,0%,95%)] font-mono rounded-none focus:border-[hsl(145,85%,48%)]",
    formButtonPrimary: "bg-[hsl(145,85%,48%)] text-[hsl(0,0%,5%)] font-mono font-black tracking-widest uppercase rounded-none hover:bg-[hsl(145,85%,42%)]",
    footerActionLink: "text-[hsl(145,85%,48%)] font-mono text-xs hover:text-[hsl(145,85%,60%)]",
    footerActionText: "text-[hsl(0,0%,45%)] font-mono text-xs",
    footerAction: "bg-[hsl(0,0%,5%)]",
    dividerText: "text-[hsl(0,0%,40%)] font-mono text-xs",
    dividerLine: "bg-[hsl(0,0%,15%)]",
    identityPreviewEditButton: "text-[hsl(145,85%,48%)] font-mono text-xs",
    formFieldSuccessText: "text-[hsl(145,85%,48%)] font-mono text-xs",
    alertText: "text-[hsl(0,0%,85%)] font-mono text-xs",
    alert: "bg-[hsl(0,72%,10%)] border border-[hsl(0,72%,30%)] rounded-none",
    otpCodeFieldInput: "bg-[hsl(0,0%,10%)] border border-[hsl(0,0%,18%)] text-[hsl(0,0%,95%)] font-mono rounded-none",
    formFieldRow: "gap-2",
    logoBox: "py-4",
    logoImage: "h-10",
    main: "gap-4",
  },
};

// ── Cache invalidation on auth change ────────────────────────────────────
function ClerkCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const id = user?.id ?? null;
      if (prevId.current !== undefined && prevId.current !== id) qc.clear();
      prevId.current = id;
    });
    return unsub;
  }, [addListener, qc]);

  return null;
}

// ── Auth pages ────────────────────────────────────────────────────────────
function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="font-mono text-[10px] tracking-widest text-[hsl(var(--primary)/0.7)] uppercase mb-1">
            Access Terminal
          </p>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)]">
            Sign in to your Reboot Crew account
          </p>
        </div>
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
          appearance={clerkAppearance}
        />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="font-mono text-[10px] tracking-widest text-[hsl(var(--primary)/0.7)] uppercase mb-1">
            Join the Platform
          </p>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground)/0.5)]">
            Create your account and start your first Reboot
          </p>
        </div>
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
          appearance={clerkAppearance}
        />
      </div>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────
function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/missions" component={Missions} />
        <Route path="/reboot-protocol" component={RebootProtocol} />
        <Route path="/reboot-crews" component={RebootCrews} />
        <Route path="/media-patches" component={MediaPatches} />
        <Route path="/reboot-room" component={RebootRoom} />
        <Route path="/resources" component={Resources} />
        <Route path="/search" component={Search} />
        {/* Auth-gated pages */}
        <Route path="/dashboard">
          {() => (
            <>
              <Show when="signed-in"><Dashboard /></Show>
              <Show when="signed-out"><Redirect to="/sign-in" /></Show>
            </>
          )}
        </Route>
        <Route path="/create">
          {() => (
            <>
              <Show when="signed-in"><Create /></Show>
              <Show when="signed-out"><Redirect to="/sign-in" /></Show>
            </>
          )}
        </Route>
        <Route path="/evidence-receipt">
          {() => (
            <>
              <Show when="signed-in"><EvidenceReceipt /></Show>
              <Show when="signed-out"><Redirect to="/sign-in" /></Show>
            </>
          )}
        </Route>
        <Route path="/power-ping">
          {() => (
            <>
              <Show when="signed-in"><PowerPing /></Show>
              <Show when="signed-out"><Redirect to="/sign-in" /></Show>
            </>
          )}
        </Route>
        <Route path="/admin">
          {() => (
            <>
              <Show when="signed-in"><AdminPanel /></Show>
              <Show when="signed-out"><Redirect to="/sign-in" /></Show>
            </>
          )}
        </Route>
        {/* Clerk sign-in/sign-up — /*? is required */}
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to your Reboot Crew account" } },
        signUp: { start: { title: "Join CTRL+ALT+MEDIA", subtitle: "Create your account and start rebooting the record" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}
