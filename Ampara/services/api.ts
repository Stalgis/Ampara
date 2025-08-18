import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, getApiTimeout, getRetryAttempts, isDebugMode } from '../config/environments';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor() {
    this.baseUrl = getApiBaseUrl();
    this.defaultTimeout = getApiTimeout();
    this.defaultRetries = getRetryAttempts();

    if (isDebugMode()) {
      console.log(`🌐 API Service initialized with base URL: ${this.baseUrl}`);
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
      console.warn('Failed to get auth token:', error);
      return {};
    }
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  async makeRequest<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      skipAuth = false,
      headers: customHeaders = {},
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    let authHeaders = {};
    if (!skipAuth) {
      authHeaders = await this.getAuthHeaders();
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...authHeaders,
      ...customHeaders,
    };

    if (isDebugMode()) {
      console.log(`🚀 ${fetchOptions.method || 'GET'} ${url}`);
      if (fetchOptions.body) {
        console.log('📦 Request body:', fetchOptions.body);
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(
          url,
          {
            ...fetchOptions,
            headers,
          },
          timeout,
        );

        if (isDebugMode()) {
          console.log(`📡 Response ${response.status} from ${url}`);
        }

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            errorMessage = response.statusText || errorMessage;
          }
          throw new ApiError(errorMessage, response.status, response);
        }

        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        if (isDebugMode()) {
          console.log('✅ API Response:', responseData);
        }

        return responseData;
      } catch (error) {
        lastError = error;
        
        if (isDebugMode()) {
          console.error(`❌ Attempt ${attempt + 1} failed:`, error);
        }

        // Don't retry on client errors (4xx) except timeout
        if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500 && error.status !== 408) {
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new ApiError('All retry attempts failed');
  }

  // HTTP Methods
  async get<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Voice API specific methods
  async makeCall(phoneNumber: string, elderId: string, message?: string) {
    return this.post('/voice/make-call', {
      phoneNumber,
      elderId,
      message,
    });
  }

  async getCall(callSid: string) {
    return this.get(`/voice/call/${callSid}`);
  }

  async getCallsByElder(elderId: string) {
    return this.get(`/voice/calls/elder/${elderId}`);
  }

  async getCallSummary(callSid: string) {
    return this.get(`/voice/call/${callSid}/summary`);
  }

  // Utility methods
  setBaseUrl(url: string) {
    this.baseUrl = url;
    if (isDebugMode()) {
      console.log(`🔄 API base URL updated to: ${this.baseUrl}`);
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export both the service and legacy function for backward compatibility
export { apiService };
export const apiFetch = apiService.makeRequest.bind(apiService);
export default apiService;
