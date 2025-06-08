// src/components/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            navigate('/');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 p-6'>
            <div className='w-full max-w-md bg-white shadow-md rounded-lg p-6'>
                <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                    Log In
                </h2>
                <form onSubmit={handleLogin} className='space-y-4'>
                    <input
                        type='email'
                        placeholder='Email'
                        className='w-full p-2 border border-gray-300 rounded'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        className='w-full p-2 border border-gray-300 rounded'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type='submit'
                        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200'
                    >
                        Log In
                    </button>
                </form>
                <p className='text-sm mt-4 text-center text-gray-700'>
                    Don’t have an account?{' '}
                    <Link to='/signup' className='text-blue-600 underline'>
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
