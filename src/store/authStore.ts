import { create } from 'zustand';
import Keycloak from 'keycloak-js';

interface UserInfo {
  username?: string;
  email?: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isTokenValid: boolean;
  isLoading: boolean;
  userInfo: UserInfo;
  keycloak: Keycloak | null;
  setKeycloak: (keycloak: Keycloak) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setTokenValid: (isValid: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  isTokenValid: false,
  isLoading: true,
  userInfo: {},
  keycloak: null,
};

export const useAuthStore = create<AuthState>(set => ({
  ...initialState,
  setKeycloak: keycloak => set({ keycloak }),
  setAuthenticated: isAuthenticated => set({ isAuthenticated }),
  setTokenValid: isTokenValid => set({ isTokenValid }),
  setLoading: isLoading => set({ isLoading }),
  setUserInfo: userInfo => set({ userInfo }),
  reset: () => set(initialState),
}));
