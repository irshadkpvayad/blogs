import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const Home = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog Insights | Digitro";
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
        
        // If we don't have enough posts for the layout, let's mock some for demonstration
        if (fetched.length < 7) {
           const mocks = Array(10).fill(null).map((_, i) => ({
             id: `mock-${i}`,
             title: i === 0 ? "Elevate Your SEO Game Today" : "Creating Engaging Social Media Content",
             subtitle: "Discover effective SEO strategies that will boost your website's visibility and drive organic traffic. Learn tips and tricks from our experts.",
             thumbnail: i === 0 ? "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000" : `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800`,
             createdAt: Date.now() - (i * 86400000 * 5),
             authorId: `author-${i}`,
             category: i % 2 === 0 ? "SEO" : "Social"
           }));
           setPosts([...fetched, ...mocks].slice(0, 7));
        } else {
           setPosts(fetched);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full pb-20 relative z-10 font-sans">
      
      {/* Hero Header Banner */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
         <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative h-[240px] sm:h-[300px] flex items-center justify-center">
            {/* Background for Hero */}
            <div className="absolute inset-0 bg-[#001f3f]">
               <img 
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" 
                 className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                 alt="Office Team" 
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#001f3f]/80"></div>
            </div>
            
            <div className="relative z-10 text-center pt-8">
               <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Blog Insights</h1>
               <p className="text-white/80 text-lg font-medium">Explore Our Latest Articles and Industry Insights</p>
            </div>
         </div>
      </div>

      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0b63e5] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Featured Post (Side-by-side layout) */}
      {posts.length > 0 && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <Link to={`/post/${posts[0].id}`} className="group flex flex-col lg:flex-row items-center gap-12 cursor-pointer">
            
            {/* Image Left */}
            <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-sm aspect-[4/3] relative bg-white">
               {posts[0].thumbnail && (
                  <img src={posts[0].thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Featured" />
               )}
            </div>
            
            {/* Content Right */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-6">
                  <span className="text-slate-500 text-sm font-medium">{format(posts[0].createdAt || Date.now(), 'MMM dd, yyyy')}</span>
                  <span className="tag-blue">{posts[0].category || "SEO"}</span>
               </div>
               
               <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight group-hover:text-[#0b63e5] transition-colors">{posts[0].title}</h2>
               
               <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl">{posts[0].subtitle}</p>
               
               <div className="flex items-center gap-4">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${posts[0].authorId}`} className="w-12 h-12 rounded-full border border-slate-200 bg-slate-100" alt="Author" />
                  <div>
                     <p className="text-[15px] font-bold text-slate-900">James Anderson</p>
                     <p className="text-[13px] text-slate-500 font-medium">SEO Specialist</p>
                  </div>
               </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid of Posts */}
      {posts.length > 1 && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(1).map((post, i) => (
                 <Link key={post.id} to={`/post/${post.id}`} className="group flex flex-col h-full cursor-pointer">
                    {/* Thumbnail */}
                    <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-white border border-slate-100 relative">
                        {post.thumbnail && (
                          <img src={post.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                        )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col flex-1 px-2">
                       <div className="flex items-center gap-3 mb-4">
                          <span className="text-slate-500 text-[13px] font-medium">{format(post.createdAt || Date.now(), 'MMM dd, yyyy')}</span>
                          <span className="tag-blue">{post.category || (i % 2 === 0 ? "Content" : "Social")}</span>
                       </div>
                       
                       <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#0b63e5] transition-colors mb-3 leading-snug line-clamp-2">{post.title}</h4>
                       
                       <p className="text-slate-600 line-clamp-3 mb-6 flex-1 text-[15px] leading-relaxed">{post.subtitle}</p>
                       
                       <div className="flex items-center gap-3 mt-auto">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`} className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50" alt="Author" />
                          <div>
                             <p className="text-[14px] font-bold text-slate-900">{i % 2 === 0 ? "Emily Johnson" : "Michael Brown"}</p>
                             <p className="text-[12px] text-slate-500 font-medium">{i % 2 === 0 ? "Social Media Manager" : "Content Director"}</p>
                          </div>
                      </div>
                    </div>
                 </Link>
              ))}
           </div>
           
           {/* Pagination Dots (Visual only for matching the design) */}
           <div className="flex justify-center items-center gap-2 mt-20">
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all">&lt;</button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-500 text-white font-bold text-sm">1</button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm">2</button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm">3</button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all">&gt;</button>
           </div>
        </div>
      )}
    </div>
  );
};
