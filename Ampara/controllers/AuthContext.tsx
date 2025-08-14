// Ampara/context/AuthContext.tsx
import { createContext, useContext } from "react";

export type AuthContextValue = {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
};

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const useAuth = () => useContext(AuthContext);
