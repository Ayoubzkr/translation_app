import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { setToken } from '../../utils/auth';
import Header from '../../components/layout/Header';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
      console.log('Utilisateur déjà connecté, redirection...', user);
      switch(user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'po':
          navigate('/po/dashboard');
          break;
        case 'dev':
          navigate('/dev/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', formData);
      const { token, ...userData } = response.data;
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Rediriger selon le rôle
      switch(userData.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'po':
          navigate('/po/dashboard');
          break;
        case 'dev':
          navigate('/dev/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-black to-gray-800 min-h-screen flex items-center justify-center pt-24">
        <div className="p-8 max-w-lg w-full bg-gray-900 rounded-lg shadow-lg">
          <h1 className="text-3xl text-center font-semibold text-blue-400 mb-6">Connexion</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 transition duration-300"
            >
              {loading ? 'Chargement...' : 'Se connecter'}
            </button>
          </form>
          {error && (
            <p className="text-red-500 mt-5 text-center">
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login; 