// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <nav className='flex justify-between items-center bg-gray-100 p-4 mb-6 rounded'>
            <Link to='/' className='font-bold text-xl'>
                🩺 Symptom Tracker
            </Link>
            <div className='space-x-4'>
                {!user ? (
                    <>
                        <Link to='/login' className='text-blue-600'>
                            Login
                        </Link>
                        <Link to='/signup' className='text-blue-600'>
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className='text-red-500'>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
