import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Public Route Component
 * Redirects authenticated users to the dashboard
 */
const PublicRoute = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
        // Redirect to dashboard if already logged in
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;
