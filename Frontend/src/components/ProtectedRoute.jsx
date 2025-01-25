import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        // Si no está autenticado, redirigir al login
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Si está autenticado, renderizar los hijos
    return children;
};

export default ProtectedRoute;