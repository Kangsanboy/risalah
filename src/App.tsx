import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";

// Page Imports
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Sekretaris from "@/pages/Sekretaris";
import Bendahara from "@/pages/Bendahara";
import Keamanan from "@/pages/Keamanan";
import Kebersihan from "@/pages/Kebersihan";
import Peralatan from "@/pages/Peralatan";
import Reports from "@/pages/Reports";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

/**
 * ProtectedRoute handles authentication checks and wraps the content in the main Layout.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  return <Layout>{children}</Layout>;
};

/**
 * Root application component for RISALAH Pesantren Management System.
 * Manages routing, authentication state, and global UI providers.
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />

            {/* Protected Management Routes */}
            <Route
              path={ROUTE_PATHS.HOME}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTE_PATHS.SEKRETARIS}
              element={
                <ProtectedRoute>
                  <Sekretaris />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTE_PATHS.BENDAHARA}
              element={
                <ProtectedRoute>
                  <Bendahara />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTE_PATHS.KEAMANAN}
              element={
                <ProtectedRoute>
                  <Keamanan />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTE_PATHS.KEBERSIHAN}
              element={
                <ProtectedRoute>
                  <Kebersihan />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTE_PATHS.PERALATAN}
              element={
                <ProtectedRoute>
                  <Peralatan />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTE_PATHS.REPORTS}
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to={ROUTE_PATHS.HOME} replace />} />
          </Routes>
        </BrowserRouter>

        {/* Feedback Components */}
        <Toaster />
        <Sonner position="top-right" expand={false} richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
