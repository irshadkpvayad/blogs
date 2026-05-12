import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export const Navbar = () => {
  const { user, userData } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => navigate('/auth');
  const handleLogout = async () => await signOut(auth);
  const isAdmin = userData?.role === 'admin';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Growth', path: '/#growth' },
    { name: 'Strategy', path: '/#strategy' },
  ];

  return (
    <>
      <nav className={`fixed z-50 transition-all duration-300 ${
        scrolled 
          ? 'top-4 left-4 right-4 max-w-[1400px] mx-auto bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-3xl border border-slate-100 py-3 px-6'
          : 'top-0 left-0 right-0 w-full bg-white/90 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-100/50'
      }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight z-50 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center shadow-sm">
              <span className="text-orange-500 text-[14px] font-black leading-none">Q</span>
            </div>
            <span className="text-slate-900 font-black tracking-tight">Qalam Thirash</span>
          </Link>

          {/* Center Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <a key={i} href={link.path} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <form onSubmit={handleSearch} className="flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-full px-3 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:shadow-sm transition-all border border-transparent focus-within:border-orange-500/30">
                 <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all px-2 text-slate-700 placeholder:text-slate-400 font-medium"
                 />
                 <button type="submit" className="text-slate-400 hover:text-orange-500 transition-colors p-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </button>
              </form>
            </div>

            {user ? (
              <div className="relative">
                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-2 focus:outline-none">
                  <img src={user.photoURL || userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="w-10 h-10 rounded-full object-cover border border-slate-200 hover:border-slate-400 transition-colors" alt="Profile" />
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
                        <img src={user.photoURL || userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} className="w-11 h-11 rounded-full border border-slate-200 object-cover shrink-0" alt="Profile" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-900 text-sm truncate">{userData?.name || 'User'}</p>
                          <p className="text-xs text-slate-500 truncate">{userData?.email}</p>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link to="/dashboard" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" /></svg> Dashboard
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-slate-100" />
                        <button onClick={() => { handleLogout(); setProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={handleLogin} className="px-6 py-2.5 rounded-full bg-black text-white text-[13px] font-bold shadow-sm hover:bg-slate-800 transition-colors">
                Login
              </button>
            )}

            <button className="lg:hidden p-2 text-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 bg-white z-40 px-6 pt-24 pb-8 flex flex-col h-screen overflow-y-auto">
          <div className="flex flex-col gap-2 mb-8">
            <form onSubmit={handleSearch} className="flex items-center bg-slate-100 rounded-full px-4 py-3 mb-4 focus-within:ring-2 focus-within:ring-orange-500/20">
               <input 
                  type="text" 
                  placeholder="Search posts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[15px] w-full text-slate-700 placeholder:text-slate-400 font-medium"
               />
               <button type="submit" className="text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </button>
            </form>
            {navLinks.map((link, i) => (
              <a key={i} href={link.path} onClick={() => setMobileMenuOpen(false)} className="font-bold text-slate-900 text-xl py-3 border-b border-slate-100">
                {link.name}
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-3">
             {!user && (
                 <button onClick={() => { handleLogin(); setMobileMenuOpen(false); }} className="w-full text-lg font-bold text-white bg-black py-4 rounded-2xl">
                   Login
                 </button>
             )}
          </div>
        </div>
      )}
    </>
  );
};

