import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/missions" component={Missions} />
      <Route path="/reboot-protocol" component={RebootProtocol} />
      <Route path="/reboot-crews" component={RebootCrews} />
      <Route path="/media-patches" component={MediaPatches} />
      <Route path="/reboot-room" component={RebootRoom} />
      <Route path="/resources" component={Resources} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create" component={Create} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <Router />
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
