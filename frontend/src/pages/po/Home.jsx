import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const POHome = () => {
  const [stats, setStats] = useState({
    totalApps: 0,
    activeApps: 0,
    totalTranslations: 0,
    pendingTranslations: 0
  });

  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get('/po/stats');
        setStats(statsResponse.data);

        const appsResponse = await axios.get('/po/recent-apps');
        setRecentApps(appsResponse.data);
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
          <h1 className="text-3xl font-bold text-white">Tableau de bord Product Owner</h1>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-purple-400 truncate">Applications totales</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalApps}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-purple-400 truncate">Applications actives</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.activeApps}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-purple-400 truncate">Traductions totales</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalTranslations}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-purple-400 truncate">Traductions en attente</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.pendingTranslations}</dd>
            </div>
          </div>
        </div>

        {/* Recent Apps */}
        <div className="mt-8">
          <div className="bg-gray-800/90 shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-white">Applications récentes</h3>
              <Link
                to="/po/apps/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition duration-300"
              >
                Nouvelle application
              </Link>
            </div>
            <div className="border-t border-gray-700">
              <ul className="divide-y divide-gray-700">
                {recentApps.map((app, index) => (
                  <li key={index} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-purple-400 truncate">
                          {app.name}
                        </p>
                        <p className="text-sm text-gray-300">{app.description}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status === 'active' ? 'Active' : 'En développement'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-300">
                          {app.languages.join(', ')}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-300 sm:mt-0">
                        <p>
                          Créée le {new Date(app.createdAt).toLocaleDateString()}
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
            <h2 className="text-xl font-semibold mb-4 text-white">Gestion des Applications</h2>
            <p className="text-gray-300 mb-4">
              Gérez vos applications et leurs paramètres de traduction.
            </p>
            <Link
              to="/po/apps"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Voir les applications
            </Link>
          </div>

          <div className="bg-gray-800/90 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Gestion des Traductions</h2>
            <p className="text-gray-300 mb-4">
              Suivez l'état des traductions et gérez les demandes.
            </p>
            <Link
              to="/po/translations"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
            >
              Voir les traductions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POHome; 