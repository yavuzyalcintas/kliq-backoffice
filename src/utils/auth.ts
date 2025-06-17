import { getKeycloakInstance } from "@/keycloak";

export const hasRole = (role: string): boolean => {
  const keycloak = getKeycloakInstance();
  return keycloak.hasResourceRole(role);
};

export const hasAnyRole = (roles: string[]): boolean => {
  return roles.some((role) => hasRole(role));
};

export const hasAllRoles = (roles: string[]): boolean => {
  return roles.every((role) => hasRole(role));
};

export const hasClaim = (claim: string): boolean => {
  const keycloak = getKeycloakInstance();
  const tokenParsed = keycloak.tokenParsed;
  return tokenParsed ? claim in tokenParsed : false;
};

export const getClaim = (claim: string): any => {
  const keycloak = getKeycloakInstance();
  const tokenParsed = keycloak.tokenParsed;
  return tokenParsed ? tokenParsed[claim] : null;
};
