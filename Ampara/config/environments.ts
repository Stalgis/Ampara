export interface Environment {
  name: string;
  baseUrl: string;
  apiTimeout: number;
  retryAttempts: number;
  debug: boolean;
  auth0: {
    domain: string;
    clientId: string;
    audience?: string;
  };
}

export interface Environments {
  development: Environment;
  staging: Environment;
  production: Environment;
}

export const environments: Environments = {
  development: {
    name: 'development',
    baseUrl: 'http://localhost:3000',
    apiTimeout: 10000, // 10 seconds
    retryAttempts: 3,
    debug: true,
    auth0: {
      domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-dev-domain.auth0.com',
      clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'your-dev-client-id',
      audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || 'ampara-api',
    },
  },
  staging: {
    name: 'staging',
    baseUrl: 'https://api-staging.yourdomain.com', // Replace with your staging URL
    apiTimeout: 15000, // 15 seconds
    retryAttempts: 2,
    debug: true,
    auth0: {
      domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-staging-domain.auth0.com',
      clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'your-staging-client-id',
      audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || 'https://api-staging.yourdomain.com',
    },
  },
  production: {
    name: 'production',
    baseUrl: 'https://api.yourdomain.com', // Replace with your production URL
    apiTimeout: 20000, // 20 seconds
    retryAttempts: 1,
    debug: false,
    auth0: {
      domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN || 'your-prod-domain.auth0.com',
      clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID || 'your-prod-client-id',
      audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE || 'https://api.yourdomain.com',
    },
  },
};

export type EnvironmentName = keyof typeof environments;

export function getCurrentEnvironment(): Environment {
  // Check if we're in Expo/React Native environment
  if (typeof window !== 'undefined' && (window as any).__DEV__) {
    return environments.development;
  }

  // Check environment variable (for build time)
  const envName = process.env.NODE_ENV || process.env.EXPO_PUBLIC_ENV;
  
  switch (envName) {
    case 'development':
    case 'dev':
      return environments.development;
    case 'staging':
    case 'stage':
      return environments.staging;
    case 'production':
    case 'prod':
      return environments.production;
    default:
      // Default to development if environment is not recognized
      return environments.development;
  }
}

export function getApiBaseUrl(): string {
  // Allow runtime override via environment variable
  const runtimeUrl = process.env.EXPO_PUBLIC_API_URL || process.env.SERVER_URL;
  
  if (runtimeUrl) {
    // Ensure it starts with http:// or https://
    if (runtimeUrl.startsWith('localhost:') || runtimeUrl.match(/^\d+\.\d+\.\d+\.\d+:/)) {
      return `http://${runtimeUrl}`;
    }
    return runtimeUrl.startsWith('http') ? runtimeUrl : `https://${runtimeUrl}`;
  }

  return getCurrentEnvironment().baseUrl;
}

export function isDebugMode(): boolean {
  return getCurrentEnvironment().debug;
}

export function getApiTimeout(): number {
  return getCurrentEnvironment().apiTimeout;
}

export function getRetryAttempts(): number {
  return getCurrentEnvironment().retryAttempts;
}

export function getAuth0Config() {
  return getCurrentEnvironment().auth0;
}