import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />

                {/* Protected */}
                <Route
                    path='/'
                    element={
                        <ProtectedRoute>
                            <App />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
