import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';

const MOCK_POSTS = Array(7).fill(null).map((_, i) => ({
  id: `mock-${i}`,
  title: i === 0
    ? 'Elevate Your SEO Game Today'
    : ['Creating Engaging Social Media Content', 'The Power of Content Marketing',
       'Digital Strategy for Small Businesses', 'Measuring Success with Analytics',
       'Maximizing ROI in Digital Campaigns', 'Trends in Digital Marketing 2026'][i - 1],
  subtitle: i === 0 
    ? 'Discover effective SEO strategies that will boost your website visibility and drive organic traffic. Learn tips and tricks from our industry experts.'
    : 'Understand the importance of analytics to optimize campaigns for better results.',
  thumbnail: i === 0
    ? 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000'
    : `https://images.unsplash.com/photo-${[
        '1460925895917-afdab827c52f',
        '1551434678-e076c223a692',
        '1553877522-43269d4ea984',
        '1504868584819-f8e8b4b6d7e3',
        '1460925895917-afdab827c52f',
        '1518770660439-4636190af475',
      ][i - 1]}?auto=format&fit=crop&q=80&w=800`,
  createdAt: Date.now() - (i * 86400000 * 5),
  authorId: `author-${i}`,
  authorName: ['James Anderson', 'Emily Johnson', 'Michael Brown', 'Sarah Williams', 'David Anderson', 'Laura Davis', 'Richard Wilson'][i],
  authorTitle: ['SEO', 'Social', 'Content', 'Strategy', 'Analytics', 'ROI', 'Trends'][i],
  category: ['Trends', 'Social', 'Strategy', 'Strategy', 'Trends', 'Growth', 'Design'][i],
  views: [18245, 1200, 850, 4200, 1500, 3100, 2400][i],
}));

