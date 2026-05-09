import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export const Navbar = () => {
  const { user, userData } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/#categories', hasDropdown: true },
    { name: 'Featured', path: '/#featured', hasDropdown: false },
    { name: 'Trending', path: '/#trending' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <>
      <nav className="h-20 glass border-b-0 sticky top-0 px-4 sm:px-6 lg:px-8 flex items-center shrink-0 w-full z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          
          <Link to="/" className="flex items-center gap-3 text-white font-heading font-black text-2xl tracking-tighter z-50 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#b026ff] flex items-center justify-center shadow-lg shadow-[#b026ff]/30 group-hover:shadow-[#00f0ff]/50 transition-all duration-300">
               <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
               </svg>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">QalamFlow</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 ml-8">
            {navLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.path}
                className="font-medium text-gray-300 hover:text-white hover:text-glow transition-all duration-300 flex items-center gap-1.5 text-[15px]"
              >
                {link.name}
                {link.hasDropdown && (
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4 hidden sm:flex">
                {userData?.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-4 ml-2 border-l border-white/10">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-white tracking-wide">{userData?.name || 'User'}</p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest">{userData?.role || 'Member'}</p>
                  </div>
                  <div className="relative group cursor-pointer" onClick={handleLogout} title="Click to logout">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#b026ff] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                    <img src={userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="relative w-10 h-10 rounded-full bg-dark-card border-2 border-transparent object-cover z-10" alt="Profile" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                 <button onClick={handleLogin} className="text-[15px] font-semibold text-gray-300 hover:text-white transition-colors">
                   Log in
                 </button>
                 <button onClick={handleLogin} className="relative group px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-semibold text-[15px] overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#00f0ff] to-[#b026ff] opacity-0 group-hover:opacity-20 transition-opacity"></span>
                    <span className="absolute -inset-[100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00f0ff_0%,transparent_50%,#b026ff_100%)] opacity-0 group-hover:opacity-100 mix-blend-overlay"></span>
                    <span className="relative z-10">Sign up</span>
                 </button>
              </div>
            )}
            
            <button 
               className="lg:hidden p-2 text-gray-300 hover:text-white"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
               </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-[#0a0a0a]/95 backdrop-blur-xl z-40 px-4 py-6 border-t border-white/10 flex flex-col h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="flex flex-col gap-4 mb-8">
             {navLinks.map((link, i) => (
                <a key={i} href={link.path} onClick={() => setMobileMenuOpen(false)} className="font-semibold text-white text-xl py-3 border-b border-white/5">
                  {link.name}
                </a>
             ))}
          </div>
          
          <div className="mt-auto flex flex-col gap-4">
             {user ? (
                <>
                  <div className="flex items-center gap-4 py-4 border-b border-white/10 mb-2">
                     <img src={userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="w-14 h-14 rounded-full border-2 border-[#b026ff]" alt="Profile" />
                     <div>
                        <p className="font-bold text-white text-lg">{userData?.name || 'User'}</p>
                        <p className="text-sm text-gray-400">{userData?.email}</p>
                     </div>
                  </div>
                  {userData?.role === 'admin' && (
                     <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-white py-3 text-center bg-white/5 rounded-xl border border-white/10">Admin Panel</Link>
                  )}
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-white py-3 text-center bg-white/5 rounded-xl border border-white/10">Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="font-semibold text-rose-500 py-3 text-center bg-rose-500/10 rounded-xl border border-rose-500/20">Log out</button>
                </>
             ) : (
                <>
                  <button onClick={() => { handleLogin(); setMobileMenuOpen(false); }} className="w-full text-lg font-semibold text-white py-3 rounded-xl bg-white/5 border border-white/10">
                    Log in
                  </button>
                  <button onClick={() => { handleLogin(); setMobileMenuOpen(false); }} className="w-full text-lg font-semibold text-white bg-gradient-to-r from-[#00f0ff] to-[#b026ff] py-3 rounded-xl shadow-[0_0_20px_rgba(176,38,255,0.4)]">
                    Sign up
                  </button>
                </>
             )}
          </div>
        </div>
      )}
    </>
  );
};
