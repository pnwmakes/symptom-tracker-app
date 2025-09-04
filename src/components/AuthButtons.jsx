import React, { useState } from 'react';

export default function AuthButtons({
    onGoogleClick,
    showDivider = true,
    className = '',
}) {
    const [loading, setLoading] = useState(false);

    const handleGoogle = async () => {
        if (!onGoogleClick) return;
        try {
            setLoading(true);
            await onGoogleClick();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={className}>
            <button
                type='button'
                onClick={handleGoogle}
                disabled={loading}
                className={`w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition ${
                    loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                aria-busy={loading}
            >
                {loading ? 'Signing in…' : 'Continue with Google'}
            </button>

            {showDivider && (
                <div className='relative my-4'>
                    <div className='border-t' />
                    <span className='absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-gray-500'>
                        or
                    </span>
                </div>
            )}
        </div>
    );
}
