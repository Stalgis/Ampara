import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth0Config, isDebugMode } from '../config/environments';
import { apiService } from '../services/api';

// Legacy User type for backward compatibility
export type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  sub?: string;
  picture?: string;
  [key: string]: any;
};

// Auth0 context type
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  emailVerificationRequired: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  markEmailVerified: () => void;
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth0_access_token',
  USER: 'auth0_user',
  TOKEN_EXPIRY: 'auth0_token_expiry',
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [emailVerificationRequired, setEmailVerificationRequired] = useState(false);
  
  // PKCE configuration
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'ampara',
    path: 'auth'
  });

  // Debug: Log the actual redirect URI being used
  useEffect(() => {
    console.log('🔗 Redirect URI:', redirectUri);
  }, [redirectUri]);

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getAuth0Config().clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      additionalParameters: {},
      customParameters: getAuth0Config().audience ? {
        audience: getAuth0Config().audience,
      } : {},
      extraParams: getAuth0Config().audience ? {
        audience: getAuth0Config().audience,
      } : {}
    },
    {
      authorizationEndpoint: `https://${getAuth0Config().domain}/authorize`,
      tokenEndpoint: `https://${getAuth0Config().domain}/oauth/token`,
    }
  );

  // Check for existing session on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  // Handle auth result
  useEffect(() => {
    if (result) {
      if (result.type === 'success') {
        handleAuthSuccess(result);
      } else if (result.type === 'error') {
        console.error('Auth error:', result.error);
      }
    }
  }, [result]);

  const checkAuthState = async () => {
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
          await apiService.setAccessToken(storedAccessToken);
          setAccessToken(storedAccessToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          if (isDebugMode()) {
            console.log('✅ Restored valid auth session');
          }
        } else {
          // Token expired, clear storage
          if (isDebugMode()) {
            console.log('🔄 Token expired, clearing session...');
          }
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async (authResult: AuthSession.AuthSessionResult & { type: 'success' }) => {
    try {
      const { code } = authResult.params;
      
      if (!code) {
        throw new Error('No authorization code received');
      }

      // Exchange code for tokens
      const tokenResponse = await fetch(`https://${getAuth0Config().domain}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: getAuth0Config().clientId,
          code,
          redirect_uri: redirectUri,
          code_verifier: request?.codeVerifier,
          ...(getAuth0Config().audience && { audience: getAuth0Config().audience }),
        }),
      });

      const tokens = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokens.error_description || 'Token exchange failed');
      }

      // Get user info
      const userResponse = await fetch(`https://${getAuth0Config().domain}/userinfo`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const userInfo = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      // Calculate expiry time (default to 1 hour if not provided)
      const expiresIn = tokens.expires_in || 3600;
      const expiresAt = Date.now() + (expiresIn * 1000);

      // Store auth data
      await storeAuthData(tokens.access_token, userInfo, expiresAt);

      // Set token in API service
      await apiService.setAccessToken(tokens.access_token);

      // Check if email is verified
      if (userInfo.email_verified === false) {
        setEmailVerificationRequired(true);
        setIsAuthenticated(false);
        if (isDebugMode()) {
          console.log('📧 Email verification required for:', userInfo.email);
        }
      } else {
        // Update state
        setAccessToken(tokens.access_token);
        setUser(userInfo);
        setIsAuthenticated(true);
        setEmailVerificationRequired(false);

        if (isDebugMode()) {
          console.log('✅ Login successful for user:', userInfo.email);
        }
      }
    } catch (error) {
      console.error('Auth success handler error:', error);
      throw error;
    }
  };

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
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);

      // Clear token from API service
      await apiService.setAccessToken(null);
      
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Clear local storage
      await clearStoredAuth();

      // Optionally, you can also call Auth0 logout endpoint
      // This would require opening a browser to complete the logout
      const logoutUrl = `https://${getAuth0Config().domain}/v2/logout?returnTo=${encodeURIComponent(
        redirectUri
      )}&client_id=${getAuth0Config().clientId}`;
      
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

  const markEmailVerified = () => {
    setEmailVerificationRequired(false);
    // You might want to set isAuthenticated to true here if user data exists
    if (user) {
      setIsAuthenticated(true);
    }
  };

  const retryAuth = async () => {
    try {
      setIsLoading(true);
      await promptAsync();
    } catch (error) {
      console.error('Retry auth error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    accessToken,
    emailVerificationRequired,
    login,
    logout,
    markEmailVerified,
    retryAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;