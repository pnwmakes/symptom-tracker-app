// src/components/AuthHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = () => (
    <header className='pt-8 pb-4'>
        <Link
            to='/'
            aria-label='Home'
            className='block text-center select-none'
        >
            <h1 className='text-3xl font-extrabold tracking-tight text-indigo-600'>
                Symptom Tracker
            </h1>
        </Link>
        <p className='mt-1 text-center text-sm text-gray-500'>
            Track your health. Understand your patterns.
        </p>
    </header>
);

export default AuthHeader;
