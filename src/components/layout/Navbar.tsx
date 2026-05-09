import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export const Navbar = () => {
  const { user, userData } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services', hasDropdown: true },
    { name: 'Blog', path: '/#blog', hasDropdown: true },
    { name: 'Pages', path: '/#pages', hasDropdown: true },
  ];

  return (
    <>
      <nav className="absolute top-0 w-full z-50 pt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2 text-orange-400 font-bold text-2xl tracking-tight z-50">
            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
               <div className="w-3 h-3 bg-[#001f3f] rounded-sm transform rotate-45"></div>
            </div>
            <span>Digitro</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.path}
                className="font-medium text-white hover:text-orange-400 transition-colors flex items-center gap-1.5 text-[15px]"
              >
                {link.name}
                {link.hasDropdown && (
                  <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button className="text-white hover:text-orange-400 hidden sm:block">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </button>
            
            {user ? (
              <div className="flex items-center gap-4 hidden sm:flex">
                <Link to="/dashboard" className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-medium">
                  Dashboard
                </Link>
                <div className="relative group cursor-pointer" onClick={handleLogout} title="Click to logout">
                  <img src={userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="w-9 h-9 rounded-full bg-slate-800 object-cover border border-white/20" alt="Profile" />
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center">
                 <button onClick={handleLogin} className="px-6 py-2 rounded-full border border-white/20 text-white font-medium text-[14px] hover:bg-white/10 transition-all backdrop-blur-sm">
                    Contact us
                 </button>
              </div>
            )}
            
            <button 
               className="lg:hidden p-2 text-white"
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
        <div className="lg:hidden fixed inset-0 top-0 bg-[#001f3f] z-40 px-4 pt-24 pb-6 flex flex-col h-screen overflow-y-auto">
          <div className="flex flex-col gap-4 mb-8">
             {navLinks.map((link, i) => (
                <a key={i} href={link.path} onClick={() => setMobileMenuOpen(false)} className="font-semibold text-white text-xl py-3 border-b border-white/10">
                  {link.name}
                </a>
             ))}
          </div>
          
          <div className="mt-auto flex flex-col gap-4">
             {user ? (
                <>
                  <div className="flex items-center gap-4 py-4 border-b border-white/10 mb-2">
                     <img src={userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="w-14 h-14 rounded-full" alt="Profile" />
                     <div>
                        <p className="font-bold text-white text-lg">{userData?.name || 'User'}</p>
                        <p className="text-sm text-gray-400">{userData?.email}</p>
                     </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-white py-3 text-center bg-white/5 rounded-xl border border-white/10">Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="font-semibold text-rose-400 py-3 text-center bg-rose-500/10 rounded-xl">Log out</button>
                </>
             ) : (
                <button onClick={() => { handleLogin(); setMobileMenuOpen(false); }} className="w-full text-lg font-semibold text-white py-3 rounded-xl border border-white/20">
                  Contact us
                </button>
             )}
          </div>
        </div>
      )}
    </>
  );
};
