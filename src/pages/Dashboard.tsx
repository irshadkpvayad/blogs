import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { toast } from 'sonner';

export const Dashboard = () => {
  const { user, userData } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return <Navigate to="/" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-6">
        <div className="flex items-center gap-4 p-6 mb-4 bg-slate-900 rounded-3xl shadow-xl border border-slate-800 text-white">
          <img src={userData?.photoURL || ''} alt="" className="w-14 h-14 rounded-full border-2 border-indigo-500" />
          <div className="overflow-hidden">
            <h3 className="font-bold truncate text-lg">{userData?.name}</h3>
            <p className="text-sm text-indigo-400 font-medium capitalize">{userData?.role}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {[
            { id: 'profile', label: 'My Profile' },
            { id: 'requests', label: 'My Requests' },
            { id: 'request-post', label: 'Request Post' },
            { id: 'saved', label: 'Saved Posts' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Profile Settings</h2>
            <div className="space-y-6 max-w-md">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <input type="text" className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none focus:ring-0" defaultValue={userData?.name} disabled />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input type="email" className="w-full rounded-xl border border-slate-200 p-3 bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none focus:ring-0" defaultValue={userData?.email} disabled />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Bio</label>
                <textarea className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all min-h-[120px] resize-y" defaultValue={userData?.bio} placeholder="Tell us about yourself..." />
              </div>
              <Button className="w-full sm:w-auto">Save Changes</Button>
            </div>
          </div>
        )}

        {activeTab === 'request-post' && <RequestPostForm />}
        {activeTab === 'requests' && <MyRequests />}
        {activeTab === 'saved' && <p className="text-slate-500 text-center py-20 font-medium">Saved posts feature coming soon.</p>}
      </main>
    </div>
  );
};

const RequestPostForm = () => {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     const fetchCats = async () => {
        try {
           const { query, orderBy, getDocs } = await import('firebase/firestore');
           const sn = await getDocs(query(collection(db, 'categories'), orderBy('createdAt', 'desc')));
           setCategories(sn.docs.map(d => ({id: d.id, ...d.data()})));
        } catch(e){}
     };
     fetchCats();
  }, []);

  useEffect(() => {
     if (!categoryId) {
        setSubcategories([]);
        return;
     }
     const fetchSubs = async () => {
        try {
           const { getDocs } = await import('firebase/firestore');
           const sn = await getDocs(collection(db, 'categories', categoryId, 'subcategories'));
           setSubcategories(sn.docs.map(d => ({id: d.id, ...d.data()})));
        } catch(e){}
     };
     fetchSubs();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let thumbnailUrl = '';
    try {
      if (thumbnailFile) {
        try {
          const { uploadImage } = await import('../lib/storage');
          thumbnailUrl = await uploadImage(thumbnailFile, 'requests');
        } catch (uploadErr) {
           console.error("Storage upload failed:", uploadErr);
           alert("Thumbnail upload failed (check rules). Continuing without it.");
        }
      }

      await addDoc(collection(db, 'requests'), {
        userId: user!.uid,
        title,
        description: desc,
        thumbnail: thumbnailUrl,
        categoryId,
        subCategoryId,
        content: content || 'Draft content',
        status: 'pending',
        createdAt: Date.now()
      });
      toast.success('Post requested successfully!');
      setTitle('');
      setDesc('');
      setContent('');
      setCategoryId('');
      setSubCategoryId('');
      setThumbnailFile(null);
    } catch (err: any) {
      console.error('Submit request error:', err?.message || err);
      toast.error('Failed to submit request. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Request a New Post</h2>
        <p className="text-slate-500 text-sm font-medium">Suggest a topic or submit a draft for the community.</p>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Headline / Title</label>
        <input 
          required 
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 font-medium" 
          placeholder="e.g. The Future of React Hooks..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-1.5">
           <label className="text-sm font-bold text-slate-700">Category</label>
           <select 
             value={categoryId} 
             onChange={e => { setCategoryId(e.target.value); setSubCategoryId(''); }} 
             className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-600"
           >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
           </select>
         </div>
         
         <div className="space-y-1.5">
           <label className="text-sm font-bold text-slate-700">Subcategory</label>
           <select 
             value={subCategoryId} 
             onChange={e => setSubCategoryId(e.target.value)} 
             className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-600"
             disabled={!categoryId}
           >
              <option value="">Select Subcategory</option>
              {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
           </select>
         </div>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Short Description</label>
        <input 
          required 
          value={desc} 
          onChange={e=>setDesc(e.target.value)} 
          className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400 font-medium" 
          placeholder="Briefly explain what this post covers"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Thumbnail Image (Optional)</label>
        <input 
          type="file"
          accept="image/*"
          onChange={e => e.target.files && setThumbnailFile(e.target.files[0])}
          className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-medium text-slate-600 file:border-0 file:bg-indigo-50 file:text-indigo-700 file:px-4 file:py-1 file:rounded-full file:mr-4 file:font-semibold hover:file:bg-indigo-100 file:transition-colors" 
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-700">Article Content / Draft</label>
        <textarea 
          value={content} 
          onChange={e=>setContent(e.target.value)} 
          className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all min-h-[200px] resize-y placeholder:text-slate-400 font-medium" 
          placeholder="Write your draft here..."
        />
      </div>
      
      <Button type="submit" isLoading={loading} className="w-full sm:w-auto">Submit Request</Button>
    </form>
  );
};

const MyRequests = () => {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchReqs = async () => {
      try {
        const q = query(collection(db, 'requests'), where('userId', '==', user!.uid));
        const res = await getDocs(q);
        setRequests(res.docs.map(d=>({id:d.id, ...d.data()})));
      } catch(e) {
        console.error(e);
      }
    };
    fetchReqs();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">My Post Requests</h2>
      {requests.length === 0 ? <p className="text-slate-500 py-10 font-medium">No requests found.</p> : (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="p-5 border border-slate-200 rounded-2xl flex justify-between items-center bg-slate-50 shadow-sm transition-all hover:shadow-md">
              <div>
                <h4 className="font-bold text-slate-900 line-clamp-1">{r.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${
                r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
