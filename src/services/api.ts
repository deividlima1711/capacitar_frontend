import axios from 'axios';

// URL da API vinda do ambiente (Vercel ou .env local)
const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error('❌ Variável REACT_APP_API_URL não foi definida. Verifique o .env ou o painel do Vercel.');
}

// Loga a URL base no modo desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('🔗 API base URL:', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT automaticamente
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('➡️ API Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar as respostas da API
api.interceptors.response.use(
  (response: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ API Error:', error.response?.status, error.config?.url, error.message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Serviços da API organizados
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username: string, password: string, email?: string) => {
    const response = await api.post('/auth/register', { username, password, email });
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};

export const generalAPI = {
  getStatus: async () => {
    const response = await api.get('/status');
    return response.data;
  }
};

export default api;
