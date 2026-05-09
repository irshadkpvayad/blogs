import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#001f3f] text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="text-center max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">Stay connected with Digitro</h2>
          <p className="text-white/70 text-lg sm:text-xl mb-8 font-light">Join over 4,000+ companies getting our latest insights.</p>
          <div className="flex items-center justify-center gap-4">
             <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors">
                Contact Sales
             </button>
             <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors shadow-sm">
                Subscribe
             </button>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-white/10">
           {FOOTER_LINKS.map(col => (
              <div key={col.title}>
                 <h4 className="font-bold text-white mb-6 text-sm">{col.title}</h4>
                 <ul className="space-y-4">
                    {col.links.map(link => (
                       <li key={link.name}>
                          <a href="#" className="text-white/60 hover:text-white transition-colors text-[15px] flex items-center gap-2 font-medium">
                             {link.name}
                             {link.isNew && <span className="bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">New</span>}
                          </a>
                       </li>
                    ))}
                 </ul>
              </div>
           ))}
        </div>
        
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-8 text-white/50 text-sm">
           <div className="flex items-center gap-2 mb-4 sm:mb-0">
             <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center">
               <div className="w-2 h-2 bg-[#001f3f] rounded-sm transform rotate-45"></div>
             </div>
             <span className="font-bold text-white tracking-wide">Digitro</span>
           </div>
           <p>© 2026 Digitro Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FOOTER_LINKS = [
  {
     title: 'Product',
     links: [
        { name: 'Overview' },
        { name: 'Features' },
        { name: 'Solutions', isNew: true },
        { name: 'Tutorials' },
        { name: 'Pricing' }
     ]
  },
  {
     title: 'Company',
     links: [
        { name: 'About us' },
        { name: 'Careers' },
        { name: 'Press' },
        { name: 'News' },
        { name: 'Contact' }
     ]
  },
  {
     title: 'Resources',
     links: [
        { name: 'Blog' },
        { name: 'Events' },
        { name: 'Help centre' },
        { name: 'Tutorials' },
        { name: 'Support' }
     ]
  },
  {
     title: 'Use cases',
     links: [
        { name: 'Startups' },
        { name: 'Enterprise' },
        { name: 'Government' },
        { name: 'Ecommerce' }
     ]
  },
  {
     title: 'Social',
     links: [
        { name: 'Twitter' },
        { name: 'LinkedIn' },
        { name: 'Facebook' },
        { name: 'GitHub' },
        { name: 'Dribbble' }
     ]
  },
  {
     title: 'Legal',
     links: [
        { name: 'Terms' },
        { name: 'Privacy' },
        { name: 'Cookies' },
        { name: 'Licenses' }
     ]
  }
];
