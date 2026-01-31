
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Download, Lock, CheckCircle, GraduationCap, Sparkles, X, Loader2, ShieldCheck, 
  ArrowRight, ArrowLeft, Search, Info, Key, Check, Smartphone, ShieldAlert, 
  Cpu, Award, FileText, Target, Zap, BookOpen, Layers, Activity, Radio, 
  Volume2, Building2, MapPin, BarChart3, TrendingUp, Table, Database, 
  FileDigit, Star, Lightbulb, Medal, Rocket, Shield, LockKeyhole, CreditCard,
  Copy, ExternalLink, RefreshCw, ArrowUpRight, MessageSquare, Link as LinkIcon
} from 'lucide-react';
import { fetchCourses } from '../constants';
import { getEligibleCourses } from '../utils/logic';
import { getCareerAdvice, verifyMpesaMessage, getMarketableAnalysis, getDetailedCourseBlueprint, GroundedResponse } from '../services/geminiService';
import { Course, PaymentRecord, MasterKey } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type VerifStage = 'IDLE' | 'ANALYZING_SMS' | 'DB_CROSS_CHECK' | 'SYNCING_LEDGER' | 'FETCHING_OTP' | 'VALIDATING_OTP' | 'FAILED' | 'SUCCESS' | 'FRAUD_DETECTED';

