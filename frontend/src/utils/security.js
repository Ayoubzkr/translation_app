import axios from 'axios';

// Configuration d'axios pour la sécurité
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fonction pour valider les entrées
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Supprime les balises HTML
    .trim();
};

// Fonction pour valider les emails
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Fonction pour valider les mots de passe
export const validatePassword = (password) => {
  // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

// Fonction pour vérifier la force du mot de passe
export const checkPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return {
    score: strength,
    maxScore: 5,
    isStrong: strength >= 4
  };
};

// Fonction pour limiter les tentatives de connexion
export const rateLimiter = {
  attempts: 0,
  lastAttempt: null,
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes

  canAttempt() {
    const now = Date.now();
    if (this.lastAttempt && now - this.lastAttempt < this.lockoutDuration) {
      return false;
    }
    if (this.attempts >= this.maxAttempts) {
      this.lastAttempt = now;
      this.attempts = 0;
      return false;
    }
    return true;
  },

  recordAttempt() {
    this.attempts++;
    this.lastAttempt = Date.now();
  },

  reset() {
    this.attempts = 0;
    this.lastAttempt = null;
  }
};

// Fonction pour vérifier la sécurité de la session
export const checkSessionSecurity = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    // Vérifie si le token est expiré
    if (decoded.exp < now) {
      localStorage.removeItem('token');
      return false;
    }

    // Vérifie si l'IP a changé (si disponible dans le token)
    if (decoded.ip && decoded.ip !== window.location.hostname) {
      localStorage.removeItem('token');
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
}; 