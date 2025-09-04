// import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className='p-6 text-center'>Loading…</div>;
    }
    return user ? children : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
