import { useCallback } from 'react';
import { getKeycloakInstance } from '@/keycloak';
import {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  hasClaim,
  getClaim,
} from '@/utils/auth';

export const useAuth = () => {
  const keycloak = getKeycloakInstance();

  const checkRole = useCallback((role: string) => {
    return hasRole(role);
  }, []);

  const checkAnyRole = useCallback((roles: string[]) => {
    return hasAnyRole(roles);
  }, []);

  const checkAllRoles = useCallback((roles: string[]) => {
    return hasAllRoles(roles);
  }, []);

  const checkClaim = useCallback((claim: string) => {
    return hasClaim(claim);
  }, []);

  const getClaimValue = useCallback((claim: string) => {
    return getClaim(claim);
  }, []);

  const logout = useCallback(() => {
    keycloak.logout();
  }, [keycloak]);

  return {
    isAuthenticated: keycloak.authenticated,
    checkRole,
    checkAnyRole,
    checkAllRoles,
    checkClaim,
    getClaimValue,
    logout,
  };
};
