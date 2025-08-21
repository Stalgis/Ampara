import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SERVER_URL =
  process.env.SERVER_URL ||
  (Platform.OS === 'android' ? '10.0.2.2:3000' : 'localhost:3000');
const BASE_URL = `http://${SERVER_URL}`;

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const token = await AsyncStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  } as Record<string, string>;

  try {
    return await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  } catch (error) {
    console.error(`Failed to fetch from ${BASE_URL}`, error);
    throw new Error(
      `Could not connect to backend at ${BASE_URL}. Is the server running?`,
    );
  }
};

export default apiFetch;
