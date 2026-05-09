import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';

export const AuthPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" />;

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative min-h-[calc(100vh-5rem)] overflow-hidden z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#00f0ff]/10 to-[#b026ff]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff] to-[#b026ff] rounded-[2rem] blur-xl opacity-20 animate-pulse"></div>
        <div className="glass-card p-10 rounded-[2rem] text-center space-y-10 relative z-10">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00f0ff] to-[#b026ff] rounded-2xl mx-auto flex items-center justify-center rotate-3 shadow-[0_0_30px_rgba(176,38,255,0.4)] hover:rotate-12 transition-all duration-500 cursor-default">
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-heading font-black text-white tracking-tight mb-3 text-glow">QALAMFLOW</h1>
              <p className="text-gray-400 font-light text-lg">Authenticate to sync your neural pathways with the community.</p>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="group relative w-full flex items-center justify-center gap-4 px-6 py-4 bg-[#0a0a0a] border border-white/10 hover:border-[#00f0ff]/50 rounded-2xl font-bold text-white transition-all overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#00f0ff]/10 to-[#b026ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg className="w-6 h-6 relative z-10" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span className="relative z-10 tracking-wide text-lg">Initialize via Google</span>
          </button>

          <p className="text-xs text-gray-500 font-mono tracking-wider">
            ENCRYPTION SECURED. BY PROCEEDING YOU ACCEPT THE PROTOCOLS.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
