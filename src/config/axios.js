import axios from 'axios';
import { message } from 'antd';
import { tokens } from '../services/tokens.js';

// Shared axios instance: attaches the auth token, unwraps responses, and toasts errors.
export class ApiError extends Error {
  constructor(status, msg) {
    super(msg);
    this.status = status;
  }
}

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attaches the stored access token to every request, if there is one.
client.interceptors.request.use((config) => {
  if (tokens.access) config.headers.Authorization = `Bearer ${tokens.access}`;
  return config;
});

client.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const status = error.response?.status ?? 0;
    const msg = error.response?.data?.message ?? error.message;
    message.error(msg);
    return Promise.reject(new ApiError(status, msg));
  },
);
