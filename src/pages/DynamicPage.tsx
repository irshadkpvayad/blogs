import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'pages'), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setPageData({ id: snapshot.docs[0].id, ...data });
          document.title = `${data.title} | QALAM THIRASH`;
        } else {
          setPageData(null);
        }
      } catch (e) {
        console.error("Error fetching page:", e);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center py-32 bg-[#f2f8fc]">
         <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0b63e5] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-32 bg-[#f2f8fc] px-4 text-center">
         <h1 className="text-4xl font-black text-slate-900 mb-4">404 - Page Not Found</h1>
         <p className="text-slate-500 font-medium">The page you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#f2f8fc] pb-24">
      <div className="bg-[#001f3f] w-full pt-20 pb-16 px-4">
         <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{pageData.title}</h1>
         </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
            <div 
              className="prose prose-slate max-w-none prose-headings:font-black prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
         </div>
      </div>
    </div>
  );
};
