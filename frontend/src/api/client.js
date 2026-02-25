import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Tu URL de backend
});

// Interceptor para añadir el Token en cada petición
api.interceptors.request.use(async (config) => {
  // 1. Obtenemos la sesión actual de Supabase
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Si hay sesión, sacamos el access_token (JWT)
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;