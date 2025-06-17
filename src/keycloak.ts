import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8080", // Replace with your Keycloak server URL
  realm: "Kliq", // Replace with your realm name
  clientId: "backoffice-ui", // Replace with your client ID
};

let keycloakInstance: Keycloak | null = null;

export const getKeycloakInstance = () => {
  if (!keycloakInstance) {
    console.log("Creating new Keycloak instance...");
    keycloakInstance = new Keycloak(keycloakConfig);

    // Add event listeners
    keycloakInstance.onReady = (authenticated) => {
      console.log("Keycloak ready:", authenticated);
    };

    keycloakInstance.onAuthSuccess = () => {
      console.log("Keycloak auth success");
    };

    keycloakInstance.onAuthError = () => {
      console.log("Keycloak auth error");
    };

    keycloakInstance.onAuthRefreshSuccess = () => {
      console.log("Keycloak token refreshed");
    };

    keycloakInstance.onAuthRefreshError = () => {
      console.log("Keycloak token refresh error");
    };

    keycloakInstance.onAuthLogout = () => {
      console.log("Keycloak logout");
    };

    keycloakInstance.onTokenExpired = () => {
      console.log("Keycloak token expired");
      keycloakInstance?.updateToken(70).catch((error) => {
        console.error("Failed to refresh token:", error);
      });
    };
  }

  return keycloakInstance;
};

export default getKeycloakInstance();
