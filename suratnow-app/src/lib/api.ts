import axios from 'axios';

const currentHost = window.location.hostname;
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const dynamicApiUrl = configuredApiUrl || `${window.location.protocol}//${currentHost}:8080/api`;

const api = axios.create({
  baseURL: dynamicApiUrl,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

const apiRoot = dynamicApiUrl.replace(/\/api\/?$/, '');

export async function ensureCsrfCookie(): Promise<void> {
  await axios.get(`${apiRoot}/sanctum/csrf-cookie`, { withCredentials: true });
}

export default api;
