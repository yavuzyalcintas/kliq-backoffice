import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { getKeycloakInstance } from './keycloak';
import { Loader2 } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LeftMenu } from './components/LeftMenu';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { routes } from '@/routes';
import './App.css';

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
  const { setAuthenticated } = useAuthStore();

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'login-required',
          pkceMethod: 'S256',
          checkLoginIframe: false,
        });
        setAuthenticated(authenticated);
        setIsInitialized(true);

        // Set up token refresh
        setInterval(() => {
          keycloak.updateToken(70).catch(error => {
            console.error('Failed to refresh token:', error);
            setAuthenticated(false);
          });
        }, 60000); // Check every minute
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        setAuthenticated(false);
        setIsInitialized(true);
      }
    };

    initKeycloak();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!keycloak.authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <LeftMenu />
          <main className="flex-1 p-6">
            <Routes>
              {routes.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