export const Home = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = 'Qalam Thirash | Blog Platform';
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'posts'), where('status', '==', 'published'), limit(21));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

        setPosts(fetched.length >= 2 ? fetched : MOCK_POSTS);
      } catch (err: any) {
        console.error('Posts fetch error:', err?.message || err);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full pb-20 relative z-10 font-sans pt-24">
      
      {/* Hero Header Banner */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
         <div className="w-full rounded-[2rem] overflow-hidden relative h-[500px] flex flex-col justify-end p-8 md:p-16">
            <div className="absolute inset-0 bg-[#001f3f]">
               <img 
                 src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
                 className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                 alt="Hero" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
               <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">Premium purchasing audio</span>
            </div>
            <div className="absolute top-6 right-6 md:top-8 md:right-8">
               <button className="px-4 py-2 rounded-full bg-white text-slate-900 text-[13px] font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors">
                 Explore <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
               </button>
            </div>

            <div className="relative z-10 max-w-3xl">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500 text-white text-[13px] font-bold mb-6">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 Blog insights
               </div>
               <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">Stories, systems, <br/> and ideas worth <br/> returning to.</h1>
               <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                 A full-stack blog platform with Google auth, post workflows, rich editing analytics, and a reading experience inspired by the best editorial products.
               </p>
            </div>

            <div className="absolute bottom-8 right-8 hidden md:flex bg-white/95 backdrop-blur-md rounded-2xl p-6 gap-8 shadow-xl">
               <div className="text-center px-2">
                  <div className="text-2xl font-black text-slate-900 mb-1">18K</div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">World views</div>
               </div>
               <div className="w-px bg-slate-200"></div>
               <div className="text-center px-2">
                  <div className="text-2xl font-black text-slate-900 mb-1">1.2K</div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Author</div>
               </div>
               <div className="w-px bg-slate-200"></div>
               <div className="text-center px-2">
                  <div className="text-2xl font-black text-slate-900 mb-1">98%</div>
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Approached</div>
               </div>
            </div>
         </div>
      </div>

      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0b63e5] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Featured Post */}
      {posts.length > 0 && !loading && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 w-full">
          <Link to={`/post/${posts[0].id}`} className="group flex flex-col lg:flex-row gap-12 items-center bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-[0_4px_30px_rgb(0,0,0,0.06)] cursor-pointer">
            <div className="w-full lg:w-[55%] rounded-3xl overflow-hidden bg-slate-100">
               {posts[0].thumbnail && (
                  <img src={posts[0].thumbnail} className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700" alt="Featured" />
               )}
            </div>
            
            <div className="w-full lg:w-[45%] lg:pr-8 py-4">
               <div className="flex items-center gap-3 text-[13px] font-bold text-slate-500 mb-6 uppercase tracking-wider">
                  <span className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">{posts[0].category || "Trends"}</span>
                  <span>{format(posts[0].createdAt || Date.now(), 'MMM dd, yyyy')}</span>
                  <span>• 4 mins</span>
               </div>
               
               <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight group-hover:text-orange-500 transition-colors">{posts[0].title}</h2>
               <p className="text-slate-500 text-lg leading-relaxed mb-10 max-w-xl font-medium">{posts[0].subtitle}</p>
               
               <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${posts[0].authorId}`} className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50" alt="Author" />
                     <div>
                        <p className="text-[15px] font-bold text-slate-900">{posts[0].authorName || 'James Anderson'}</p>
                        <p className="text-[13px] text-slate-500 font-medium">{posts[0].authorTitle || 'SEO'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-5 text-slate-400">
                     <span className="flex items-center gap-1.5 text-[15px] font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> 594</span>
                     <span className="flex items-center gap-1.5 text-[15px] font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg> 142</span>
                     <span className="flex items-center gap-1.5 text-[15px] font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg> 12</span>
                     <button className="hover:text-slate-900 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg></button>
                  </div>
               </div>
            </div>
          </Link>
        </div>
      )}

      {/* Main Content + Sidebar Area */}
      {posts.length > 1 && !loading && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left: Latest Posts */}
            <div className="flex-1">
               <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-4">
                  <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                     <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                     Latest posts
                  </h3>
                  <Link to="/search" className="text-[15px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">View all</Link>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.slice(1, 7).map((post, i) => (
                     <Link key={post.id} to={`/post/${post.id}`} className="group flex flex-col h-full cursor-pointer bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                        <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-100">
                           {post.thumbnail && (
                             <img src={post.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                           )}
                        </div>
                        
                        <div className="flex flex-col flex-1 px-1">
                           <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-4 uppercase tracking-wider">
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{post.category || 'Strategy'}</span>
                              <span>{format(post.createdAt || Date.now(), 'MMM dd, yyyy')}</span>
                              <span>• 4 mins</span>
                           </div>
                           
                           <h4 className="text-xl font-black text-slate-900 group-hover:text-orange-500 transition-colors mb-3 leading-snug line-clamp-2">{post.title}</h4>
                           <p className="text-slate-500 text-[15px] font-medium line-clamp-2 mb-6 flex-1 leading-relaxed">{post.subtitle}</p>
                           
                           <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-50">
                              <div className="flex items-center gap-3">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`} className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50" alt="Author" />
                                 <div>
                                    <p className="text-[13px] font-bold text-slate-900">{post.authorName || 'Staff Writer'}</p>
                                    <p className="text-[11px] text-slate-500 font-semibold uppercase">{post.authorTitle || 'Creator'}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 text-slate-400">
                                 <span className="flex items-center gap-1 text-[13px] font-semibold"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> {post.views || 245}</span>
                                 <button className="hover:text-slate-900 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg></button>
                              </div>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>

            {/* Right: Sidebar */}
            <div className="w-full lg:w-[380px] shrink-0 space-y-8">
               
               {/* Trending */}
               <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                     <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                     Trending
                  </h3>
                  <div className="space-y-8">
                     {[1, 2, 3].map(num => (
                        <div key={num} className="flex gap-5 group cursor-pointer">
                           <div className="text-4xl font-black text-orange-400/30 group-hover:text-orange-400 transition-colors mt-1">{num}</div>
                           <div>
                              <h4 className="font-bold text-slate-900 text-[16px] mb-2 leading-snug group-hover:text-blue-600 transition-colors">{MOCK_POSTS[num-1]?.title}</h4>
                              <p className="text-[13px] text-slate-500 font-semibold">{MOCK_POSTS[num-1]?.views?.toLocaleString() || '18,245'} views</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Author Spotlight */}
               <div className="bg-[#00142c] rounded-3xl p-10 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                     <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                  </div>
                  <div className="relative z-10">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                     </div>
                     <h3 className="text-3xl font-black mb-4 tracking-tight">Author spotlight</h3>
                     <p className="text-white/60 text-[15px] mb-8 leading-relaxed font-medium">View authors, follow profiles, save posts, and get real-time notifications when someone posts more.</p>
                     <a href="#" className="inline-flex items-center gap-2 text-orange-400 font-bold text-[15px] hover:text-orange-300 transition-colors">
                        Meet James Anderson <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                     </a>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Explore Categories */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3 mb-10">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            Explore categories
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Strategy', posts: 18, desc: 'SEO friendly collection with UI/UX typography support.' },
              { name: 'Engineering', posts: 22, desc: 'SEO friendly collection with UI/UX typography support.' },
              { name: 'Design', posts: 10, desc: 'SEO friendly collection with UI/UX typography support.' },
              { name: 'Growth', posts: 11, desc: 'SEO friendly collection with UI/UX typography support.' }
            ].map(cat => (
               <div key={cat.name} className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="text-[12px] font-bold text-orange-500 mb-6 uppercase tracking-wider">{cat.posts} posts</div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{cat.name}</h4>
                  <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{cat.desc}</p>
               </div>
            ))}
         </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
               <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 mx-auto lg:mx-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Weekly editorial signal, no noise.</h2>
               <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto lg:mx-0">Newsletter subscriptions are secured in 1 state and transit for your email provider.</p>
            </div>
            <div className="w-full lg:w-auto shrink-0">
               <div className="flex items-center bg-[#f9fafb] rounded-full p-2 border border-slate-200 w-full max-w-md mx-auto focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                  <input type="email" placeholder="your@example.com" className="bg-transparent border-none outline-none px-6 text-[15px] font-medium w-full text-slate-700 placeholder:text-slate-400" />
                  <button className="bg-black hover:bg-slate-800 text-white text-[15px] font-bold px-8 py-4 rounded-full whitespace-nowrap transition-colors shadow-sm">
                     Subscribe
                  </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};