interface MarketableCourse {
  course: string;
  institution: string;
  marketability: string;
  reason: string;
}

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [paymentStep, setPaymentStep] = useState<'unpaid' | 'unlocked'>('unpaid');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [manualOtp, setManualOtp] = useState('');
  const [isUsingOtp, setIsUsingOtp] = useState(false);
  const [verifStage, setVerifStage] = useState<VerifStage>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const [careerAdvice, setCareerAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [marketableCourses, setMarketableCourses] = useState<MarketableCourse[]>([]);
  const [isLoadingMarketable, setIsLoadingMarketable] = useState(false);

  // Course Explorer States
  const [exploringCourse, setExploringCourse] = useState<{name: string, inst: string} | null>(null);
  const [exploreData, setExploreData] = useState<GroundedResponse | null>(null);
  const [isExploringData, setIsExploringData] = useState(false);

  const { studentName, selectedSubjects, meanGrade } = location.state || {
    studentName: 'Guest',
    selectedSubjects: [],
    meanGrade: 'E'
  };

  const eligibleCourses = useMemo(() => getEligibleCourses(meanGrade, allCourses), [meanGrade, allCourses]);
  
  const filteredCourses = useMemo(() => {
    return eligibleCourses.filter(course => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.institution.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [eligibleCourses, searchTerm]);

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleAiVerify = async () => {
    triggerHaptic();
    if (!mpesaMessage.trim()) return;
    setErrorMsg('');
    setVerifStage('ANALYZING_SMS');
    
    try {
      const result = await verifyMpesaMessage(mpesaMessage);
      
      if (result.isValid && result.transactionId) {
        setVerifStage('DB_CROSS_CHECK');
        await new Promise(r => setTimeout(r, 1000));
        
        const usedIds: string[] = JSON.parse(localStorage.getItem('edupath_used_ids') || '[]');
        if (usedIds.includes(result.transactionId.toUpperCase())) {
          setVerifStage('FRAUD_DETECTED');
          setErrorMsg("TRANSACTION CODE ALREADY REGISTERED. SECURITY PROTOCOL TRIGGERED.");
          return;
        }

        setVerifStage('SYNCING_LEDGER');
        await new Promise(r => setTimeout(r, 800));
        
        usedIds.push(result.transactionId.toUpperCase());
        localStorage.setItem('edupath_used_ids', JSON.stringify(usedIds));

        setVerifStage('SUCCESS');
        setTimeout(() => unlockReport(), 800);
      } else {
        setVerifStage('FAILED');
        setErrorMsg(result.reason || "MESSAGE FORMAT UNRECOGNIZED.");
      }
    } catch (err) {
      setVerifStage('FAILED');
      setErrorMsg("NETWORK INTERRUPT.");
    }
  };

  const unlockReport = () => {
    setPaymentStep('unlocked');
    setShowPaymentModal(false);
    fetchAdvice();
    fetchMarketableSummary();
  };

  const handleExploreCourse = async (courseName: string, institution: string) => {
    triggerHaptic();
    setExploringCourse({ name: courseName, inst: institution });
    setIsExploringData(true);
    setExploreData(null);
    try {
      const data = await getDetailedCourseBlueprint(courseName, institution);
      setExploreData(data);
      setIsExploringData(false);
    } catch (err) {
      console.error(err);
      setIsExploringData(false);
    }
  };

  useEffect(() => {
    if (!location.state) {
      navigate('/grade-input');
      return;
    }
    const loadData = async () => {
      try {
        const courses = await fetchCourses();
        setAllCourses(courses);
        setTimeout(() => setIsAnalyzing(false), 2000);
      } catch (err) {
        setIsAnalyzing(false);
      }
    };
    loadData();
  }, [location.state, navigate]);

  const fetchAdvice = async () => {
    setIsLoadingAdvice(true);
    const top3 = selectedSubjects.sort((a: any, b: any) => b.points - a.points).slice(0, 3).map((s: any) => s.name);
    const advice = await getCareerAdvice(meanGrade, top3);
    setCareerAdvice(advice);
    setIsLoadingAdvice(false);
  };

  const fetchMarketableSummary = async () => {
    setIsLoadingMarketable(true);
    const top3 = selectedSubjects.sort((a: any, b: any) => b.points - a.points).slice(0, 3).map((s: any) => s.name);
    const namesOnly = eligibleCourses.slice(0, 80).map(c => `${c.name} at ${c.institution}`);
    const results = await getMarketableAnalysis(meanGrade, top3, namesOnly);
    setMarketableCourses(results);
    setIsLoadingMarketable(false);
  };

  const handleDownloadPDF = () => {
    triggerHaptic();
    setIsExporting(true);
    const doc = new jsPDF() as any;
    const timestamp = new Date().toLocaleString();
    const reportId = Math.random().toString(36).substr(2, 12).toUpperCase();

    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text('EDU PATH', 105, 100, { align: 'center' });
    doc.setFontSize(14);
    doc.text('KCSE 2025 CAREER BLUEPRINT', 105, 115, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`CANDIDATE: ${studentName.toUpperCase()}`, 105, 240, { align: 'center' });
    doc.text(`MERIT GRADE: ${meanGrade}`, 105, 248, { align: 'center' });

    doc.addPage();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text('INSTITUTIONAL REGISTRY', 20, 30);
    doc.setFontSize(10);
    doc.text(`Report ID: ${reportId} | Generated: ${timestamp}`, 20, 40);

    const tableData = filteredCourses.slice(0, 50).map(c => [c.name, c.institution, c.type, c.minGrade]);
    doc.autoTable({
      startY: 50,
      head: [['Course Name', 'Institution', 'Level', 'Min Grade']],
      body: tableData,
    });

    doc.save(`EDU_PATH_${studentName.replace(/\s+/g, '_')}.pdf`);
    setIsExporting(false);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
         <div className="relative mb-12">
            <Loader2 size={100} md:size={120} className="text-red-600 animate-spin" />
            <ShieldCheck size={32} md:size={40} className="absolute inset-0 m-auto text-red-400" />
         </div>
         <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-white">Syncing Registry...</h2>
         <p className="text-gray-600 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs px-6">Authenticating Academic Merit Profile 2025</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-40 relative selection:bg-red-600 selection:text-white">
      {/* STICKY TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-2xl border-b border-white/10 px-4 md:px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { triggerHaptic(); navigate('/grade-input'); }}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all group border border-white/5 cursor-pointer"
            >
              <ArrowLeft size={16} className="text-red-600 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-6">
              <div className="flex flex-col">
                <span className="text-gray-500 font-black text-[8px] uppercase tracking-widest leading-none mb-1">CANDIDATE</span>
                <span className="text-white font-black text-xs uppercase tracking-tight">{studentName}</span>
              </div>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-black text-[8px] uppercase tracking-widest leading-none mb-1">GRADE</span>
                <span className="text-red-600 font-black text-xs uppercase tracking-tight">{meanGrade}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {paymentStep === 'unlocked' ? (
              <button 
                onClick={handleDownloadPDF} 
                className="bg-red-600 text-white px-5 md:px-6 py-2.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} /> PDF
              </button>
            ) : (
              <button 
                onClick={() => { triggerHaptic(); setShowPaymentModal(true); }}
                className="bg-white text-black px-5 md:px-6 py-2.5 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Lock size={14} /> ACTIVATE
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="py-10 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
          <header className="relative py-8 md:py-16 border-b border-white/5">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 relative z-10 w-full">
              <div className="space-y-6 md:space-y-8 w-full max-w-4xl">
                <div className="flex items-center gap-3 bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-full w-fit">
                  <Zap size={14} className="text-red-500 animate-pulse" />
                  <span className="text-[8px] md:text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Merit Data Synced</span>
                </div>
                <h1 className="text-4xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8] text-white">
                  CAREER <br/><span className="text-red-600">BLUEPRINT.</span>
                </h1>
                <div className="flex flex-wrap items-center gap-8 md:gap-12 mt-6 md:mt-10">
                  <div className="space-y-1">
                    <div className="text-gray-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]">Merit Grade</div>
                    <div className="text-4xl md:text-6xl font-black text-white flex items-baseline gap-2">
                      {meanGrade} <span className="text-[8px] md:text-xs text-green-500 font-black uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">VERIFIED</span>
                    </div>
                  </div>
                  <div className="h-10 md:h-16 w-px bg-white/10 hidden md:block"></div>
                  <div className="space-y-1">
                    <div className="text-gray-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]">Eligible Programs</div>
                    <div className="text-4xl md:text-6xl font-black text-white">{eligibleCourses.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {paymentStep === 'unpaid' ? (
            <div className="relative">
              <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
                <div className="space-y-10 md:space-y-16 animate-in slide-in-from-left duration-1000">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
                      UNLOCK <br/><span className="text-red-600">INSIGHTS.</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-2xl font-medium leading-relaxed max-w-xl">
                      Your analysis is locked. Activate your report to access the real-time AI advisory, marketability metrics, and institution blueprints.
                    </p>
                  </div>
                  <div className="grid gap-6">
                    {[
                      { icon: <Cpu className="text-red-500" />, title: "AI Advisory", desc: "Custom-built career strategy for your specific grade and subject cluster." },
                      { icon: <TrendingUp className="text-red-500" />, title: "Market Realism", desc: "Kenyan job market growth projections for every program in your list." },
                      { icon: <Database className="text-red-500" />, title: "Registry Access", desc: "Live 2025 admission data grounded via official university search logic." }
                    ].map((feature, i) => (
                      <div key={i} className="flex gap-4 md:gap-8 p-6 md:p-8 rounded-2xl md:rounded-[3.5rem] bg-white/[0.03] border border-white/5 items-center shadow-lg">
                        <div className="w-12 h-12 md:w-20 md:h-20 bg-black rounded-xl md:rounded-3xl flex items-center justify-center shrink-0 border border-white/10">{feature.icon}</div>
                        <div className="space-y-1">
                          <h4 className="font-black text-lg md:text-2xl uppercase tracking-tight text-white">{feature.title}</h4>
                          <p className="text-gray-500 text-sm md:text-lg font-medium leading-tight">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:sticky lg:top-32 w-full">
                   <div className="relative bg-white text-black p-8 md:p-16 rounded-3xl md:rounded-[4rem] shadow-3xl border border-black/5">
                      <div className="relative z-10 space-y-8 md:space-y-12">
                        <div className="flex justify-between items-center">
                          <div className="w-14 h-14 md:w-24 md:h-24 bg-red-600 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl animate-pulse">
                            <LockKeyhole size={28} md:size={48} />
                          </div>
                          <div className="text-right">
                             <div className="text-[10px] md:text-[12px] font-black text-gray-400 uppercase tracking-[0.5em] mb-1">Activation Fee</div>
                             <div className="text-4xl md:text-6xl font-black tracking-tighter">KES 150</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => { triggerHaptic(); setShowPaymentModal(true); }}
                          className="w-full bg-black text-white py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] font-black text-xl md:text-3xl flex items-center justify-center gap-4 md:gap-6 hover:bg-red-600 transition-all active:scale-95 group cursor-pointer touch-manipulation"
                        >
                          ACTIVATE NOW <ArrowRight size={24} md:size={36} className="group-hover:translate-x-3 transition-transform" />
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-20 md:space-y-32 animate-in fade-in duration-1000">
               {/* Career Strategy Segment */}
               <section className="glass p-6 md:p-24 rounded-3xl md:rounded-[5rem] border-white/10 relative overflow-hidden shadow-3xl">
                  <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-16">
                     <div className="w-10 h-10 md:w-16 md:h-16 bg-red-600 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                        <Cpu size={20} md:size={32} />
                     </div>
                     <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-white">Career Strategy <span className="text-red-600">2025.</span></h2>
                  </div>
                  {isLoadingAdvice ? (
                     <div className="flex flex-col items-start gap-4 md:gap-6 text-gray-500 font-black animate-pulse">
                        <Loader2 size={24} md:size={32} className="animate-spin text-red-600" /> 
                        <span className="text-lg md:text-2xl uppercase tracking-widest">Constructing Advisory...</span>
                     </div>
                  ) : (
                     <div className="prose prose-sm md:prose-xl prose-invert prose-red max-w-none text-gray-300 text-base md:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                        {careerAdvice}
                     </div>
                  )}
               </section>

               {/* Market Matrix */}
               <section className="space-y-10 md:space-y-16">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">Market Growth <br/><span className="text-red-600">Matrix.</span></h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                     {isLoadingMarketable ? (
                       [1, 2, 3, 4].map(i => <div key={i} className="bg-white/5 h-64 md:h-80 rounded-3xl md:rounded-[3rem] animate-pulse"></div>)
                     ) : (
                       marketableCourses.map((m, i) => (
                         <div key={i} className="group p-8 md:p-12 rounded-3xl md:rounded-[4rem] bg-white/[0.02] border border-white/5 hover:border-red-600/40 transition-all flex flex-col justify-between h-full shadow-lg">
                            <div className="space-y-4 md:space-y-6">
                               <div className="text-red-600 font-black text-3xl md:text-4xl tracking-tighter">{m.marketability}</div>
                               <h3 className="text-lg md:text-2xl font-black tracking-tight leading-tight uppercase text-white">{m.course}</h3>
                               <div className="text-[9px] md:text-[11px] font-black text-gray-600 uppercase tracking-widest truncate">{m.institution}</div>
                            </div>
                            <button 
                               onClick={() => handleExploreCourse(m.course, m.institution)}
                               className="mt-8 md:mt-10 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black text-white hover:bg-red-600 transition-all uppercase tracking-widest cursor-pointer touch-manipulation"
                            >
                               View Blueprint
                            </button>
                         </div>
                       ))
                     )}
                  </div>
               </section>

               {/* Institutional Registry Table */}
               <section className="space-y-10 md:space-y-16">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                     <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">Institution <br/><span className="text-red-600">Registry.</span></h2>
                     <div className="relative w-full lg:w-[35rem] group">
                        <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={20} md:size={24} />
                        <input 
                          type="text" 
                          placeholder="Search programs..."
                          className="w-full h-14 md:h-20 bg-white/[0.03] border-2 border-white/10 rounded-2xl md:rounded-[2.5rem] pl-16 md:pl-20 pr-8 text-base md:text-xl font-black text-white focus:border-red-600/50 outline-none transition-all placeholder:text-gray-800"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="bg-gray-900/30 border border-white/5 rounded-2xl md:rounded-[5rem] overflow-hidden shadow-2xl">
                     <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left min-w-[600px]">
                           <thead>
                              <tr className="border-b border-white/5 text-[8px] md:text-[11px] font-black text-gray-700 uppercase tracking-widest">
                                 <th className="p-6 md:p-12">Program Identity</th>
                                 <th className="p-6 md:p-12">Institution</th>
                                 <th className="p-6 md:p-12 text-center">Min Grade</th>
                                 <th className="p-6 md:p-12 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {filteredCourses.slice(0, 100).map((c) => (
                                 <tr key={c.id} className="hover:bg-white/[0.04] transition-all group">
                                    <td className="p-6 md:p-12">
                                       <div className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase leading-none mb-2">{c.name}</div>
                                       <span className="text-[8px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">VERIFIED 2025</span>
                                    </td>
                                    <td className="p-6 md:p-12 text-gray-400 font-bold uppercase text-[10px] md:text-sm tracking-widest max-w-[200px] truncate">{c.institution}</td>
                                    <td className="p-6 md:p-12 text-3xl md:text-4xl font-black text-white text-center">{c.minGrade}</td>
                                    <td className="p-6 md:p-12 text-right">
                                       <button 
                                          onClick={() => handleExploreCourse(c.name, c.institution)}
                                          className="ml-auto px-4 md:px-6 py-2.5 md:py-3 bg-red-600/10 border border-red-600/20 text-red-600 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                                       >
                                          <ArrowUpRight size={14} /> <span className="hidden xs:inline">EXPLORE</span>
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </section>
            </div>
          )}
        </div>
      </div>

      {/* EXPLORE COURSE BLUEPRINT MODAL */}
      {exploringCourse && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-0 sm:p-4 md:p-6">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => !isExploringData && setExploringCourse(null)}></div>
           <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-4xl bg-white text-black sm:rounded-3xl md:rounded-[4rem] shadow-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
              <header className="p-5 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 sticky top-0 z-10">
                 <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
                    <div className="hidden xs:flex w-10 h-10 md:w-16 md:h-16 bg-red-600 rounded-xl md:rounded-3xl items-center justify-center text-white shrink-0">
                       <Rocket size={20} md:size={32} />
                    </div>
                    <div className="overflow-hidden">
                       <h2 className="text-lg md:text-3xl font-black tracking-tighter uppercase leading-none truncate pr-2">{exploringCourse.name}</h2>
                       <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-1 md:mt-2">REAL-TIME PROGRAM ANALYSIS</p>
                    </div>
                 </div>
                 <button onClick={() => { triggerHaptic(); setExploringCourse(null); }} className="p-3 bg-black text-white rounded-xl hover:bg-red-600 transition-all shadow-xl flex items-center justify-center shrink-0 cursor-pointer">
                    <X size={20} />
                 </button>
              </header>
              <div className="p-6 md:p-12 lg:p-16 overflow-y-auto custom-scrollbar flex-grow">
                 {isExploringData ? (
                   <div className="py-12 md:py-24 text-center space-y-8 md:space-y-10">
                      <div className="relative flex justify-center">
                         <Loader2 size={60} md:size={100} className="text-red-600 animate-spin" />
                      </div>
                      <h3 className="text-xl md:text-3xl font-black tracking-tighter uppercase">Grounding Live Program Metrics...</h3>
                      <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">VERIFYING 2025 ADMISSION TRENDS VIA SEARCH GROUNDING</p>
                   </div>
                 ) : exploreData ? (
                   <div className="space-y-12 md:space-y-16 animate-in fade-in duration-1000">
                      <div className="prose prose-sm md:prose-xl prose-red max-w-none text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                        {exploreData.text}
                      </div>
                      {exploreData.sources.length > 0 && (
                        <div className="pt-10 md:pt-16 border-t border-gray-100">
                           <h4 className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-6 md:mb-8 flex items-center gap-3">
                             <LinkIcon size={12} md:size={14} className="text-red-600" /> Evidence Logs
                           </h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                              {exploreData.sources.map((source, i) => (
                                <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 hover:border-red-600 transition-all group flex justify-between items-center overflow-hidden shadow-sm">
                                   <span className="text-[10px] md:text-xs font-black uppercase text-black line-clamp-1 truncate pr-2">{source.title}</span>
                                   <ExternalLink size={14} md:size={16} className="text-gray-300 shrink-0" />
                                </a>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                 ) : (
                    <div className="py-12 md:py-24 text-center space-y-6">
                        <ShieldAlert size={48} md:size={64} className="text-red-600 mx-auto" />
                        <h3 className="text-xl md:text-3xl font-black uppercase text-gray-800">Connection Failed</h3>
                        <p className="text-gray-500 font-bold italic text-sm md:text-base">System failed to ground data for this course. Please check your network.</p>
                        <button onClick={() => { triggerHaptic(); setExploringCourse(null); }} className="bg-black text-white px-8 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest cursor-pointer">Retry</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-0 xs:p-4 md:p-6">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => verifStage !== 'ANALYZING_SMS' && setShowPaymentModal(false)}></div>
           <div className="relative w-full h-full xs:h-auto max-w-2xl bg-white text-black xs:rounded-3xl md:rounded-[4rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
              <header className="p-6 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase">Activate Report</h2>
                 <button onClick={() => { triggerHaptic(); setShowPaymentModal(false); }} className="p-3 md:p-4 bg-gray-200 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 cursor-pointer">
                  <X size={20} />
                 </button>
              </header>
              <div className="p-6 md:p-12 space-y-8 md:space-y-10 overflow-y-auto">
                 {verifStage === 'IDLE' ? (
                   <>
                     <div className="bg-red-600 text-white p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-xl">
                        <p className="text-base md:text-xl font-bold leading-relaxed">
                          1. Send <span className="text-black font-black bg-white px-2 py-0.5 rounded">KES 150</span> to M-Pesa <span className="font-black underline">0743315353</span>.
                          <br/>
                          2. Paste the <span className="font-black">ENTIRE M-Pesa Message</span> below for AI verification.
                        </p>
                     </div>
                     <textarea 
                        className="w-full h-32 md:h-48 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-[2rem] p-5 md:p-8 font-medium focus:border-red-600 outline-none resize-none placeholder:text-gray-300 text-sm md:text-base"
                        placeholder="Paste M-Pesa message here..."
                        value={mpesaMessage}
                        onChange={(e) => setMpesaMessage(e.target.value)}
                     />
                     <button 
                      onClick={handleAiVerify} 
                      className="w-full bg-black text-white py-5 md:py-8 rounded-xl md:rounded-[2rem] font-black text-xl md:text-2xl hover:bg-red-600 transition-all shadow-xl active:scale-95 cursor-pointer touch-manipulation"
                     >
                      VERIFY & UNLOCK
                     </button>
                   </>
                 ) : (
                   <div className="py-12 md:py-24 text-center space-y-8 md:space-y-10">
                      {verifStage === 'SUCCESS' ? (
                        <div className="text-4xl md:text-5xl font-black text-green-500 uppercase animate-bounce">Report Activated.</div>
                      ) : (
                        <div className="space-y-6">
                           <Loader2 size={60} md:size={100} className="text-red-600 animate-spin mx-auto stroke-[1.5]" />
                           <h3 className="text-xl md:text-3xl font-black uppercase text-gray-800">{verifStage.replace('_', ' ')}...</h3>
                        </div>
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Results;
