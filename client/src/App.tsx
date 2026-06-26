import { Route, Switch } from "wouter";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip-provider";
import ErrorBoundary from "@/components/ui/error-boundary";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FeaturePage from "./pages/FeaturePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <ErrorBoundary>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/feature" component={FeaturePage} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;