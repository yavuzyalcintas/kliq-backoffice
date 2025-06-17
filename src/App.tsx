import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";
import { getKeycloakInstance } from "./keycloak";
import { useUserProfile } from "./hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LeftMenu } from "./components/LeftMenu";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const keycloak = getKeycloakInstance();
  const { isAuthenticated, userInfo, setUserInfo, setAuthenticated } =
    useAuthStore();
  const { data: profile, isLoading, error } = useUserProfile();

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        console.log("Initializing Keycloak...");
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
          pkceMethod: "S256",
          checkLoginIframe: false,
        });
        console.log("Keycloak initialized:", authenticated);
        setAuthenticated(authenticated);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Keycloak:", error);
        setIsInitialized(true);
      }
    };

    initKeycloak();
  }, []);

  useEffect(() => {
    console.log("Auth state changed:", {
      isAuthenticated,
      userInfo,
      profile,
      isLoading,
      error,
      keycloakAuthenticated: keycloak.authenticated,
    });
  }, [isAuthenticated, userInfo, profile, isLoading, error]);

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");
      await keycloak.login({
        redirectUri: window.location.origin,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Welcome to Kliq Backoffice
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleLogin} size="lg">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-2xl font-bold">Kliq Backoffice</h1>
            <div className="flex items-center gap-4">
              {isLoading ? (
                <Skeleton className="h-4 w-[200px]" />
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>Error loading user info</AlertDescription>
                </Alert>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {profile?.name || userInfo?.name || "User"}
                  </span>
                  <Button variant="outline" onClick={() => keycloak.logout()}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="flex">
          <LeftMenu />
          <main className="flex-1 p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <Card>
                    <CardHeader>
                      <CardTitle>Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border p-4">
                        <pre className="text-sm">
                          {JSON.stringify({ userInfo, profile }, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
              <Route
                path="/users"
                element={
                  <Card>
                    <CardHeader>
                      <CardTitle>Users</CardTitle>
                    </CardHeader>
                    <CardContent>Users content goes here</CardContent>
                  </Card>
                }
              />
              <Route
                path="/analytics"
                element={
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>Analytics content goes here</CardContent>
                  </Card>
                }
              />
              <Route
                path="/settings"
                element={
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent>Settings content goes here</CardContent>
                  </Card>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
