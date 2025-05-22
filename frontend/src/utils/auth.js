import axios from 'axios';

// Configuration de base d'Axios
axios.defaults.baseURL = 'http://localhost:5000/api';

// Fonction pour définir le token dans le localStorage et les headers Axios
export const setToken = (token) => {
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Fonction pour récupérer le token du localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Fonction pour supprimer le token du localStorage et des headers Axios
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// Fonction pour récupérer le rôle de l'utilisateur
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role;
};

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Configuration initiale du token si présent
const token = getToken();
if (token) {
  setToken(token);
} 