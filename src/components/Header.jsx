import React from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../utils/auth';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
    const { user } = useAuth();
    const isDemoUser = user?.email === 'demo@symptomtracker.com';

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <header className='sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b bg-white/90 backdrop-blur shadow-sm'>
            {/* ✅ App title (clickable home) */}
            <Link to='/' aria-label='Go to home' className='select-none'>
                <span className='text-2xl font-extrabold tracking-tight text-indigo-600'>
                    Symptom Tracker
                </span>
            </Link>

            {user ? (
                <div className='flex items-center gap-3'>
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt='User avatar'
                            className='w-8 h-8 rounded-full border'
                            referrerPolicy='no-referrer'
                        />
                    ) : null}

                    <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-700'>
                            {user.displayName || user.email}
                        </span>
                        {isDemoUser && (
                            <span className='bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded'>
                                Demo
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded'
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <div className='text-sm text-gray-500'>Not signed in</div>
            )}
        </header>
    );
};

export default Header;
