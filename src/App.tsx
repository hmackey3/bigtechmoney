import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css";

import MainLayout from "./components/layouts/main-layout";
import Dashboard from "./pages/Dashboard";

import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import BillingPage from "./pages/BillingPage";
import AuthPage from "./pages/AuthPage";
import SupportPage from "./pages/SupportPage";
import PrivateRoute from "./components/auth/PrivateRoute";
import LandingPage from "./pages/LandingPage";
import SubscriptionManager from "./pages/SubscriptionPage";
import SubscriptionSuccess from "./components/subscrption/success";
import SubscriptionCancel from "./components/subscrption/cancel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<LandingPage />} />

              {/* Main layout with protected routes */}
              <Route element={<MainLayout />}>
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute
                      element={
                        <TransitionPage>
                          <Dashboard />
                        </TransitionPage>
                      }
                    />
                  }
                />
                <Route
                  path="/account-settings"
                  element={
                    <PrivateRoute
                      element={
                        <TransitionPage>
                          <AccountSettings />
                        </TransitionPage>
                      }
                    />
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <PrivateRoute
                      element={
                        <TransitionPage>
                          <SubscriptionManager />
                        </TransitionPage>
                      }
                    />
                  }
                />
                <Route
                  path="/subscription/success"
                  element={
                    <PrivateRoute
                      element={
                        <TransitionPage>
                          <SubscriptionSuccess />
                        </TransitionPage>
                      }
                    />
                  }
                />
                <Route
                  path="/subscription/cancel"
                  element={
                    <PrivateRoute
                      element={
                        <TransitionPage>
                          <SubscriptionCancel />
                        </TransitionPage>
                      }
                    />
                  }
                />
                <Route
                  path="/account-settings/organization"
                  element={
                    <PrivateRoute
                      element={
                        <TransitionPage>
                          <AccountSettings />
                        </TransitionPage>
                      }
                    />
                  }
                />
                <Route
                  path="/billing"
                  element={
                    <PrivateRoute
                      element={
                        <TransitionPage>
                          <BillingPage />
                        </TransitionPage>
                      }
                    />
                  }
                />
                <Route
                  path="/support"
                  element={
                    <PrivateRoute
                      element={
                        <TransitionPage>
                          <SupportPage />
                        </TransitionPage>
                      }
                    />
                  }
                />
              </Route>

              {/* Not found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Wrapper for page transitions
const TransitionPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <TransitionGroup className="w-full">
      <CSSTransition
        key={window.location.pathname}
        timeout={300}
        classNames="page-transition"
      >
        <div className="w-full">{children}</div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
