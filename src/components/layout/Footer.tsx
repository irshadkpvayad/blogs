import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8 mt-auto w-full border-t border-white/5 relative z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        
        <div className="text-center max-w-3xl mb-20">
          <h2 className="text-4xl sm:text-5xl font-heading font-black mb-6 tracking-tight text-glow">Build the Future</h2>
          <p className="text-gray-400 text-lg sm:text-xl mb-10 font-light">Join the network of creators shaping the next digital frontier.</p>
          <div className="flex items-center justify-center gap-6">
             <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-md">
                Initialize Comm
             </button>
             <button className="relative group px-8 py-3 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#b026ff] text-white font-semibold overflow-hidden shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all">
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative z-10">Access Portal</span>
             </button>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-white/10">
           {FOOTER_LINKS.map(col => (
              <div key={col.title}>
                 <h4 className="font-heading font-bold text-gray-200 mb-6 text-sm uppercase tracking-widest">{col.title}</h4>
                 <ul className="space-y-4">
                    {col.links.map(link => (
                       <li key={link.name}>
                          <a href="#" className="text-gray-500 hover:text-[#00f0ff] transition-colors text-[15px] flex items-center gap-2 font-light">
                             {link.name}
                             {link.isNew && <span className="bg-[#b026ff]/20 text-[#b026ff] border border-[#b026ff]/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">v2.0</span>}
                          </a>
                       </li>
                    ))}
                 </ul>
              </div>
           ))}
        </div>
        
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-8 text-gray-600 text-sm font-mono">
           <div className="flex items-center gap-3 mb-4 sm:mb-0">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#b026ff] flex items-center justify-center shadow-lg shadow-[#b026ff]/20">
               <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
               </svg>
             </div>
             <span className="font-bold text-gray-300 tracking-wider">QALAMFLOW_SYS</span>
           </div>
           <p>© 2077 QALAM NEXUS. END OF LINE.</p>
        </div>
      </div>
    </footer>
  );
};

const FOOTER_LINKS = [
  {
     title: 'Protocols',
     links: [
        { name: 'Core System' },
        { name: 'Modules' },
        { name: 'Neural Net', isNew: true },
        { name: 'API Docs' },
        { name: 'Bandwidth' }
     ]
  },
  {
     title: 'Faction',
     links: [
        { name: 'Origins' },
        { name: 'Recruitment' },
        { name: 'Transmissions' },
        { name: 'Archives' },
        { name: 'Terminal' }
     ]
  },
  {
     title: 'Data',
     links: [
        { name: 'Logs' },
        { name: 'Frequency' },
        { name: 'Holo-Events' },
        { name: 'Support AI' },
        { name: 'Nodes' }
     ]
  },
  {
     title: 'Sectors',
     links: [
        { name: 'Neon City' },
        { name: 'Underworld' },
        { name: 'High Orbit' },
        { name: 'Cyber-Sec' },
        { name: 'Synth-Com' }
     ]
  },
  {
     title: 'Grid',
     links: [
        { name: 'NetWatch' },
        { name: 'X-Cor' },
        { name: 'Void' },
        { name: 'Git-Node' },
        { name: 'Hex' }
     ]
  },
  {
     title: 'Legal',
     links: [
        { name: 'Directives' },
        { name: 'Privacy Shield' },
        { name: 'Trace Logs' },
        { name: 'Override' },
        { name: 'Ping' }
     ]
  }
];
