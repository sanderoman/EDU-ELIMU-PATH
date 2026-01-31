
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UNIVERSITIES, KMTC_CAMPUSES, NATIONAL_POLYTECHNICS } from '../constants';
import { ExternalLink, GraduationCap, MapPin, Building2, Search, Globe, ChevronRight, Award, Library, BookOpen, X, Loader2, Cpu, Download, Landmark, Network, Link as LinkIcon, FileText, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getUniversityCourses, GroundedResponse } from '../services/geminiService';

type FetchState = 'IDLE' | 'CONNECTING' | 'FETCHING' | 'PARSING' | 'SUCCESS' | 'ERROR';

const Universities: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'PUBLIC' | 'PRIVATE' | 'KMTC' | 'TVET'>('ALL');
  
  const [selectedUni, setSelectedUni] = useState<{name: string, apiSlug: string} | null>(null);
  const [blueprintData, setBlueprintData] = useState<GroundedResponse | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>('IDLE');

  const allInstitutions = useMemo(() => {
    const unis = UNIVERSITIES;
    const kmtcs = KMTC_CAMPUSES.map(name => ({ 
      id: `kmtc-${name}`, 
      apiSlug: `kmtc-${name.toLowerCase()}`,
      name: `KMTC ${name}`, 
      category: 'KMTC' as const, 
      description: 'Kenya Medical Training College - Specialized healthcare and clinical training excellence.', 
      logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=128&h=128&fit=crop&q=80' 
    }));
    const polytechs = NATIONAL_POLYTECHNICS.map(name => ({ 
      id: `poly-${name}`, 
      apiSlug: name.toLowerCase().replace(/\s+/g, '-'),
      name, 
      category: 'TVET' as const, 
      description: 'Accredited National Polytechnic - Leading the way in vocational training and applied technology.', 
      logo: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=128&h=128&fit=crop&q=80' 
    }));
    return [...unis, ...kmtcs, ...polytechs];
  }, []);

  const filteredInstitutions = useMemo(() => {
    return allInstitutions.filter(inst => {
      const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'ALL' || inst.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allInstitutions, searchTerm, activeCategory]);

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleFetchCourses = async (inst: {name: string, apiSlug: string}) => {
    triggerHaptic();
    setSelectedUni(inst);
    setFetchStatus('CONNECTING');
    setBlueprintData(null);
    
    try {
      const data = await getUniversityCourses(inst.name);
      setBlueprintData(data);
      setFetchStatus('SUCCESS');
    } catch (err) {
      console.error("Fetch Error:", err);
      setFetchStatus('ERROR');
    }
  };

  const handleDownloadBlueprint = () => {
    triggerHaptic();
    if (!blueprintData) return;
    const blob = new Blob([blueprintData.text], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedUni?.apiSlug}_2025_Blueprint.txt`;
    link.click();
  };

  return (
    <div className="py-12 md:py-32 px-4 md:px-6 bg-black min-h-screen page-transition relative">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 md:mb-24 space-y-6 md:space-y-10 max-w-5xl">
          <div className="inline-flex items-center gap-3 bg-red-600/10 border border-red-600/20 px-4 md:px-5 py-2 md:py-2.5 rounded-full">
            <Network size={14} md:size={16} className="text-red-500" />
            <span className="text-[8px] md:text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Real-Time Grounding Active</span>
          </div>
          <h1 className="text-4xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-white">THE <span className="text-red-600">REGISTRY.</span></h1>
          <p className="text-gray-400 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl">
            Access 2025/2026 intake data for all 67 Chartered Universities. Verified via live Google Search grounding.
          </p>
          
          <div className="flex flex-col xl:flex-row gap-6 md:gap-8 pt-6">
            <div className="relative flex-grow group">
               <Search className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={20} md:size={24} />
               <input 
                 type="text" 
                 placeholder="Search institution..."
                 className="w-full h-14 md:h-24 bg-white/[0.03] border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] pl-14 md:pl-20 pr-6 text-base md:text-xl font-black outline-none focus:border-red-600/50 transition-all placeholder:text-gray-800 text-white"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex bg-white/5 p-1.5 md:p-2 rounded-2xl md:rounded-[2rem] border border-white/5 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {['ALL', 'PUBLIC', 'PRIVATE', 'KMTC', 'TVET'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => { triggerHaptic(); setActiveCategory(cat as any); }}
                  className={`px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {filteredInstitutions.map((inst, idx) => (
            <div 
              key={inst.id} 
              className="group bg-gray-900/20 rounded-3xl md:rounded-[3.5rem] border border-white/5 p-6 md:p-12 hover:border-red-600/40 transition-all flex flex-col justify-between h-full shadow-2xl relative overflow-hidden"
              style={{ animationDelay: `${Math.min(idx * 0.02, 1)}s` }}
            >
              <div className="space-y-6 md:space-y-8 relative z-10">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-white/10 border border-white/5 shadow-xl">
                         <img src={inst.logo} alt={inst.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${
                        inst.category === 'PUBLIC' ? 'bg-red-600 text-white' : 
                        inst.category === 'PRIVATE' ? 'bg-blue-600 text-white' :
                        inst.category === 'KMTC' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {inst.category}
                      </span>
                   </div>
                   <Award size={18} md:size={20} className="text-gray-800 group-hover:text-red-600 transition-colors" />
                </div>

                <h3 className="text-xl md:text-4xl font-black tracking-tighter text-white leading-tight group-hover:text-red-500 transition-colors uppercase">{inst.name}</h3>
                <p className="text-gray-500 text-sm md:text-lg font-medium leading-relaxed italic border-l-2 border-red-600/30 pl-4 md:pl-8 line-clamp-3">
                  {inst.description || 'Verified Kenyan institution providing high-tier professional education.'}
                </p>
              </div>

              <div className="pt-8 md:pt-12 flex flex-col sm:flex-row gap-4 relative z-10">
                 <button 
                   onClick={() => handleFetchCourses({name: inst.name, apiSlug: inst.apiSlug})}
                   className="w-full sm:flex-1 bg-white text-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer touch-manipulation"
                 >
                   <BookOpen size={14} md:size={16} /> Course Blueprint
                 </button>
                 <button 
                   onClick={() => { triggerHaptic(); navigate('/grade-input'); }}
                   className="w-full sm:flex-1 bg-white/5 text-red-600 px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10 cursor-pointer text-center touch-manipulation"
                 >
                   Verify Merit
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REAL-TIME GROUNDED BLUEPRINT MODAL */}
      {selectedUni && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-0 sm:p-4 md:p-6">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => fetchStatus !== 'CONNECTING' && fetchStatus !== 'FETCHING' && setSelectedUni(null)}></div>
           <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-5xl bg-white text-black sm:rounded-3xl md:rounded-[4rem] shadow-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
              <header className="p-5 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 sticky top-0 z-10">
                 <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
                    <div className="hidden xs:flex w-10 h-10 md:w-16 md:h-16 bg-black rounded-xl md:rounded-3xl items-center justify-center text-white shrink-0">
                       <FileText size={20} md:size={32} />
                    </div>
                    <div className="overflow-hidden">
                       <h2 className="text-lg md:text-3xl font-black tracking-tighter uppercase leading-none truncate pr-2">{selectedUni.name}</h2>
                       <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-1 md:mt-2">2025/2026 OFFICIAL BLUEPRINT</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 shrink-0">
                   {fetchStatus === 'SUCCESS' && blueprintData && (
                     <button 
                       onClick={handleDownloadBlueprint} 
                       className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center cursor-pointer"
                       title="Download Blueprint"
                     >
                       <Download size={18} />
                     </button>
                   )}
                   <button 
                    onClick={() => { triggerHaptic(); setSelectedUni(null); }} 
                    className="p-3 bg-black text-white rounded-xl hover:bg-red-600 transition-all shadow-xl flex items-center justify-center cursor-pointer"
                   >
                     <X size={20} />
                   </button>
                 </div>
              </header>

              <div className="p-6 md:p-12 lg:p-16 overflow-y-auto flex-grow custom-scrollbar">
                 {(fetchStatus === 'CONNECTING' || fetchStatus === 'FETCHING' || fetchStatus === 'PARSING') ? (
                   <div className="py-12 md:py-24 flex flex-col items-center justify-center text-center space-y-8 md:space-y-10">
                      <div className="relative">
                         <Loader2 size={60} md:size={100} className="text-red-600 animate-spin stroke-[1.5]" />
                         <Cpu size={20} md:size={32} className="absolute inset-0 m-auto text-red-400" />
                      </div>
                      <div className="space-y-4 md:space-y-6 px-4 max-w-md">
                        <h3 className="text-xl md:text-4xl font-black tracking-tighter uppercase">
                          {fetchStatus === 'CONNECTING' ? 'Establishing Handshake...' : fetchStatus === 'FETCHING' ? 'Grounding Records...' : 'Finalizing Registry...'}
                        </h3>
                        <div className="w-full h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div className={`h-full bg-red-600 transition-all duration-700 ${
                             fetchStatus === 'CONNECTING' ? 'w-1/3' : 
                             fetchStatus === 'FETCHING' ? 'w-2/3' : 'w-full'
                           }`}></div>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">VERIFYING AGAINST 2025 OFFICIAL UNIVERSITY DATABASES</p>
                      </div>
                   </div>
                 ) : fetchStatus === 'SUCCESS' && blueprintData ? (
                   <div className="space-y-12 md:space-y-16 animate-in fade-in duration-1000">
                      <div className="prose prose-sm md:prose-xl prose-red max-w-none text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                        {blueprintData.text}
                      </div>

                      {blueprintData.sources.length > 0 && (
                        <div className="pt-10 md:pt-16 border-t border-gray-100">
                           <h4 className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-6 md:mb-8 flex items-center gap-3">
                             <LinkIcon size={12} md:size={14} className="text-red-600" /> Source Grounds
                           </h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              {blueprintData.sources.map((source, i) => (
                                <a 
                                  key={i} 
                                  href={source.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 hover:border-red-600/30 hover:bg-white transition-all group"
                                >
                                   <div className="flex flex-col overflow-hidden">
                                      <span className="text-[10px] md:text-xs font-black uppercase tracking-tight text-black group-hover:text-red-600 transition-colors truncate">{source.title}</span>
                                      <span className="text-[8px] md:text-[9px] font-bold text-gray-400 truncate max-w-[140px] md:max-w-[200px]">{source.uri}</span>
                                   </div>
                                   <ExternalLink size={14} md:size={16} className="text-gray-300 group-hover:text-red-600 shrink-0" />
                                </a>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                 ) : (
                   <div className="py-12 md:py-24 text-center space-y-6">
                      <ShieldAlert size={48} md:size={64} className="text-red-600 mx-auto" />
                      <h3 className="text-xl md:text-3xl font-black uppercase text-gray-800">Connection Interrupted</h3>
                      <p className="text-gray-500 font-bold italic text-sm md:text-base">System timed out while grounding 2025 records. Please ensure you have an active internet connection.</p>
                      <button onClick={() => { triggerHaptic(); setSelectedUni(null); }} className="bg-black text-white px-8 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest cursor-pointer">Retry Selection</button>
                   </div>
                 )}
              </div>
              <footer className="p-6 md:p-10 border-t border-gray-100 bg-gray-50/80 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center gap-3 md:gap-4 text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <ShieldCheck size={14} md:size={18} className="text-green-600" /> Grounded Analysis Complete
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                      onClick={() => { triggerHaptic(); navigate('/grade-input'); }}
                      className="w-full md:w-auto bg-black text-white px-8 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95 cursor-pointer text-center"
                    >
                      MATCH MY MERIT
                    </button>
                 </div>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};

export default Universities;
