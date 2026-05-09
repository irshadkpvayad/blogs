import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { collection, query, getDocs, addDoc, updateDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { RichEditor } from '../components/ui/RichEditor';

export const AdminPanel = () => {
  const { user, userData } = useAuthStore();
  const [activeTab, setActiveTab] = useState('posts');

  if (!user) return <Navigate to="/" />;
  if (userData?.role !== 'admin') return <Navigate to="/" />;

  return (
    <div className="flex flex-1 overflow-hidden w-full max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0 overflow-y-auto">
        <div className="space-y-1 mb-8">
           <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Management</p>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            ) },
            { id: 'posts', label: 'Posts', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            ) },
            { id: 'requests', label: 'Requests', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            ) },
            { id: 'categories', label: 'Categories', icon: (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            ) },
            { id: 'subcategories', label: 'Subcategories', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
            ) },
            { id: 'users', label: 'Users', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                 activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50'
               }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto gap-8">
        <header className="flex items-end justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 capitalize">{activeTab} Management</h1>
                <p className="text-slate-500">Manage your platform's {activeTab}.</p>
            </div>
        </header>
        
        {activeTab === 'posts' && <PostsManager />}
        {activeTab === 'requests' && <RequestsManager />}
        {activeTab === 'categories' && <CategoriesManager />}
        {activeTab === 'subcategories' && <SubcategoriesManager />}
        {activeTab === 'users' && <UsersManager />}
        {activeTab === 'dashboard' && <AdminAnalytics />}
      </main>
    </div>
  );
};

const AdminAnalytics = () => {
   const [seeding, setSeeding] = useState(false);
   
   const handleSeed = async () => {
      setSeeding(true);
      try {
         const { collection, addDoc } = await import('firebase/firestore');
         const { db } = await import('../lib/firebase');
         
         const sampleCategories = [
           { name: 'Technology', slug: 'technology', sub: ['Web Development', 'AI', 'Mobile'] },
           { name: 'Design', slug: 'design', sub: ['UI/UX', 'Product Design', 'Typography'] },
           { name: 'Lifestyle', slug: 'lifestyle', sub: ['Productivity', 'Digital Nomad'] }
         ];

         for (const cat of sampleCategories) {
             const docRef = await addDoc(collection(db, 'categories'), {
                name: cat.name,
                slug: cat.slug,
                createdAt: Date.now()
             });
             // Add subcategories
             for (const sub of cat.sub) {
                await addDoc(collection(db, 'categories', docRef.id, 'subcategories'), {
                   name: sub,
                   slug: sub.toLowerCase().replace(/\s+/g, '-'),
                   createdAt: Date.now()
                });
             }
         }

         const images = [
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3'
         ];

         for (let i = 1; i <= 15; i++) {
             await addDoc(collection(db, 'posts'), {
                title: `Fascinating Insight Number ${i}`,
                subtitle: `A deep dive into some really interesting concepts for post ${i}. Read more to learn about the nuances and details.`,
                thumbnail: images[i % images.length] + '?auto=format&fit=crop&w=800&q=80',
                content: `<p>This is the generated content for post ${i}. It has some <strong>bold</strong> text and some insightful paragraphs about technology, design, and building the future.</p><p>We can also add multiple paragraphs to make it look like a real article. The main idea here is to populate the site with mock data.</p>`,
                authorId: 'admin_seeded',
                status: 'published',
                createdAt: Date.now() - (i * 86400000), // spread over days
                updatedAt: Date.now(),
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 100)
             });
         }
         alert("Seeding complete!");
      } catch (e) {
         console.error(e);
         alert("Seeding failed");
      } finally {
         setSeeding(false);
      }
   };

   return (
      <div className="space-y-6">
         <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
             <h3 className="font-black text-slate-800 text-xl mb-2">Analytics coming soon</h3>
             <p className="text-slate-500 font-medium mb-6">Graphs and charts will be displayed here.</p>
             <Button onClick={handleSeed} isLoading={seeding}>Seed Sample Data (15 Posts & Categories)</Button>
         </div>
      </div>
   );
}

