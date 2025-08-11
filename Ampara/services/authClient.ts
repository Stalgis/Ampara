import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authClient = axios.create({
  baseURL: 'http://localhost:3000',
});

authClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authClient;
