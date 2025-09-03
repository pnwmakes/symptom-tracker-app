// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u || null);
            setChecking(false);
        });
        return () => unsub();
    }, []);

    if (checking) {
        return <div className='p-6 text-center'>Loading…</div>;
    }

    return user ? children : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
