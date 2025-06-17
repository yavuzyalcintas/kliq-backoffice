import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { getKeycloakInstance } from "../keycloak";

export const useUserProfile = () => {
  const keycloak = getKeycloakInstance();
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      console.log("Starting user profile fetch...");
      console.log("Keycloak authenticated:", keycloak.authenticated);
      console.log("Token parsed:", keycloak.tokenParsed);

      if (!keycloak.authenticated) {
        throw new Error("Not authenticated");
      }

      try {
        console.log("Loading user profile...");
        const profile = await keycloak.loadUserProfile();
        console.log("Profile loaded:", profile);

        const userInfo = {
          username: profile.username,
          email: profile.email,
          name:
            profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.username,
        };
        console.log("Setting user info:", userInfo);
        setUserInfo(userInfo);
        return userInfo;
      } catch (error) {
        console.error("Failed to load profile, using token data:", error);
        // Fallback to token data
        const tokenParsed = keycloak.tokenParsed;
        console.log("Using token data:", tokenParsed);

        const fallbackUserInfo = {
          username: tokenParsed?.preferred_username,
          email: tokenParsed?.email,
          name: tokenParsed?.name || tokenParsed?.preferred_username,
        };
        console.log("Setting fallback user info:", fallbackUserInfo);
        setUserInfo(fallbackUserInfo);
        return fallbackUserInfo;
      }
    },
    enabled: !!keycloak.authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
