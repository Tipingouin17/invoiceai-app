import { Route, Switch } from "wouter";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FeaturePage from "./pages/FeaturePage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/_core/auth";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

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

function NotFound() {
  return <div>404 - Page Not Found</div>;
}

export default App;