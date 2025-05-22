import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/auth";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRoleColor = () => {
    if (!user) return 'from-black to-gray-900';
    switch (user.role) {
      case 'admin':
        return 'from-blue-900 to-blue-800';
      case 'po':
        return 'from-purple-900 to-purple-800';
      case 'dev':
        return 'from-green-900 to-green-800';
      default:
        return 'from-black to-gray-900';
    }
  };

  const getRoleTextColor = () => {
    if (!user) return 'text-blue-400';
    switch (user.role) {
      case 'admin':
        return 'text-blue-400';
      case 'po':
        return 'text-purple-400';
      case 'dev':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getRoleColor()} shadow-lg fixed top-0 left-0 right-0 z-10`}>
      <div className="flex justify-between items-center max-w-6xl mx-auto p-5">
        <Link to="/">
          <h1 className={`text-3xl font-bold ${getRoleTextColor()} tracking-wide`}>
            Transiflow 
          </h1>
        </Link>
        <ul className="flex gap-8 text-lg">
          {user && (
            <>
              <li>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Dashboard
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link
                    to="/admin/users"
                    className="text-gray-300 hover:text-white transition duration-300"
                  >
                    Utilisateurs
                  </Link>
                </li>
              )}
              {user.role === 'po' && (
                <li>
                  <Link
                    to="/po/apps"
                    className="text-gray-300 hover:text-white transition duration-300"
                  >
                    Applications
                  </Link>
                </li>
              )}
              {user.role === 'dev' && (
                <li>
                  <Link
                    to="/dev/translations"
                    className="text-gray-300 hover:text-white transition duration-300"
                  >
                    Traductions
                  </Link>
                </li>
              )}
            </>
          )}
          <li>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{user.firstName} {user.lastName}</span>
                  <span className={`text-sm ${getRoleTextColor()}`}>({user.role})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition duration-300"
              >
                Connexion
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header; 