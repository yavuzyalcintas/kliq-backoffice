import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { getKeycloakInstance } from "../keycloak";

export const useUserProfile = () => {
  const keycloak = getKeycloakInstance();
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!keycloak.authenticated) {
        throw new Error("Not authenticated");
      }

      try {
        const profile = await keycloak.loadUserProfile();

        const userInfo = {
          username: profile.username,
          email: profile.email,
          name:
            profile.firstName && profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.username,
        };
        setUserInfo(userInfo);
        return userInfo;
      } catch (error) {
        // Fallback to token data
        const tokenParsed = keycloak.tokenParsed;

        const fallbackUserInfo = {
          username: tokenParsed?.preferred_username,
          email: tokenParsed?.email,
          name: tokenParsed?.name || tokenParsed?.preferred_username,
        };
        setUserInfo(fallbackUserInfo);
        return fallbackUserInfo;
      }
    },
    enabled: !!keycloak.authenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
