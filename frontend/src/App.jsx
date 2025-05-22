import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminHome from './pages/admin/Home';
import UserManagement from './pages/admin/UserManagement';
import POHome from './pages/po/Home';
import DevHome from './pages/dev/Home';
import Navbar from './components/layout/Navbar';

// Composant pour rediriger en fonction du rôle
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" />;
    case 'po':
      return <Navigate to="/po/dashboard" />;
    case 'dev':
      return <Navigate to="/dev/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
};

// Composant pour protéger les routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Redirection basée sur le rôle */}
        <Route path="/" element={<RoleBasedRedirect />} />
        
        {/* Routes admin */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes PO */}
        <Route 
          path="/po/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['po']}>
              <POHome />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes Dev */}
        <Route 
          path="/dev/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['dev']}>
              <DevHome />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
