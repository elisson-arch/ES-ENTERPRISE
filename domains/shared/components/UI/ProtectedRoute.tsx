import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@shared';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAppContext();
  const location = useLocation();

  if (loading) return null; // Or a loader

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
