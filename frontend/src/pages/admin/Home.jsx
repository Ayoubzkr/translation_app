import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApps: 0,
    totalStrings: 0,
    totalTranslations: 0,
    usersByRole: {
      admin: 0,
      po: 0,
      dev: 0
    }
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
        setRecentUsers(response.data.recentUsers);
        setRecentApps(response.data.recentApps);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAddUser = () => {
    navigate('/admin/users');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-white">Tableau de bord Administrateur</h1>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-blue-400 truncate">Utilisateurs totaux</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalUsers}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-blue-400 truncate">Applications</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalApps}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-blue-400 truncate">Chaînes</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalStrings}</dd>
            </div>
          </div>

          <div className="bg-gray-800/90 overflow-hidden shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-blue-400 truncate">Traductions</dt>
              <dd className="mt-1 text-3xl font-semibold text-white">{stats.totalTranslations}</dd>
            </div>
          </div>
        </div>

        {/* Users by Role */}
        <div className="mt-8">
          <div className="bg-gray-800/90 shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-white">Utilisateurs par rôle</h3>
            </div>
            <div className="border-t border-gray-700 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <h4 className="text-sm font-medium text-blue-400">Administrateurs</h4>
                  <p className="mt-2 text-3xl font-semibold text-white">{stats.usersByRole.admin || 0}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-400">Product Owners</h4>
                  <p className="mt-2 text-3xl font-semibold text-white">{stats.usersByRole.po || 0}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-400">Développeurs</h4>
                  <p className="mt-2 text-3xl font-semibold text-white">{stats.usersByRole.dev || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="mt-8">
          <div className="bg-gray-800/90 shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-white">Utilisateurs récents</h3>
              <button
                onClick={handleAddUser}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              >
                Ajouter un utilisateur
              </button>
            </div>
            <div className="border-t border-gray-700">
              <ul className="divide-y divide-gray-700">
                {recentUsers.map((user) => (
                  <li key={user._id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-400 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-300">{user.email}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-300">
                          {user.role}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-300 sm:mt-0">
                        <p>
                          Inscrit le {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Apps */}
        <div className="mt-8">
          <div className="bg-gray-800/90 shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-white">Applications récentes</h3>
            </div>
            <div className="border-t border-gray-700">
              <ul className="divide-y divide-gray-700">
                {recentApps.map((app) => (
                  <li key={app._id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-400 truncate">
                          {app.name}
                        </p>
                        <p className="text-sm text-gray-300">{app.description}</p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-300">
                          {app.company}
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

        {/* User Management Card */}
        <div className="mt-8 bg-gray-800/90 rounded-lg shadow-md p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Gestion des Utilisateurs</h2>
          <p className="text-gray-300 mb-4">
            Gérez les utilisateurs de la plateforme, ajoutez de nouveaux utilisateurs et modifiez leurs rôles.
          </p>
          <Link
            to="/admin/users"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Gérer les utilisateurs
          </Link>
        </div>

        {/* Application Management Card */}
        <div className="mt-8 bg-gray-800/90 rounded-lg shadow-md p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Gestion des Applications</h2>
          <p className="text-gray-300 mb-4">
            Gérez les applications et leurs paramètres de traduction.
          </p>
          <Link
            to="/admin/apps"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Gérer les applications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome; 