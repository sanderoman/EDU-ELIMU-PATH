
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, GraduationCap, Zap, ShieldCheck, Globe, Calculator, Layers, FileText, Target, Building2, MapPin, Award, Star, Compass } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const liveActivity = [
    "Kipchirchir (B+) just matched Medicine at UoN",
    "Mercy (C+) unlocked Nursing pathways at KMTC",
    "Omondi (A-) selected Mechatronics at JKUAT",
    "Wanjiku (C plain) matched Hospitality at KU",
    "Mutua (D+) found Engineering options at TUK",
    "Fatma (B) matched Law at Strathmore",
    "Ochieng (A) matched Software Engineering at UoN"
  ];

  return (
    <div className="flex flex-col bg-black selection:bg-red-600 selection:text-white">
      {/* Real-time Broadcast Ticker */}
      <div className="bg-red-600/5 border-y border-white/5 py-4 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
        <div className="animate-ticker flex items-center">
          {[...liveActivity, ...liveActivity].map((text, i) => (
            <div key={i} className="flex items-center gap-4 px-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 whitespace-nowrap">
              <span className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse"></span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Blueprint Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-3 bg-red-600/10 backdrop-blur-xl border border-red-600/20 px-5 py-2.5 rounded-full">
                <Target size={16} className="text-red-500 animate-pulse" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Strategic Career Deployment 2025</span>
              </div>

              <h1 className="text-7xl md:text-[9rem] font-black leading-[0.8] tracking-tighter text-white">
                ARCHITECT <br />
                <span className="text-red-600">YOUR MERIT.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-xl leading-relaxed">
                Kenya's elite placement engine. We synthesize institutional grade thresholds with your KCSE profile to build a precision career blueprint.
              </p>

              {/* DUAL ACTION HUB */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <button 
                  onClick={() => navigate('/grade-input')}
                  className="relative bg-red-600 text-white px-10 py-7 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all shadow-3xl shadow-red-600/30 active:scale-95 group overflow-hidden border-2 border-transparent"
                >
                  <span className="relative z-10">START MERIT ANALYSIS</span>
                  <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                </button>

                <button 
                  onClick={() => navigate('/universities')}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-10 py-7 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:bg-white/10 hover:border-red-600 transition-all active:scale-95 group"
                >
                  <Compass size={24} className="text-red-600 group-hover:rotate-45 transition-transform" />
                  EXPLORE REGISTRY
                </button>
              </div>

              <div className="flex items-center gap-16 pt-12 border-t border-white/5">
                <div className="space-y-1">
                  <div className="text-4xl font-black text-white tracking-tighter">67+</div>
                  <div className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Chartered Unis</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="space-y-1">
                  <div className="text-4xl font-black text-white tracking-tighter">4,000+</div>
                  <div className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Course Payloads</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="space-y-1">
                  <div className="text-4xl font-black text-white tracking-tighter">100%</div>
                  <div className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em]">Placement Sync</div>
                </div>
              </div>
            </div>

            {/* Interactive Visual Stack */}
            <div className="hidden lg:block relative">
               <div className="relative z-10">
                  <div className="absolute -inset-20 bg-red-600/5 rounded-full blur-[120px] opacity-30"></div>
                  
                  <div className="relative space-y-[-240px]">
                     {/* Background Shadow Layers */}
                     <div className="bg-gray-900/40 border border-white/10 w-full aspect-[4/5] rounded-[5rem] rotate-[-8deg] translate-x-[-30px] backdrop-blur-3xl shadow-2xl"></div>
                     <div className="bg-red-600/10 border border-red-600/20 w-full aspect-[4/5] rounded-[5rem] rotate-[4deg] translate-x-[30px] backdrop-blur-3xl shadow-2xl"></div>
                     
                     {/* Main Interactive Display */}
                     <div className="relative glass p-6 rounded-[5rem] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden group">
                        <img 
                           src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?auto=format&fit=crop&w=1200&q=80" 
                           alt="Kenyan Academic" 
                           className="rounded-[4rem] w-full aspect-[4/5] object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                        
                        {/* Blueprint Overlays */}
                        <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none"></div>

                        <div className="absolute top-16 left-16 bg-red-600 p-6 rounded-3xl shadow-3xl animate-bounce-slow">
                           <Layers size={32} className="text-white mb-2" />
                           <div className="text-white font-black text-sm uppercase tracking-widest">Logic Tier 1</div>
                        </div>

                        <div className="absolute bottom-16 right-16 bg-white p-10 rounded-[3rem] shadow-3xl text-black max-w-[280px]">
                           <ShieldCheck className="text-red-600 mb-4" size={48} />
                           <div className="text-3xl font-black tracking-tighter leading-none mb-2 uppercase">Verified Standings.</div>
                           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Cross-referenced with National Academic Registry 2025</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture */}
      <section className="py-48 px-6 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-32">
             <div className="space-y-6">
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">The <span className="text-red-600">Strategic</span> <br/>Modules.</h2>
             </div>
             <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-xl">
               Our deployment engine doesn't just list schools. We layer market demand, grade realism, and institutional capacity to ensure your placement is future-proof.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: <Calculator className="text-red-500" />, 
                title: "Weighted Analysis", 
                desc: "Real-time calculation of cluster point competitiveness against the latest admission cycles." 
              },
              { 
                icon: <Globe className="text-red-500" />, 
                title: "Unified Database", 
                desc: "The only platform syncing Public Unis, Private Hubs, and KMTC Medical Campuses into one engine." 
              },
              { 
                icon: <Zap className="text-red-500" />, 
                title: "Direct Placement", 
                desc: "Aligned with KUCCPS portal logic to ensure your strategy matches the official state system." 
              }
            ].map((f, i) => (
              <div key={i} className="group p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 hover:border-red-600/40 transition-all flex flex-col justify-between h-[450px]">
                <div>
                   <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-10 border border-white/10 group-hover:bg-red-600/10 group-hover:scale-110 transition-all duration-500">
                     {f.icon}
                   </div>
                   <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">{f.title}</h3>
                   <p className="text-gray-500 text-lg leading-relaxed group-hover:text-gray-300 transition-colors">{f.desc}</p>
                </div>
                <div className="pt-8 flex items-center gap-2 text-[10px] font-black text-gray-700 uppercase tracking-widest group-hover:text-red-600 transition-colors">
                  VIEW MODULE <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Showcase */}
      <section className="py-40 px-6 relative">
         <div className="max-w-7xl mx-auto glass p-16 md:p-32 rounded-[5rem] border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white">
                    EXPLORE THE <br/><span className="text-red-600">REGISTRY.</span>
                  </h2>
                  <p className="text-gray-400 text-xl font-medium leading-relaxed">
                    Access deep course data from all 67 Chartered Institutions. From Clinical Medicine at KMTC to Data Science at UoN.
                  </p>
                  <button 
                    onClick={() => navigate('/universities')}
                    className="bg-white text-black px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-4 group/btn"
                  >
                    OPEN REGISTRY <Search size={24} className="group-hover/btn:scale-125 transition-transform" />
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'UoN Medicine', val: 'A' },
                    { label: 'KMTC Nursing', val: 'C+' },
                    { label: 'JKUAT Eng', val: 'A-' },
                    { label: 'KU Law', val: 'B+' }
                  ].map((chip, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
                       <div className="text-red-600 font-black text-3xl mb-1">{chip.val}</div>
                       <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{chip.label}</div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Final Tactical CTA */}
      <section className="py-48 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <Star size={64} className="text-red-600 mx-auto animate-spin-slow" />
          <h2 className="text-5xl md:text-9xl font-black tracking-tighter uppercase leading-none">READY FOR <br/><span className="text-red-600">DEPLOYMENT?</span></h2>
          <button 
             onClick={() => navigate('/grade-input')}
             className="bg-red-600 text-white px-16 py-8 rounded-[2.5rem] font-black text-3xl hover:bg-white hover:text-black transition-all shadow-3xl active:scale-95 group flex items-center justify-center gap-6 mx-auto"
          >
            START ANALYSIS <ArrowRight size={36} className="group-hover:translate-x-4 transition-transform" />
          </button>
          <div className="flex items-center justify-center gap-8 text-[11px] font-black text-gray-700 uppercase tracking-[0.5em]">
             <span>SECURE SYNC</span>
             <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
             <span>REAL-TIME AUDIT</span>
             <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
             <span>OFFICIAL SUPPORT</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
