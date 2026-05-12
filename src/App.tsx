/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, handleFirestoreError, OperationType } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';
import { api } from './lib/api';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { AdminPanel } from './pages/Admin';
import { PostView } from './pages/PostView';
import { Dashboard } from './pages/Dashboard';
import { DynamicPage } from './pages/DynamicPage';
import { Toaster } from 'sonner';

import { Search } from './pages/Search';
import { AuthPage } from './pages/Auth';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const { setUser, fetchUserData, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          await api.post('/api/users', {});
          await fetchUserData(user.uid);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [setUser, fetchUserData, setLoading]);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#f2f8fc] text-slate-900 font-sans overflow-x-hidden selection:bg-[#0b63e5] selection:text-white">
        <Toaster position="top-center" theme="light" />
        <Navbar />
        <main className="flex-1 flex flex-col w-full mx-auto relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/post/:id" element={<PostView />} />
            <Route path="/p/:slug" element={<DynamicPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
