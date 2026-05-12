import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';

export const AuthPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle the redirect result when user comes back from Google
  useEffect(() => {
    setLoading(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate('/');
        }
      })
      .catch((err) => {
        console.error('Redirect result error:', err);
        setError('Login failed. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (user) return <Navigate to="/" />;

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      // Try popup first; fall back to redirect if blocked
      try {
        await signInWithPopup(auth, provider);
        navigate('/');
      } catch (popupErr: any) {
        // popup-blocked or closed-by-user → use redirect
        if (
          popupErr.code === 'auth/popup-blocked' ||
          popupErr.code === 'auth/popup-closed-by-user' ||
          popupErr.code === 'auth/cancelled-popup-request'
        ) {
          await signInWithRedirect(auth, provider);
        } else {
          throw popupErr;
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Make sure this domain is authorized in Firebase.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 pt-24 relative min-h-[calc(100vh-5rem)] bg-[#f2f8fc]">
      
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.07)] border border-slate-100 text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-orange-400 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
             <span className="text-[#001f3f] text-2xl font-black tracking-tighter">Q</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome to QALAM THIRASH</h1>
            <p className="text-slate-500 text-[15px]">Sign in to manage your account and read exclusive content.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-white border-2 border-slate-100 hover:border-[#0b63e5]/30 hover:bg-[#0b63e5]/5 rounded-2xl font-bold text-slate-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-300 border-t-[#0b63e5] rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
          )}
          <span className="tracking-wide text-[15px]">
            {loading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>

        <p className="text-[13px] text-slate-400">
          By proceeding, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
