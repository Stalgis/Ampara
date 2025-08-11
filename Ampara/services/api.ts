import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `http://${process.env.SERVER_URL || 'localhost:3000'}`;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  } as Record<string, string>;

  return fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
};

export default apiFetch;
