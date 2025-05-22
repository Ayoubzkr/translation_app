import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import POHome from '../pages/po/Home';
import DevHome from '../pages/dev/Home';
import AdminHome from '../pages/admin/Home';
import UserManagement from '../pages/admin/UserManagement';
import { getToken, getUserRole } from '../utils/auth';

// Route guard pour vérifier l'authentification
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const userRole = getUserRole();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/po/dashboard',
    element: (
      <PrivateRoute allowedRoles={['po', 'admin']}>
        <POHome />
      </PrivateRoute>
    ),
  },
  {
    path: '/dev/dashboard',
    element: (
      <PrivateRoute allowedRoles={['dev', 'admin']}>
        <DevHome />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminHome />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <UserManagement />
      </PrivateRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Accès non autorisé</h1>
          <p className="mt-4 text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    ),
  },
]);

export default router; 