const UsersManager = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const sn = await getDocs(query(collection(db, 'users'), orderBy('joinedDate', 'desc')));
        setUsers(sn.docs.map(d => ({id: d.id, ...d.data()})));
      } catch (e) {
         console.error(e);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-slate-800 text-xl">All Users</h2>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">User</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Email</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Role</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Joined</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                     <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                              {u.photoURL && <img src={u.photoURL} alt={u.name} className="w-full h-full object-cover" />}
                           </div>
                           <p className="font-bold text-slate-900 text-sm truncate max-w-[200px]">{u.name}</p>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{u.email}</td>
                        <td className="p-4">
                           <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                             {u.role}
                           </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{new Date(u.joinedDate || 0).toLocaleDateString()}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {users.length === 0 && <div className="p-10 text-center text-slate-500 font-medium">No users found.</div>}
         </div>
      </div>
    </div>
  );
};

const CategoriesManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [subName, setSubName] = useState('');
  const [subcategories, setSubcategories] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      const cats = sn.docs.map(d => ({id: d.id, ...d.data()}));
      setCategories(cats);

      for (const cat of cats) {
        const subQ = query(collection(db, 'categories', cat.id, 'subcategories'));
        const subSn = await getDocs(subQ);
        setSubcategories(prev => ({...prev, [cat.id]: subSn.docs.map(d => ({id: d.id, ...d.data()}))}));
      }
    } catch(e) {
       console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      await addDoc(collection(db, 'categories'), {
         name,
         slug,
         image: '',
         createdAt: Date.now()
      });
      setIsCreating(false);
      setName('');
      fetchCategories();
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSub = async (catId: string, e: React.FormEvent) => {
      e.preventDefault();
      if (!subName.trim()) return;
      try {
         const slug = subName.toLowerCase().replace(/\s+/g, '-');
         await addDoc(collection(db, 'categories', catId, 'subcategories'), {
            name: subName,
            slug,
            createdAt: Date.now()
         });
         setSubName('');
         setActiveCategoryId(null);
         fetchCategories();
      } catch (e) {
         console.error(e);
      }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
       const { deleteDoc } = await import('firebase/firestore');
       await deleteDoc(doc(db, 'categories', id));
       setCategories(categories.filter(c => c.id !== id));
    } catch(e) {
       console.error(e);
    }
  };

  const handleDeleteSub = async (catId: string, subId: string) => {
     if (!confirm("Delete subcategory?")) return;
     try {
       const { deleteDoc } = await import('firebase/firestore');
       await deleteDoc(doc(db, 'categories', catId, 'subcategories', subId));
       fetchCategories();
     } catch (e) {
        console.error(e);
     }
  };

  if (isCreating) {
    return (
       <form onSubmit={handleCreate} className="max-w-xl p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
             <h3 className="font-black text-slate-900 text-lg">New Category</h3>
             <Button type="button" variant="outline" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
          </div>
          <div className="space-y-1.5">
             <label className="text-sm font-bold text-slate-700">Category Name</label>
             <input value={name} onChange={e=>setName(e.target.value)} required placeholder="e.g. Technology" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium" />
          </div>
          <Button type="submit" isLoading={loading}>Create Category</Button>
       </form>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="font-black text-slate-800 text-xl">All Categories</h2>
          <Button onClick={() => setIsCreating(true)}>Add Category</Button>
       </div>
       {categories.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-medium bg-white border border-slate-200 rounded-3xl shadow-sm">No categories found.</div>
       ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {categories.map(c => (
                <div key={c.id} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black text-xl border border-indigo-100">
                          {c.name.charAt(0)}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => setActiveCategoryId(activeCategoryId === c.id ? null : c.id)} className="text-slate-400 hover:text-indigo-600 p-2 font-medium text-xs">Add Sub</button>
                         <button onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-rose-600 p-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                         </button>
                      </div>
                   </div>
                   <h4 className="font-bold text-slate-900 text-lg">{c.name}</h4>
                   <p className="text-xs text-slate-500 font-medium mt-1 mb-4">/{c.slug}</p>
                   
                   {activeCategoryId === c.id && (
                       <form onSubmit={(e) => handleCreateSub(c.id, e)} className="mb-4 flex gap-2">
                          <input 
                             value={subName} 
                             onChange={e=>setSubName(e.target.value)} 
                             placeholder="Subcategory name" 
                             className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                             autoFocus
                          />
                          <Button type="submit" size="sm">Add</Button>
                       </form>
                   )}

                   <div className="flex flex-wrap gap-2">
                      {subcategories[c.id]?.map(sub => (
                         <span key={sub.id} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold items-center flex gap-1 group/sub transition-colors hover:bg-slate-200">
                            {sub.name}
                            <button onClick={() => handleDeleteSub(c.id, sub.id)} className="ml-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover/sub:opacity-100">×</button>
                         </span>
                      ))}
                      {(!subcategories[c.id] || subcategories[c.id].length === 0) && (
                         <span className="text-xs text-slate-400">No subcategories</span>
                      )}
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
};

const SubcategoriesManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subName, setSubName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const sn = await getDocs(query(collection(db, 'categories'), orderBy('createdAt', 'desc')));
      setCategories(sn.docs.map(d => ({id: d.id, ...d.data()})));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllSubcategories = async () => {
     try {
        let allSubs: any[] = [];
        const catsSn = await getDocs(query(collection(db, 'categories')));
        for (const cat of catsSn.docs) {
           const subSn = await getDocs(collection(db, 'categories', cat.id, 'subcategories'));
           const subs = subSn.docs.map(d => ({id: d.id, catId: cat.id, catName: cat.data().name, ...d.data()}));
           allSubs = [...allSubs, ...subs];
        }
        allSubs.sort((a,b) => b.createdAt - a.createdAt);
        setSubcategories(allSubs);
     } catch (e) {
        console.error(e);
     }
  };

  useEffect(() => {
    fetchCategories();
    fetchAllSubcategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !subName.trim()) return;
    setLoading(true);
    try {
      const slug = subName.toLowerCase().replace(/\s+/g, '-');
      await addDoc(collection(db, 'categories', categoryId, 'subcategories'), {
         name: subName,
         slug,
         createdAt: Date.now()
      });
      setSubName('');
      fetchAllSubcategories();
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (catId: string, subId: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    try {
       const { deleteDoc } = await import('firebase/firestore');
       await deleteDoc(doc(db, 'categories', catId, 'subcategories', subId));
       fetchAllSubcategories();
    } catch(e) {
       console.error(e);
    }
  };

  return (
    <div className="space-y-8">
       {/* Create Form */}
       <form onSubmit={handleCreate} className="max-w-xl p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
             <h3 className="font-black text-slate-900 text-lg">New Subcategory</h3>
          </div>
          
          <div className="space-y-1.5">
             <label className="text-sm font-bold text-slate-700">Parent Category</label>
             <select 
               value={categoryId} 
               onChange={e => setCategoryId(e.target.value)} 
               required
               className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-500 transition-all font-medium bg-white"
             >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
          </div>

          <div className="space-y-1.5">
             <label className="text-sm font-bold text-slate-700">Subcategory Name</label>
             <input value={subName} onChange={e=>setSubName(e.target.value)} required placeholder="e.g. React.js" className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-medium" />
          </div>
          
          <Button type="submit" isLoading={loading}>Create Subcategory</Button>
       </form>

       {/* List */}
       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-6 max-w-3xl">
          <h3 className="font-black text-slate-800 text-lg mb-4">All Subcategories</h3>
          {subcategories.length === 0 ? (
             <div className="text-slate-500 text-center py-6">No subcategories found.</div>
          ) : (
             <div className="divide-y divide-slate-100">
                {subcategories.map(sub => (
                   <div key={sub.id} className="py-4 flex justify-between items-center group">
                      <div>
                         <p className="font-bold text-slate-900">{sub.name}</p>
                         <p className="text-xs text-slate-500">Under <span className="font-bold text-slate-700">{sub.catName}</span> • /{sub.slug}</p>
                      </div>
                      <button onClick={() => handleDelete(sub.catId, sub.id)} className="text-slate-400 hover:text-rose-600 font-bold text-sm px-3 py-1.5 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors">
                         Delete
                      </button>
                   </div>
                ))}
             </div>
          )}
       </div>
    </div>
  );
};

const RequestsManager = () => {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getDocs(query(collection(db, 'requests'), orderBy('createdAt', 'desc')));
        setRequests(res.docs.map(d=>({id: d.id, ...d.data()})));
      } catch(e) {
        console.error(e);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'requests', id), { status });
      if (status === 'approved') {
        const r = requests.find(r=>r.id === id);
        if (r) {
           await addDoc(collection(db, 'posts'), {
              title: r.title,
              subtitle: r.description,
              content: r.content,
              thumbnail: r.thumbnail || '',
              categoryId: r.categoryId || '',
              subCategoryId: r.subCategoryId || '',
              authorId: r.userId,
              status: 'published',
              createdAt: Date.now(),
              updatedAt: Date.now(),
              views: 0,
              likes: 0
           });
        }
      }
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status } : r));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      {requests.map(r => (
        <div key={r.id} className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                 {r.status === 'pending' ? 'REV' : r.status.slice(0,3)}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{r.title}</p>
                <p className="text-[10px] text-slate-500">By user: {r.userId} • <span className={`${r.status === 'pending' ? 'text-amber-600' : r.status === 'approved' ? 'text-emerald-600' : 'text-rose-600'} font-bold uppercase`}>{r.status}</span></p>
             </div>
          </div>
          <div className="flex gap-2 items-center">
             {r.status === 'pending' && (
               <>
                 <Button size="sm" onClick={() => handleAction(r.id, 'approved')}>Approve</Button>
                 <Button size="sm" variant="outline" onClick={() => handleAction(r.id, 'rejected')}>Reject</Button>
               </>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

const PostsManager = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      setPosts(sn.docs.map(d => ({id: d.id, ...d.data()})));
    } catch (err) {
      try {
        const fallback = await getDocs(collection(db, 'posts'));
        setPosts(fallback.docs.map(d => ({id: d.id, ...d.data()})));
      } catch(fallbackErr) {
        console.error(fallbackErr);
      }
    }
  };

  useEffect(() => {
     const fetchCats = async () => {
        try {
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
           const sn = await getDocs(collection(db, 'categories', categoryId, 'subcategories'));
           setSubcategories(sn.docs.map(d => ({id: d.id, ...d.data()})));
        } catch(e){}
     };
     fetchSubs();
  }, [categoryId]);

  useEffect(() => {
    if (!isCreating && !editingPost) fetchPosts();
  }, [isCreating, editingPost]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!title || !content) throw new Error("Title and content required");
      
      let thumbnailUrl = '';
      if (thumbnailFile) {
         try {
           const { uploadImage } = await import('../lib/storage');
           thumbnailUrl = await uploadImage(thumbnailFile, 'posts');
         } catch (uploadErr) {
           console.error("Storage upload failed, this may be due to missing storage rules:", uploadErr);
           alert("Thumbnail upload failed (check Firebase Storage rules in console). Post will be created without it.");
         }
      }

      if (editingPost) {
         await updateDoc(doc(db, 'posts', editingPost.id), {
           title,
           subtitle,
           content,
           categoryId,
           subCategoryId,
           ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
           updatedAt: Date.now()
         });
      } else {
         await addDoc(collection(db, 'posts'), {
            title,
            subtitle,
            categoryId,
            subCategoryId,
            thumbnail: thumbnailUrl,
            content,
            authorId: user!.uid,
            status: 'published',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            views: 0,
            likes: 0
          });
      }
      setIsCreating(false);
      setEditingPost(null);
      setTitle('');
      setSubtitle('');
      setContent('');
      setCategoryId('');
      setSubCategoryId('');
      setThumbnailFile(null);
    } catch(err) {
      handleFirestoreError(err, editingPost ? OperationType.UPDATE : OperationType.CREATE, 'posts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: any) => {
     setTitle(post.title);
     setSubtitle(post.subtitle || '');
     setContent(post.content);
     setCategoryId(post.categoryId || '');
     // We need to wait for subs to load, but we can just set the ID and let the effect load them
     setSubCategoryId(post.subCategoryId || '');
     setEditingPost(post);
  };
  
  const handleDelete = async (id: string) => {
     if (!confirm("Are you sure you want to delete this post?")) return;
     try {
         const { deleteDoc } = await import('firebase/firestore');
         await deleteDoc(doc(db, 'posts', id));
         setPosts(posts.filter(p => p.id !== id));
     } catch (e) {
         console.error(e);
     }
  };

  if (isCreating || editingPost) {
    return (
      <form onSubmit={handleCreate} className="space-y-6 max-w-4xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h2 className="font-black text-slate-800 text-xl">{editingPost ? 'Edit Post' : 'New Post'}</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => { setIsCreating(false); setEditingPost(null); }}>Cancel</Button>
        </div>
        <input 
          type="text" 
          placeholder="Post Title" 
          value={title} 
          onChange={e=>setTitle(e.target.value)}
          className="w-full text-4xl font-black bg-transparent border-0 border-b border-slate-200 focus:ring-0 focus:border-indigo-500 px-0 py-4 outline-none transition-colors"
        />
        <input 
          type="text" 
          placeholder="Subtitle (Optional)" 
          value={subtitle} 
          onChange={e=>setSubtitle(e.target.value)}
          className="w-full text-xl text-slate-500 font-medium bg-transparent border-0 border-b border-slate-200 focus:ring-0 focus:border-indigo-500 px-0 py-2 outline-none transition-colors"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
        
        <div className="space-y-1.5 mt-6">
          <label className="text-sm font-bold text-slate-700">Thumbnail Image</label>
          <input 
            type="file"
            accept="image/*"
            onChange={e => e.target.files && setThumbnailFile(e.target.files[0])}
            className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-medium text-slate-600 file:border-0 file:bg-indigo-50 file:text-indigo-700 file:px-4 file:py-1 file:rounded-full file:mr-4 file:font-semibold hover:file:bg-indigo-100 file:transition-colors" 
          />
        </div>

        <div className="mt-4">
            <RichEditor content={content} onChange={setContent} />
        </div>
        
        <div className="pt-4">
             <Button type="submit" isLoading={loading}>{editingPost ? 'Save Changes' : 'Publish Post'}</Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-slate-800 text-xl">All Posts</h2>
        <Button onClick={() => {
           setTitle(''); setSubtitle(''); setContent(''); setIsCreating(true);
        }}>Write Post</Button>
      </div>
      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="p-4 bg-white rounded-3xl shadow-sm border border-slate-200 flex justify-between items-center group transition-colors hover:border-indigo-200">
            <div>
              <p className="font-bold text-slate-900">{p.title}</p>
              <p className="text-xs text-slate-500 mt-1">{new Date(p.createdAt || 0).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex gap-2">
                 <button onClick={() => handleEdit(p)} className="text-slate-500 hover:text-indigo-600 font-bold text-sm px-2 py-1 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors">Edit</button>
                 <button onClick={() => handleDelete(p.id)} className="text-slate-500 hover:text-rose-600 font-bold text-sm px-2 py-1 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors">Delete</button>
               </div>
               <div className="text-[10px] font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-widest shrink-0">{p.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
