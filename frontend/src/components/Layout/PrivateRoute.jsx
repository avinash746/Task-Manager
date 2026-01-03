import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - User:', user);
  console.log('PrivateRoute - Loading:', loading);
  console.log('PrivateRoute - AdminOnly:', adminOnly);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    console.log('Admin only route, user is not admin, redirecting to tasks');
    return <Navigate to="/tasks" replace />;
  }

  return children;
};

export default PrivateRoute;