import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'dev',
    company: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/users', newUser);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'dev',
        company: ''
      });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-white mb-8">Gestion des Utilisateurs</h1>

          {/* Add User Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Ajouter un utilisateur</h2>
            <form onSubmit={handleAddUser} className="mt-4 bg-gray-800/90 p-6 rounded-lg border border-gray-700">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="mt-1 block w-full h-12 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white text-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="mt-1 block w-full h-12 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white text-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="mt-1 block w-full h-12 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white text-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="mt-1 block w-full h-12 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white text-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                    Rôle
                  </label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="mt-1 block w-full h-12 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white text-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="dev">Développeur</option>
                    <option value="po">Product Owner</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={newUser.company}
                    onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                    className="mt-1 block w-full h-12 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white text-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="text-blue-400 hover:text-blue-300 text-lg font-medium transition duration-300"
                >
                  Ajouter l'utilisateur
                </button>
              </div>
            </form>
          </div>

          {/* Users List */}
          <div className="bg-gray-800/90 shadow rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-white">Liste des utilisateurs</h3>
            </div>
            <div className="border-t border-gray-700">
              <ul className="divide-y divide-gray-700">
                {users.map((user) => (
                  <li key={user._id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-400 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-300">{user.email}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                        <span className={`text-sm ${
                          user.role === 'admin' ? 'text-blue-400' :
                          user.role === 'po' ? 'text-purple-400' :
                          'text-green-400'
                        }`}>
                          {user.role}
                        </span>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-400 hover:text-red-300 transition duration-300"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 