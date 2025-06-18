import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getKeycloakInstance } from '@/keycloak';
import { hasAnyRole, hasAllRoles } from '@/utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requireAllRoles?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRoles,
  requireAllRoles = false,
  fallbackPath = '/',
}: ProtectedRouteProps) => {
  const keycloak = getKeycloakInstance();

  if (!keycloak.authenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredRoles) {
    const hasRequiredRoles = requireAllRoles
      ? hasAllRoles(requiredRoles)
      : hasAnyRole(requiredRoles);

    if (!hasRequiredRoles) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return <>{children}</>;
};
