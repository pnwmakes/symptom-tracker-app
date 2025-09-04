import React from 'react';
import { auth } from '../firebaseConfig';
import { logoutUser } from '../utils/auth';

const Header = () => {
    const user = auth.currentUser;
    const isDemoUser = user?.email === 'demo@symptomtracker.com';

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <header className='flex items-center justify-between px-6 py-3 border-b bg-white/90 backdrop-blur shadow-sm'>
            <h1 className='text-xl font-bold text-indigo-600'>
                Symptom Tracker
            </h1>

            {user ? (
                <div className='flex items-center gap-3'>
                    {/* Avatar if available */}
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

                        {/* ✅ Demo badge */}
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
