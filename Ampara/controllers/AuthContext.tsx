import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Auth0, { User as Auth0User } from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth0Config, isDebugMode } from '../config/environments';

// Legacy User type for backward compatibility
export type User = {
  id: string;
  name: string;
  role: string;
  dob?: string;
  tags?: string[];
  avatarUrl?: string;
} & Auth0User;

// Legacy AuthContextValue for backward compatibility
export type AuthContextValue = {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  signOut: () => Promise<void>;
  user: User | null;
  setUser: (u: User | null) => void;
};

// New Auth0-based context type
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: Auth0User | null;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// Legacy context for backward compatibility
export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  signOut: async () => {},
  user: null,
  setUser: () => {},
});

// New Auth0 context
const Auth0Context = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth0_access_token',
  REFRESH_TOKEN: 'auth0_refresh_token',
  USER: 'auth0_user',
  TOKEN_EXPIRY: 'auth0_token_expiry',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Auth0User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [auth0Client, setAuth0Client] = useState<Auth0 | null>(null);

  // Initialize Auth0
  useEffect(() => {
    const initAuth0 = () => {
      try {
        const config = getAuth0Config();
        const client = new Auth0({
          domain: config.domain,
          clientId: config.clientId,
        });
        setAuth0Client(client);
        
        if (isDebugMode()) {
          console.log('🔐 Auth0 initialized with domain:', config.domain);
        }
      } catch (error) {
        console.error('Failed to initialize Auth0:', error);
      }
    };

    initAuth0();
  }, []);

  // Check for existing session on app start
  useEffect(() => {
    const checkAuthState = async () => {
      if (!auth0Client) return;

      try {
        setIsLoading(true);

        // Check for stored tokens
        const [storedAccessToken, storedUser, storedExpiry] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY),
        ]);

        if (storedAccessToken && storedUser && storedExpiry) {
          const expiryTime = parseInt(storedExpiry, 10);
          const now = Date.now();

          if (now < expiryTime) {
            // Token is still valid
            setAccessToken(storedAccessToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            
            if (isDebugMode()) {
              console.log('✅ Restored valid auth session');
            }
          } else {
            // Token expired, try to refresh
            if (isDebugMode()) {
              console.log('🔄 Token expired, attempting refresh...');
            }
            await refreshToken();
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        await clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    if (auth0Client) {
      checkAuthState();
    }
  }, [auth0Client]);

  const storeAuthData = async (token: string, userInfo: User, expiresAt: number) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userInfo)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString()),
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  };

  const clearStoredAuth = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);
      
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const login = async () => {
    if (!auth0Client) {
      throw new Error('Auth0 client not initialized');
    }

    try {
      setIsLoading(true);
      
      const config = getAuth0Config();
      const credentials = await auth0Client.webAuth.authorize({
        scope: 'openid profile email offline_access',
        audience: config.audience,
      });

      if (credentials.accessToken) {
        // Get user info
        const userInfo = await auth0Client.auth.userInfo({
          token: credentials.accessToken,
        });

        // Calculate expiry time (default to 1 hour if not provided)
        const expiresIn = credentials.expiresIn || 3600;
        const expiresAt = Date.now() + (expiresIn * 1000);

        // Store auth data
        await storeAuthData(credentials.accessToken, userInfo, expiresAt);

        // Update state
        setAccessToken(credentials.accessToken);
        setUser(userInfo);
        setIsAuthenticated(true);

        if (isDebugMode()) {
          console.log('✅ Login successful for user:', userInfo.email);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!auth0Client) {
      throw new Error('Auth0 client not initialized');
    }

    try {
      setIsLoading(true);

      // Clear Auth0 session
      await auth0Client.webAuth.clearSession();

      // Clear stored data
      await clearStoredAuth();

      if (isDebugMode()) {
        console.log('✅ Logout successful');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    if (!auth0Client) {
      throw new Error('Auth0 client not initialized');
    }

    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const credentials = await auth0Client.auth.refreshToken({
        refreshToken,
      });

      if (credentials.accessToken) {
        // Get updated user info
        const userInfo = await auth0Client.auth.userInfo({
          token: credentials.accessToken,
        });

        // Calculate new expiry time
        const expiresIn = credentials.expiresIn || 3600;
        const expiresAt = Date.now() + (expiresIn * 1000);

        // Store updated auth data
        await storeAuthData(credentials.accessToken, userInfo, expiresAt);

        // Update state
        setAccessToken(credentials.accessToken);
        setUser(userInfo);
        setIsAuthenticated(true);

        if (isDebugMode()) {
          console.log('✅ Token refresh successful');
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, clear auth and require login
      await clearStoredAuth();
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    accessToken,
    login,
    logout,
    refreshToken,
  };

  return (
    <Auth0Context.Provider value={contextValue}>
      {children}
    </Auth0Context.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(Auth0Context);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
export default AuthContext;
