// // src/components/Signup.jsx
// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebaseConfig';
// import { loginWithGoogle } from '../utils/auth'; // ← make sure this is here
// import { useNavigate, Link } from 'react-router-dom';

// const Signup = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleSignup = async (e) => {
//         e.preventDefault();
//         setError('');
//         try {
//             await createUserWithEmailAndPassword(auth, email, password);
//             navigate('/');
//         } catch (err) {
//             if (err.code === 'auth/email-already-in-use') {
//                 setError(
//                     'That email is already registered. Please log in instead.'
//                 );
//             } else {
//                 setError('Signup failed: ' + err.message);
//             }
//         }
//     };

//     const handleGoogle = async () => {
//         setError('');
//         try {
//             await loginWithGoogle();
//             navigate('/');
//         } catch (err) {
//             setError('Google sign in failed: ' + err.message);
//         }
//     };

//     return (
//         <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4'>
//             <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg'>
//                 <div className='text-center mb-6'>
//                     <h1 className='text-4xl font-extrabold text-indigo-600 tracking-tight'>
//                         Symptom Tracker
//                     </h1>
//                     <p className='text-sm text-gray-500 mt-1'>
//                         Create your account to begin tracking
//                     </p>
//                 </div>

//                 {error && (
//                     <p className='text-red-500 text-sm mb-4 text-center'>
//                         {error}
//                     </p>
//                 )}

//                 {/* Google button */}
//                 <button
//                     type='button'
//                     onClick={handleGoogle}
//                     className='w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition mb-4'
//                 >
//                     Continue with Google
//                 </button>

//                 {/* Divider */}
//                 <div className='relative my-4'>
//                     <div className='border-t' />
//                     <span className='absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-gray-500'>
//                         or
//                     </span>
//                 </div>

//                 {/* Email + password form */}
//                 <form onSubmit={handleSignup} className='space-y-4'>
//                     <div>
//                         <label className='block font-medium mb-1 text-gray-700'>
//                             Email
//                         </label>
//                         <input
//                             type='email'
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                             className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
//                         />
//                     </div>

//                     <div>
//                         <label className='block font-medium mb-1 text-gray-700'>
//                             Password
//                         </label>
//                         <div className='relative'>
//                             <input
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
//                             />
//                             <button
//                                 type='button'
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className='absolute right-3 top-2 text-gray-500'
//                                 aria-label='Toggle password visibility'
//                             >
//                                 {showPassword ? '🙈' : '👁️'}
//                             </button>
//                         </div>
//                     </div>

//                     <button
//                         type='submit'
//                         className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition'
//                     >
//                         Sign Up
//                     </button>
//                 </form>

//                 <p className='text-center text-sm text-gray-600 mt-4'>
//                     Already have an account?{' '}
//                     <Link to='/login' className='text-blue-600 hover:underline'>
//                         Log in
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Signup;
// src/components/Signup.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { loginWithGoogle } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';
import AuthButtons from './AuthButtons'; // ✅ import

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError(
                    'That email is already registered. Please log in instead.'
                );
            } else {
                setError('Signup failed: ' + err.message);
            }
        }
    };

    const handleGoogle = async () => {
        setError('');
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Google sign in failed: ' + err.message);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4'>
            <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg'>
                <div className='text-center mb-6'>
                    <h1 className='text-4xl font-extrabold text-indigo-600 tracking-tight'>
                        Symptom Tracker
                    </h1>
                    <p className='text-sm text-gray-500 mt-1'>
                        Create your account to begin tracking
                    </p>
                </div>

                {error && (
                    <p className='text-red-500 text-sm mb-4 text-center'>
                        {error}
                    </p>
                )}

                {/* ✅ Shared Google button + divider */}
                <AuthButtons onGoogleClick={handleGoogle} />

                <form onSubmit={handleSignup} className='space-y-4'>
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
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition'
                    >
                        Sign Up
                    </button>
                </form>

                <p className='text-center text-sm text-gray-600 mt-4'>
                    Already have an account?{' '}
                    <Link to='/login' className='text-blue-600 hover:underline'>
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
