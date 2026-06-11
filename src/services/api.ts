import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://pet-drive-b-jdd9.onrender.com',
});

api.interceptors.request.use(
  (config) => {
    const tokenSalvo = localStorage.getItem('@PetDrive:token');

    if (
      tokenSalvo &&
      tokenSalvo !== 'google-login' &&
      tokenSalvo.startsWith('Bearer ')
    ) {
      config.headers.Authorization = tokenSalvo;
    }

    return config;
  },
  (error) => Promise.reject(error)
);