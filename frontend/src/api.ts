import axios from 'axios';
import type { LinkInfo, Analytics } from './types';

const api = axios.create({
    baseURL: '/api',
});

export const getLinks = async (): Promise<string[]> => {
    const {data} = await api.get<string[]>('/all');

    return data;
}

export const createLink = async (data: {
    originalUrl: string;
    alias?: string;
    expiresAt?: string;
}) => {
    return api.post<{ shortUrl: string }>('/shorten', data);
}

export const getInfo = async (alias: string) => {
    return api.get<LinkInfo>(`/info/${alias}`);
}

export const deleteLink = async (alias: string) => {
    return api.delete(`/delete/${alias}`);
}

export const getAnalytics = async (alias: string) => {
    return api.get<Analytics>(`/analytics/${alias}`);
}
