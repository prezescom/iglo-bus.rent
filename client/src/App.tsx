import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookiesBanner from "@/components/cookies-banner";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PrivacyPolicy from "@/pages/privacy-policy";
import WynajemMrozni from "@/pages/wynajem-mrozni";
import WynajemChlodni from "@/pages/wynajem-chlodni";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/polityka-prywatnosci" component={PrivacyPolicy} />
      <Route path="/wynajem-mrozni" component={WynajemMrozni} />
      <Route path="/wynajem-chlodni" component={WynajemChlodni} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookiesBanner />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;