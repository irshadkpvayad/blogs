import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export const Navbar = () => {
  const { user, userData } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Services', path: '/#services', hasDropdown: true },
    { name: 'Blog', path: '/#blog', hasDropdown: true },
    { name: 'Pages', path: '/#pages', hasDropdown: true },
  ];

  return (
    <>
      <nav className={`z-50 transition-all duration-300 ${
        scrolled 
          ? 'fixed top-4 left-4 right-4 max-w-7xl mx-auto bg-white/95 backdrop-blur-md shadow-[0_10px_40px_rgb(0,0,0,0.15)] rounded-2xl border border-slate-100 py-3 px-4 sm:px-6 lg:px-8'
          : 'absolute top-0 w-full pt-6 px-4 sm:px-6 lg:px-8'
      }`}>
        <div className={`mx-auto flex items-center justify-between ${scrolled ? 'w-full' : 'max-w-7xl'}`}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight z-50 shrink-0">
            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
              <span className="text-[#001f3f] text-xs font-black tracking-tighter">Q</span>
            </div>
            <span className={`uppercase tracking-widest text-lg transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>QALAM THIRASH</span>
          </Link>

          {/* Desktop Center Nav */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.path}
                className={`font-bold transition-colors flex items-center gap-1.5 text-[15px] ${
                  scrolled ? 'text-slate-600 hover:text-orange-500' : 'text-white/90 hover:text-orange-400'
                }`}
              >
                {link.name}
                {link.hasDropdown && (
                  <svg className={`w-4 h-4 ${scrolled ? 'text-slate-400' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-3 ml-auto">

            {user ? (
              /* ── Logged-in (desktop) ── */
              <div className="hidden sm:flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-full border text-sm font-bold transition-colors ${
                    scrolled 
                      ? 'border-slate-200 text-slate-700 hover:bg-slate-50' 
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="cursor-pointer" onClick={handleLogout} title="Click to log out">
                  <img
                    src={userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    className="w-9 h-9 rounded-full bg-slate-800 object-cover border-2 border-white/20 hover:border-orange-400 transition-colors"
                    alt="Profile"
                  />
                </div>
              </div>
            ) : (
              /* ── Logged-out (desktop) ── */
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={handleLogin}
                  className={`px-4 py-2 font-bold text-[14px] transition-colors ${
                    scrolled ? 'text-slate-700 hover:text-orange-500' : 'text-white hover:text-orange-400'
                  }`}
                >
                  Log in
                </button>
                <button
                  onClick={handleLogin}
                  className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-[14px] transition-colors shadow-sm"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Hamburger (mobile only) */}
            <button
              className={`lg:hidden p-2 ${scrolled ? 'text-slate-800' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 bg-[#001f3f] z-40 px-6 pt-24 pb-8 flex flex-col h-screen overflow-y-auto">

          {/* Nav links */}
          <div className="flex flex-col gap-1 mb-8">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-white text-xl py-3 border-b border-white/10"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Auth section at bottom */}
          <div className="mt-auto flex flex-col gap-3">
            {user ? (
              <>
                {/* User info card */}
                <div className="flex items-center gap-4 py-4 border-b border-white/10 mb-1">
                  <img
                    src={userData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    className="w-14 h-14 rounded-full border-2 border-orange-400"
                    alt="Profile"
                  />
                  <div>
                    <p className="font-bold text-white text-lg">{userData?.name || 'User'}</p>
                    <p className="text-sm text-white/60">{userData?.email}</p>
                    <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                      {userData?.role || 'member'}
                    </span>
                  </div>
                </div>

                {/* Admin Panel button — visible only to admins */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 font-bold text-white py-3 bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-semibold text-white py-3 text-center bg-white/5 rounded-xl border border-white/10"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="font-semibold text-rose-400 py-3 bg-rose-500/10 rounded-xl border border-rose-500/20"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                  className="w-full text-lg font-semibold text-white py-3 rounded-xl bg-white/5 border border-white/10"
                >
                  Log in
                </button>
                <button
                  onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                  className="w-full text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 py-3 rounded-xl transition-colors"
                >
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
