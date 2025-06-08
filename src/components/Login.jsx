import React, { useState } from 'react';
import {
    signInWithEmailAndPassword,
    browserLocalPersistence,
    browserSessionPersistence,
    setPersistence,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const persistenceType = rememberMe
            ? browserLocalPersistence
            : browserSessionPersistence;

        try {
            await setPersistence(auth, persistenceType);
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            alert('Login failed: ' + err.message);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4'>
            <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg'>
                {/* Branding */}
                <div className='text-center mb-6'>
                    <h1 className='text-4xl font-extrabold text-indigo-600 tracking-tight'>
                        Symptom Tracker
                    </h1>
                    <p className='text-sm text-gray-500 mt-1'>
                        Track your health. Understand your patterns.
                    </p>
                </div>

                <form onSubmit={handleLogin} className='space-y-4'>
                    <div>
                        <label className='block font-medium mb-1 text-gray-700'>
                            Email
                        </label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>

                    <div>
                        <label className='block font-medium mb-1 text-gray-700'>
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-2 text-gray-500'
                                aria-label='Toggle password visibility'
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-5s1.908-2.45 5.25-3.675m13.5 3.675S18.092 14.55 14.75 13.325M12 9a3 3 0 013 3 3 3 0 01-3 3m0 0a3 3 0 01-3-3 3 3 0 013-3m0 0a3 3 0 013 3'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M15 12a3 3 0 01-3 3m0 0a3 3 0 01-3-3m3 3a3 3 0 003-3 3 3 0 00-3-3m0 0a3 3 0 00-3 3 3 3 0 006 0m1.5-2.5l2.121 2.121M4.222 4.222L19.778 19.778'
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <input
                            type='checkbox'
                            id='remember'
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className='form-checkbox rounded text-blue-600'
                        />
                        <label htmlFor='remember'>Remember me</label>
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition'
                    >
                        Log In
                    </button>
                </form>

                <p className='text-center text-sm text-gray-600 mt-4'>
                    Don’t have an account?{' '}
                    <Link
                        to='/signup'
                        className='text-blue-600 hover:underline'
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
