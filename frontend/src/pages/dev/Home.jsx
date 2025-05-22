import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const DevHome = () => {
  const [stats, setStats] = useState({
    totalTranslations: 0,
    completedTranslations: 0,
    pendingTranslations: 0,
    accuracy: 0
  });

  const [recentTranslations, setRecentTranslations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get('/dev/stats');
        setStats(statsResponse.data);

        const translationsResponse = await axios.get('/dev/recent-translations');
        setRecentTranslations(translationsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-white">Tableau de bord Développeur</h1>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-green-400 truncate">Traductions totales</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalTranslations}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-green-400 truncate">Traductions terminées</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.completedTranslations}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-green-400 truncate">Traductions en attente</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.pendingTranslations}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-green-400 truncate">Précision moyenne</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.accuracy}%</dd>
            </div>
          </div>
        </div>

        {/* Recent Translations */}
        <div className="mt-8">
          <div className="bg-gray-800/90 shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-white">Traductions récentes</h3>
              <Link
                to="/dev/translations/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300"
              >
                Nouvelle traduction
              </Link>
            </div>
            <div className="border-t border-gray-700">
              <ul className="divide-y divide-gray-700">
                {recentTranslations.map((translation, index) => (
                  <li key={index} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-400 truncate">
                          {translation.key}
                        </p>
                        <p className="text-sm text-gray-300">{translation.value}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          translation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {translation.status === 'completed' ? 'Terminée' : 'En cours'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-300">
                          {translation.language}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-300 sm:mt-0">
                        <p>
                          Modifiée le {new Date(translation.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="bg-gray-800/90 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Gestion des Traductions</h2>
            <p className="text-gray-300 mb-4">
              Gérez vos traductions et suivez leur progression.
            </p>
            <Link
              to="/dev/translations"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Voir les traductions
            </Link>
          </div>

          <div className="bg-gray-800/90 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Chaînes de caractères</h2>
            <p className="text-gray-300 mb-4">
              Gérez les chaînes de caractères à traduire.
            </p>
            <Link
              to="/dev/strings"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Voir les chaînes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevHome; 