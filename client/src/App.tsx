import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import Appointments from "@/pages/appointments";
import FinancialManagement from "@/pages/financial";
import Settings from "@/pages/settings";
import AuthPage from "@/pages/auth";
import RegisterPage from "@/pages/auth/register";
import FindIdPage from "@/pages/auth/find-id";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return <Component />;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/auth">
        {user ? <Redirect to="/" /> : <AuthPage />}
      </Route>
      <Route path="/register">
        {user ? <Redirect to="/" /> : <RegisterPage />}
      </Route>
      <Route path="/find-id">
        {user ? <Redirect to="/" /> : <FindIdPage />}
      </Route>
      <Route path="/forgot-password">
        {user ? <Redirect to="/" /> : <ForgotPasswordPage />}
      </Route>
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} />
      </Route>
      <Route path="/appointments">
        <ProtectedRoute component={Appointments} />
      </Route>
      <Route path="/finance">
        <ProtectedRoute component={FinancialManagement} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}