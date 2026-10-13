import axios from 'axios';
import type { Orchid, OrchidDraft } from '../types';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/orchids';
const baseURL = rawBaseUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export const getOrchids = () => api.get<Orchid[]>('');
export const getOrchid = (id: string | number) => api.get<Orchid>(`/${id}`);
export const createOrchid = (orchid: OrchidDraft) => api.post<Orchid>('', orchid);
export const updateOrchid = (id: number | string, orchid: OrchidDraft) =>
  api.put<Orchid>(`/${id}`, orchid);
export const deleteOrchid = (id: number | string) => api.delete(`/${id}`);

export default api;
