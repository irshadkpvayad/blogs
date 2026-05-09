import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'posts'), where('status', '==', 'published'));
        const sn = await getDocs(q);
        setPosts(sn.docs.map(d=>({id: d.id, ...d.data()})));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    document.title = "Search - BlockPlatform";
    if (searchTerm.trim() === '') {
      setResults(posts);
    } else {
      const lower = searchTerm.toLowerCase();
      setResults(posts.filter(p => p.title?.toLowerCase().includes(lower) || p.subtitle?.toLowerCase().includes(lower)));
    }
  }, [searchTerm, posts]);

  return (
    <div className="flex flex-col flex-1 p-8 overflow-hidden max-w-5xl mx-auto w-full gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Explore</h1>
        <p className="text-slate-500">Find the articles you're looking for.</p>
      </header>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Search articles, tags, authors..." 
          value={searchTerm}
          onChange={e=>setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 p-4 pl-6 bg-white shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium transition-all"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
             <div className="py-10 text-center text-slate-500 font-medium">Loading posts...</div>
          ) : results.length > 0 ? (
            results.map(post => (
              <Link key={post.id} to={`/post/${post.id}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                {post.thumbnail && (
                  <div className="w-32 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={post.thumbnail} className="w-full h-full object-cover" alt="" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                    {post.subtitle}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 text-slate-500 font-medium">
               No posts found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
