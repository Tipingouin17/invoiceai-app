import { Route, Switch } from "wouter";
import { ThemeProvider } from "shadcn/ui";
import { Toaster } from "shadcn/ui/toaster";
import { TooltipProvider } from "shadcn/ui/tooltip";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FeaturePage from "./pages/FeaturePage";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/feature" component={FeaturePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;