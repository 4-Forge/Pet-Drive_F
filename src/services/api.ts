import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://pet-drive-b-jdd9.onrender.com',
});

// Interceptor definitivo: Ele lê o localStorage dinamicamente antes de CADA requisição
api.interceptors.request.use(
  (config) => {
    const tokenSalvo = localStorage.getItem('@PetDrive:token');
    if (tokenSalvo) {
      // Se o token já tiver 'Bearer ', envia ele. Se não, adiciona.
      config.headers.Authorization = tokenSalvo.startsWith('Bearer ') 
        ? tokenSalvo 
        : `Bearer ${tokenSalvo}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);