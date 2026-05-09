import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const Home = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "QalamFlow - Writings from the future";
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'posts'), 
          where('status', '==', 'published'), 
          orderBy('createdAt', 'desc'), 
          limit(21)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(fetched);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full pb-20 relative z-10">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-heading font-black tracking-tighter mb-8"
          >
            Discover <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#b026ff] to-[#00f0ff] animate-[gradient_8s_linear_infinite] bg-[length:200%_auto]">Extraordinary</span> Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto mb-12"
          >
            The next generation platform for writers, thinkers, and visionaries. Explore ideas that shape tomorrow.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="relative group px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg overflow-hidden backdrop-blur-xl hover:scale-105 transition-transform duration-300">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#00f0ff] to-[#b026ff] opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <span className="relative z-10 text-glow">Start Reading Now</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Header Image */}
      {posts.length > 0 && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Link to={`/post/${posts[0].id}`} className="block relative w-full h-[500px] lg:h-[650px] rounded-[2rem] overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 cursor-pointer">
              {posts[0].thumbnail ? (
                 <img src={posts[0].thumbnail} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" alt="Feature" />
              ) : (
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"></div>
              )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
            
            <div className="absolute bottom-12 left-8 sm:bottom-16 sm:left-16 max-w-4xl pr-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#00f0ff] font-semibold text-sm mb-6 tracking-wider uppercase shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                Featured Edition
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-black text-white leading-[1.1] mb-6 line-clamp-3 group-hover:text-glow transition-all duration-300">{posts[0].title}</h2>
              <p className="text-gray-300 text-lg sm:text-xl md:text-2xl line-clamp-2 md:line-clamp-3 font-light max-w-3xl">{posts[0].subtitle}</p>
            </div>
            
            <div className="absolute top-1/2 right-8 sm:right-16 -translate-y-1/2 hidden lg:flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-110">
              <svg className="w-8 h-8 text-white group-hover:text-[#00f0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        </div>
      )}

      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex justify-center">
          <div className="w-16 h-16 border-4 border-white/10 border-t-[#00f0ff] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Grid of posts */}
      {posts.length > 1 && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
           <div className="flex items-center justify-between mb-12">
             <h3 className="text-3xl md:text-4xl font-heading font-bold text-white flex items-center gap-4">
                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-[#00f0ff] to-[#b026ff]"></span>
                Latest Transmissions
             </h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post, i) => (
                 <motion.div
                   key={post.id}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                 >
                   <Link to={`/post/${post.id}`} className="group flex flex-col h-full rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-[0_10px_40px_-15px_rgba(0,240,255,0.3)] overflow-hidden neon-border">
                      <div className="w-full aspect-[16/10] overflow-hidden relative bg-gray-900 shrink-0">
                          {post.thumbnail ? (
                            <img src={post.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1000ms] opacity-80 group-hover:opacity-100" alt={post.title} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                      </div>
                      <div className="flex-1 flex flex-col p-6 relative">
                         <h4 className="text-2xl font-heading font-bold text-white group-hover:text-[#00f0ff] transition-colors mb-4 line-clamp-2">{post.title}</h4>
                         <p className="text-gray-400 line-clamp-3 mb-8 flex-1 text-base font-light">{post.subtitle}</p>
                         
                         <div className="flex items-center gap-4 mt-auto shrink-0 border-t border-white/5 pt-4">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`} className="w-10 h-10 rounded-full border border-white/20 shrink-0" alt="Author" />
                            <div>
                               <p className="text-sm font-semibold text-gray-200">System Architect</p>
                               <p className="text-xs text-gray-500 font-mono tracking-wider">{format(post.createdAt || Date.now(), 'dd MMM yyyy')}</p>
                            </div>
                        </div>
                      </div>
                   </Link>
                 </motion.div>
              ))}
           </div>
           
           <div className="flex justify-center mt-20">
              <button className="px-8 py-3 rounded-full border border-white/10 text-gray-300 font-medium hover:text-white hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all duration-300 tracking-wide backdrop-blur-sm">
                 Load More Data...
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
