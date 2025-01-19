import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingPage from "../../pages/loading/LoadingPage"

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage/>;
  }

  return user ? <Navigate to="/contacts" replace /> : <>{children}</>;
};

export default PublicRoute;