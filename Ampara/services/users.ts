import authClient from './authClient';

export const fetchUsers = () => authClient.get('/users');
