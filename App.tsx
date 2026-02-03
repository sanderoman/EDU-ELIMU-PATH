
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { Phone, GraduationCap, Menu, X, Terminal, ArrowLeft, ArrowUpRight, ArrowRight, ShieldCheck } from 'lucide-react';
import Landing from './pages/Landing';
import Universities from './pages/Universities';
import GradeInput from './pages/GradeInput';
import Results from './pages/Results';
import AdminDashboard from './pages/AdminDashboard';
import { CONTACT_PHONE } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStatusVisible, setIsStatusVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  };

  const toggleMenu = () => {
    triggerHaptic();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const extinguishStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    setIsStatusVisible(false);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_PHONE}`, '_blank');
  };

  const isHome = location.pathname === '/';

  // Lock body scroll when menu is active
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden selection:bg-red-600 selection:text-white font-sans">
      <ScrollToTop />
      
      {/* EXTINGUISHABLE SYSTEM STATUS BAR */}
      {isStatusVisible && (
        <div className="bg-red-600 text-white text-[9px] font-black py-2.5 px-4 md:px-6 flex justify-between items-center sticky top-0 z-[250] shadow-2xl uppercase tracking-[0.2em] animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="flex items-center gap-1.5"><Phone size={10} /> {CONTACT_PHONE}</span>
            <span className="hidden sm:inline-block opacity-30">|</span>
            <span className="hidden sm:inline-block flex items-center gap-1.5"><ShieldCheck size={10} /> SAFARICOM REAL-TIME API SYNCED</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/admin" onClick={closeMenu} className="flex items-center gap-1.5 hover:bg-white hover:text-black transition-all bg-black/20 px-3 py-1 rounded-md border border-white/10">
              <Terminal size={10} /> ADMIN
            </Link>
            <button onClick={openWhatsApp} className="hover:text-black transition-colors hidden xs:block cursor-pointer">
              SUPPORT
            </button>
            <button 
              onClick={extinguishStatus} 
              className="p-1 hover:bg-black/20 rounded transition-all ml-2 cursor-pointer active:scale-90"
              title="Extinguish Status Bar"
            >
              <X size={14} className="stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC STICKY NAVIGATION HEADER */}
      <header 
        className={`border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky z-[200] transition-all duration-500 ease-out ${isStatusVisible ? 'top-[34px]' : 'top-0'}`}
      >
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            {!isHome && (
              <button 
                onClick={() => { 
                  try {
                    triggerHaptic(); 
                    navigate(-1);
                  } catch (error) {
                    console.error('Navigation error:', error);
                  }
                }}
                className="p-3 bg-white/5 border border-white/10 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all group cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            )}
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:rotate-12 transition-transform">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white">EDU <span className="text-red-600">PATH</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em]">
            <Link to="/" className={`transition-all hover:text-red-500 ${location.pathname === '/' ? 'text-red-600' : 'text-gray-400'}`}>Home</Link>
            <Link to="/universities" className={`transition-all hover:text-red-500 ${location.pathname === '/universities' ? 'text-red-600' : 'text-gray-400'}`}>Registry</Link>
            <Link to="/grade-input" className={`transition-all hover:text-red-500 ${location.pathname === '/grade-input' ? 'text-red-600' : 'text-gray-400'}`}>Matcher</Link>
            <button 
              onClick={() => { 
                try {
                  triggerHaptic(); 
                  navigate('/grade-input');
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-black hover:bg-white hover:text-black transition-all shadow-xl active:scale-95 flex items-center gap-2 relative overflow-hidden group cursor-pointer"
            >
              <span className="relative z-10 uppercase tracking-widest text-[10px]">Analyze Merit</span>
              <ArrowUpRight size={16} className="relative z-10" />
            </button>
          </div>

          <button 
            className="md:hidden text-white p-3 hover:bg-white/5 rounded-xl transition-all cursor-pointer z-[260]" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={28} className="text-red-600" /> : <Menu size={28} />}
          </button>
        </nav>

        {/* EXTINGUISHABLE MOBILE MENU */}
        {isMenuOpen && (
          <>
            {/* Backdrop click to extinguish menu */}
            <div 
              className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[210] animate-in fade-in duration-300"
              onClick={closeMenu}
            />
            
            <div className={`md:hidden fixed inset-x-0 bg-black/95 backdrop-blur-3xl border-b border-white/10 p-6 md:p-10 flex flex-col gap-2 animate-in slide-in-from-top-10 duration-500 z-[220] h-auto rounded-b-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] ${isStatusVisible ? 'top-[114px]' : 'top-[80px]'}`}>
              <Link 
                to="/" 
                onClick={closeMenu} 
                className={`text-2xl font-black uppercase tracking-tighter py-6 border-b border-white/5 flex justify-between items-center group transition-colors ${location.pathname === '/' ? 'text-red-600' : 'text-white'}`}
              >
                Home <ArrowRight size={20} className="text-red-600" />
              </Link>
              <Link 
                to="/universities" 
                onClick={closeMenu} 
                className={`text-2xl font-black uppercase tracking-tighter py-6 border-b border-white/5 flex justify-between items-center group transition-colors ${location.pathname === '/universities' ? 'text-red-600' : 'text-white'}`}
              >
                The Registry <ArrowRight size={20} className="text-red-600" />
              </Link>
              <Link 
                to="/grade-input" 
                onClick={closeMenu} 
                className={`text-2xl font-black uppercase tracking-tighter py-6 border-b border-white/5 flex justify-between items-center group transition-colors ${location.pathname === '/grade-input' ? 'text-red-600' : 'text-white'}`}
              >
                Merit Matcher <ArrowRight size={20} className="text-red-600" />
              </Link>
              <div className="pt-8">
                <button 
                  onClick={() => { 
                    try {
                      triggerHaptic(); 
                      navigate('/grade-input'); 
                      closeMenu();
                    } catch (error) {
                      console.error('Navigation error:', error);
                    }
                  }}
                  className="bg-red-600 text-white w-full py-6 rounded-2xl font-black text-xl shadow-2xl shadow-red-600/20 active:scale-95 transition-all cursor-pointer uppercase tracking-widest"
                >
                  START ANALYSIS
                </button>
              </div>
              <p className="text-center text-[7px] font-black text-gray-800 uppercase tracking-[0.6em] mt-8 opacity-50">EDU PATH CRYPTO-VERIFIED CORE 2025</p>
            </div>
          </>
        )}
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/grade-input" element={<GradeInput />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <footer className="bg-black border-t border-white/5 py-12 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
             </div>
             <span className="text-xl font-black tracking-tighter uppercase text-white">EDU <span className="text-red-600">PATH</span></span>
          </div>
          <div className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] text-center md:text-left">
             © 2025 EDU PATH KENYA. BUILT ON NATIVE SAFARICOM DARAJA INTEGRATION.
          </div>
          <div className="flex gap-8 text-[9px] font-black text-gray-500 uppercase tracking-widest">
            <button onClick={openWhatsApp} className="hover:text-red-600 transition-colors cursor-pointer">Live Help</button>
            <Link to="/admin" className="hover:text-red-600 transition-colors">Admin Hub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
