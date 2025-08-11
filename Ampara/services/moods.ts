import authClient from './authClient';

export const fetchMoods = () => authClient.get('/moods');
