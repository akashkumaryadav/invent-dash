import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN = import.meta.env.VITE_TOKEN || 'test-token';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['Authorization'] = `Bearer ${TOKEN}`;
  return config;
});

export type Item = {
  id: string;
  name: string;
  quantity: number;
  category: string;
};

export async function fetchItems(q?: string) {
  const res = await api.get<Item[]>('/items', { params: q ? { q } : undefined });
  return res.data;
}

export async function addItem(data: Omit<Item, 'id'>) {
  const res = await api.post<Item>('/items', data);
  return res.data;
}

export async function updateItem(id: string, data: Partial<Omit<Item, 'id'>>) {
  const res = await api.put<Item>(`/items/${id}`, data);
  return res.data;
}

export async function deleteItem(id: string) {
  await api.delete(`/items/${id}`);
}
