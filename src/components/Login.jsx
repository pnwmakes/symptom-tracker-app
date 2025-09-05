import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { loginWithGoogle } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import AuthButtons from './AuthButtons';
import AuthHeader from './AuthHeader';
import Footer from './Footer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) navigate('/');
        });
        return () => unsub();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Login failed: ' + err.message);
        }
    };

    const handleDemoLogin = async () => {
        setError('');
        try {
            await signInWithEmailAndPassword(
                auth,
                'demo@symptomtracker.com',
                'Demo123!'
            );
            navigate('/');
        } catch (err) {
            setError('Demo login failed: ' + err.message);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Google login failed: ' + err.message);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 px-4'>
            <AuthHeader />

            <div className='w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg'>
                <h2 className='text-2xl font-bold mb-6 text-center text-indigo-600'>
                    Login
                </h2>

                {error && (
                    <p className='text-red-500 text-sm mb-4 text-center'>
                        {error}
                    </p>
                )}

                {/* Google Sign-In */}
                <AuthButtons onGoogleClick={handleGoogleLogin} />

                {/* Email + Password Form */}
                <form onSubmit={handleLogin} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium'>
                            Email
                        </label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='w-full border border-gray-300 rounded px-3 py-2'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium'>
                            Password
                        </label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='w-full border border-gray-300 rounded px-3 py-2'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition'
                    >
                        Log In
                    </button>
                </form>

                {/* Demo Login */}
                <div className='mt-6 text-center'>
                    <p className='text-sm text-gray-600 mb-2'>
                        Or try it instantly:
                    </p>
                    <button
                        onClick={handleDemoLogin}
                        className='bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded shadow'
                    >
                        Demo Login
                    </button>
                </div>

                {/* Sign up link */}
                <p className='text-center text-sm text-gray-600 mt-6'>
                    Don’t have an account?{' '}
                    <Link
                        to='/signup'
                        className='text-blue-600 hover:underline'
                    >
                        Sign up
                    </Link>
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
