import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/theme-selector";
import { getKeycloakInstance } from "@/keycloak";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const keycloak = getKeycloakInstance();
  const { userInfo } = useAuthStore();
  const { data: profile, isLoading, error } = useUserProfile();

  return (
    <header className="border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Kliq Backoffice
        </h1>
        <div className="flex items-center gap-4">
          <ThemeSelector />
          {isLoading ? (
            <Skeleton className="h-4 w-[200px] bg-primary/10" />
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>Error loading user info</AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-primary/80">
                Welcome, {profile?.name || userInfo?.name || "User"}
              </span>
              <Button
                variant="outline"
                onClick={() => keycloak.logout()}
                className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
