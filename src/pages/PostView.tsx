import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { format } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';

export const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        const postDoc = await getDoc(doc(db, 'posts', id));
        if (postDoc.exists()) {
          const data = postDoc.data();
          setPost({ id: postDoc.id, ...data });
          document.title = data.title + " - BlockPlatform";
          
          if (data.authorId) {
            const authorDoc = await getDoc(doc(db, 'users', data.authorId));
            if (authorDoc.exists()) setAuthor(authorDoc.data());
          }
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `posts/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto p-8 animate-pulse text-center">Loading...</div>;
  if (!post) return <div className="max-w-3xl mx-auto p-8 text-center text-gray-500">Post not found.</div>;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col w-full">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-xl md:text-2xl text-slate-500 font-medium mb-10 max-w-3xl leading-snug">
            {post.subtitle}
          </p>
        )}
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-indigo-100 shrink-0 shadow-sm">
            {author?.photoURL && <img src={author.photoURL} alt={author.name} className="w-full h-full object-cover" />}
          </div>
          <div>
            <p className="font-bold text-slate-900">{author?.name || 'Unknown Author'}</p>
            <p className="text-sm font-medium text-slate-500">{format(post.createdAt || Date.now(), 'MMM d, yyyy')} • {post.readTime || 5} min read</p>
          </div>
        </div>
      </header>

      {post.thumbnail && (
        <figure className="mb-16 rounded-3xl overflow-hidden shadow-xl border border-slate-100 aspect-[21/9]">
          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
        </figure>
      )}

      <div 
        className="prose prose-lg sm:prose-xl max-w-none prose-img:rounded-3xl prose-img:shadow-md prose-img:border prose-img:border-slate-100 prose-a:text-indigo-600 prose-a:font-semibold hover:prose-a:text-indigo-700 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 mb-20"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <hr className="my-12 border-slate-200" />
      <CommentsSection postId={id as string} />
    </article>
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
        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
          <textarea 
            value={newComment} onChange={e=>setNewComment(e.target.value)} 
            placeholder="Share your thoughts..." 
            className="w-full rounded-2xl border border-slate-200 p-5 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 min-h-[120px] resize-y"
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

      <div className="space-y-6 pt-8 border-t border-slate-100 max-w-3xl">
        {comments.map(c => (
          <div key={c.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex gap-5">
             <div className="w-12 h-12 rounded-full bg-slate-100 shrink-0 border border-slate-200"></div>
             <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                   <p className="text-xs text-slate-400 font-medium">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-slate-700 leading-relaxed">{c.content}</p>
             </div>
          </div>
        ))}
        {comments.length === 0 && (
           <p className="text-slate-500 text-center py-10">No comments yet. Be the first to start the discussion!</p>
        )}
      </div>
    </div>
  );
};
