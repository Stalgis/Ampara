// Ampara/context/AuthContext.tsx
import { createContext, useContext } from "react";

export type AuthContextValue = {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  /**
   * Clears auth data and navigates user out of the protected area.
   */
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);
