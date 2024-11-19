import axios from 'axios';

type Alert = {
    id: string;
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },
};

export const forexService = {
    getPairs: async () => {
        const response = await api.get('/forex/pairs');
        return response.data;
    },
    createAlert: async (alert: Omit<Alert, 'id'>) => {
        const response = await api.post('/forex/alerts', alert);
        return response.data;
    },
};