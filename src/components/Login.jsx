import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    return (
        <div className='max-w-md mx-auto mt-20 bg-white p-8 shadow-lg rounded-lg'>
            <h2 className='text-2xl font-bold mb-6 text-center text-indigo-600'>
                Login
            </h2>
            {error && (
                <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>
            )}
            <form onSubmit={handleLogin} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium'>Email</label>
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
        </div>
    );
};

export default Login;
