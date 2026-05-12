import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { api } from '../lib/api';
import { format } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';

export const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Sidebar data
  const [categories, setCategories] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        // Use the API (Admin SDK) instead of direct Firestore to bypass security rules
        const data = await api.get(`/api/posts/${id}`);
        if (data && !data.error) {
          setPost(data);
          document.title = data.title + " - QALAM THIRASH";

          if (data.authorId) {
            // Fetch author via API too
            try {
              const authorData = await api.get(`/api/users/${data.authorId}`);
              if (authorData && !authorData.error) setAuthor(authorData);
            } catch {
              // author fetch is non-critical
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch post:', e);
      } finally {
        setLoading(false);
      }
    };

    const fetchSidebarData = async () => {
       try {
          // Fetch categories
          const catSn = await getDocs(query(collection(db, 'categories'), orderBy('createdAt', 'desc')));
          setCategories(catSn.docs.map(d => ({id: d.id, ...d.data()})));

          // Fetch recent posts
          const recentSn = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5)));
          setRecentPosts(recentSn.docs.map(d => ({id: d.id, ...d.data()})).filter(p => p.id !== id));

          // Fetch popular posts
          const popSn = await getDocs(query(collection(db, 'posts'), orderBy('views', 'desc'), limit(5)));
          setPopularPosts(popSn.docs.map(d => ({id: d.id, ...d.data()})).filter(p => p.id !== id));
       } catch (e) {
          console.error("Error fetching sidebar data:", e);
       }
    };

    fetchPost();
    fetchSidebarData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f2f8fc]"><div className="w-12 h-12 border-4 border-slate-200 border-t-[#0b63e5] rounded-full animate-spin"></div></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center bg-[#f2f8fc]"><div className="text-center text-slate-500 font-bold text-xl">Post not found.</div></div>;

  return (
    <div className="flex-1 w-full bg-[#f2f8fc] pb-24">
      {/* Dark Header Banner for Navbar visibility */}
      <div className="bg-[#001f3f] w-full h-32 md:h-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Main Content Area */}
        <article className="lg:col-span-8 xl:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 lg:p-12">
          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-lg md:text-xl text-slate-500 font-medium mb-8 max-w-3xl leading-snug">
                {post.subtitle}
              </p>
            )}
            
            <div className="flex items-center gap-4 py-4 border-y border-slate-100">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shrink-0 shadow-sm">
                {author?.photoURL && <img src={author.photoURL} alt={author.name} className="w-full h-full object-cover" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm md:text-base">{author?.name || 'Unknown Author'}</p>
                <p className="text-xs md:text-sm font-medium text-slate-500">{format(post.createdAt || Date.now(), 'MMM d, yyyy')} • {post.readTime || 5} min read • <span className="text-indigo-600 font-bold">{post.views || 0} views</span></p>
              </div>
            </div>
          </header>

          {post.thumbnail && (
            <figure className="mb-12 rounded-2xl overflow-hidden bg-slate-100 aspect-[21/9]">
              <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
            </figure>
          )}

          <div 
            className="prose prose-slate md:prose-lg max-w-none prose-img:rounded-2xl prose-a:text-indigo-600 prose-a:font-semibold hover:prose-a:text-indigo-700 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 mb-16"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <hr className="my-10 border-slate-100" />
          <CommentsSection postId={id as string} />
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-4 space-y-8">
            {/* Categories Widget */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-xl mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                    {categories.length > 0 ? categories.map(cat => (
                        <span key={cat.id} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-colors cursor-pointer">
                            {cat.name}
                        </span>
                    )) : (
                        <p className="text-sm text-slate-400 font-medium">No categories found.</p>
                    )}
                </div>
            </div>

            {/* Most Viewed Posts Widget */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-xl mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Most Viewed
                </h3>
                <div className="space-y-6">
                    {popularPosts.length > 0 ? popularPosts.map(p => (
                        <Link to={`/post/${p.id}`} key={p.id} className="group flex items-start gap-4">
                            {p.thumbnail && (
                                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm md:text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">{p.title}</h4>
                                <p className="text-xs font-bold text-slate-400">{p.views || 0} views</p>
                            </div>
                        </Link>
                    )) : (
                        <p className="text-sm text-slate-400 font-medium">No popular posts yet.</p>
                    )}
                </div>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 text-xl mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Recent Posts
                </h3>
                <div className="space-y-6">
                    {recentPosts.length > 0 ? recentPosts.map(p => (
                        <Link to={`/post/${p.id}`} key={p.id} className="group flex items-start gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 text-sm md:text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">{p.title}</h4>
                                <p className="text-xs font-bold text-slate-400">{format(p.createdAt || Date.now(), 'MMM d, yyyy')}</p>
                            </div>
                        </Link>
                    )) : (
                        <p className="text-sm text-slate-400 font-medium">No recent posts.</p>
                    )}
                </div>
            </div>
        </aside>

      </div>
    </div>
  );
};

const CommentsSection = ({ postId }: { postId: string }) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    import('firebase/firestore').then(({ collection, query, where, orderBy, getDocs }) => {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      getDocs(q).then(sn => setComments(sn.docs.map(d=>({id: d.id, ...d.data()}))));
    });
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'comments'), {
        postId,
        userId: user.uid,
        content: newComment,
        createdAt: Date.now(),
        likes: 0
      });
      setComments([{ id: docRef.id, postId, userId: user.uid, content: newComment, createdAt: Date.now(), likes: 0 }, ...comments]);
      setNewComment('');
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-10">
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Discussion</h3>
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            value={newComment} onChange={e=>setNewComment(e.target.value)} 
            placeholder="Share your thoughts..." 
            className="w-full rounded-2xl border border-slate-200 p-5 bg-slate-50 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 min-h-[120px] resize-y"
          />
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none" disabled={!newComment.trim()}>Post Comment</button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <p className="text-slate-500 font-medium mb-3">Join the conversation</p>
            <p className="text-sm text-slate-400">Sign in to leave a comment.</p>
        </div>
      )}

      <div className="space-y-6 pt-8 border-t border-slate-100">
        {comments.map(c => (
          <div key={c.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex gap-5">
             <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 border border-slate-300"></div>
             <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm md:text-base font-medium">{c.content}</p>
             </div>
          </div>
        ))}
        {comments.length === 0 && (
           <p className="text-slate-500 text-center py-10 font-medium">No comments yet. Be the first to start the discussion!</p>
        )}
      </div>
    </div>
  );
};
