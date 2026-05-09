import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#001f3f] text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="text-center max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">Stay connected with QALAM THIRASH</h2>
          <p className="text-white/70 text-lg sm:text-xl mb-8 font-light">Join our community and get our latest insights directly to your inbox.</p>
          <div className="flex items-center justify-center gap-4">
             <Link to="/p/contact" className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors">
                Contact Us
             </Link>
             <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors shadow-sm">
                Subscribe
             </button>
          </div>
        </div>

        <div className="w-full flex flex-wrap justify-between gap-12 pb-12 border-b border-white/10">
           {FOOTER_LINKS.map(col => (
              <div key={col.title} className="min-w-[150px]">
                 <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">{col.title}</h4>
                 <ul className="space-y-4">
                    {col.links.map(link => (
                       <li key={link.name}>
                          <Link to={link.path} className="text-white/60 hover:text-white transition-colors text-[15px] flex items-center gap-2 font-medium">
                             {link.name}
                          </Link>
                       </li>
                    ))}
                 </ul>
              </div>
           ))}
        </div>
        
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-8 text-white/50 text-sm">
           <div className="flex items-center gap-2 mb-4 sm:mb-0">
             <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center">
                <span className="text-[#001f3f] text-[10px] font-black tracking-tighter">Q</span>
             </div>
             <span className="font-bold text-white tracking-widest uppercase">QALAM THIRASH</span>
           </div>
           <p>© {new Date().getFullYear()} QALAM THIRASH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FOOTER_LINKS = [
  {
     title: 'Platform',
     links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/p/about-us' },
        { name: 'Contact', path: '/p/contact' }
     ]
  },
  {
     title: 'Legal',
     links: [
        { name: 'Terms of Service', path: '/p/terms-of-service' },
        { name: 'Privacy Policy', path: '/p/privacy-policy' },
        { name: 'Cookies', path: '/p/cookies' }
     ]
  },
  {
     title: 'Social',
     links: [
        { name: 'Twitter', path: '#' },
        { name: 'LinkedIn', path: '#' },
        { name: 'Instagram', path: '#' }
     ]
  }
];
