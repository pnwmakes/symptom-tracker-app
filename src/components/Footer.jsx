import React from 'react';
import { Link } from 'react-router-dom';

const year = new Date().getFullYear();
// Optional: expose a version via Vite env, e.g. VITE_APP_VERSION=0.1.0
const version = import.meta.env.VITE_APP_VERSION;

const Footer = () => {
    return (
        <footer className='mt-12 pb-8 pt-6 text-center text-xs text-gray-500'>
            <div className='flex flex-col items-center gap-2'>
                <div>
                    © {year}{' '}
                    <span className='font-semibold text-gray-600'>
                        Symptom Tracker
                    </span>
                    {version ? (
                        <span className='ml-2'>• v{version}</span>
                    ) : null}
                </div>
                <div className='flex items-center gap-4'>
                    <Link to='#' className='hover:text-gray-700'>
                        Privacy
                    </Link>
                    <span aria-hidden='true'>•</span>
                    <Link to='#' className='hover:text-gray-700'>
                        Terms
                    </Link>
                    <span aria-hidden='true'>•</span>
                    <Link to='#' className='hover:text-gray-700'>
                        Support
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
