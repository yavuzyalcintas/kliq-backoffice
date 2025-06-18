import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/theme-selector';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getKeycloakInstance } from '@/keycloak';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const keycloak = getKeycloakInstance();
  const { userInfo } = useAuthStore();
  const { data: profile, isLoading, error } = useUserProfile();
  const { t } = useTranslation();

  return (
    <header className="border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-20 items-center justify-between px-6">
        <img src="/logo.png" alt="Kliq" className="h-16 w-auto" />
        <div className="flex items-center gap-4">
          <ThemeSelector />
          <LanguageSwitcher />
          {isLoading ? (
            <Skeleton className="h-4 w-[200px] bg-primary/10" />
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{t('errors.loadingUserInfo')}</AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-primary/80">
                {t('common.welcome')},{' '}
                {profile?.name || userInfo?.name || t('common.user')}
              </span>
              <Button
                variant="outline"
                onClick={() => keycloak.logout()}
                className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {t('common.logout')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
