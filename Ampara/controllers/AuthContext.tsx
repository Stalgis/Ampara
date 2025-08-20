// Ampara/context/AuthContext.tsx
import { createContext, useContext } from "react";

export type User = {
  id: string;
  name: string;
  role: string;
  dob?: string;
  tags?: string[];
  avatarUrl?: string;
};

export type AuthContextValue = {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  /**
   * Clears auth data and navigates user out of the protected area.
   */
  signOut: () => Promise<void>;
<!--   user: User | null;
  setUser: (u: User | null) => void; -->
};

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  signOut: async () => {},
<!--   user: null,
  setUser: () => {}, -->
});

export const useAuth = () => useContext(AuthContext);
