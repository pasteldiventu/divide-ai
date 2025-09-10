import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage (ou de onde você o salvou após o login)
    const token = localStorage.getItem('authToken'); 

    if (token) {
      // Se o token existir, adiciona ao cabeçalho 'Authorization'
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;