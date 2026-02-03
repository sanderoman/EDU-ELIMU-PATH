
import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Plus, Trash2, Database, Search, ChevronRight, Activity, Smartphone, Key, Lock, Fingerprint, ShieldAlert, CheckCircle, TrendingUp, DollarSign, Eye, EyeOff, ShieldX } from 'lucide-react';
import { fetchCourses } from '../constants';
import { Course, PaymentRecord, MasterKey } from '../types';

const AdminDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'finance' | 'otp' | 'security'>('finance');
  const [transactions, setTransactions] = useState<PaymentRecord[]>([]);
  const [masterKeys, setMasterKeys] = useState<MasterKey[]>([]);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [showRawMsg, setShowRawMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const load = () => {
        setTransactions(JSON.parse(localStorage.getItem('edupath_transactions') || '[]'));
        setMasterKeys(JSON.parse(localStorage.getItem('edupath_master_keys') || '[]'));
      };
      load();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // WARNING: This is a demo implementation only
    // In production, implement proper server-side authentication
    if (username === 'KUCCPS' && password === '3333') setIsLoggedIn(true);
    else alert('Unauthorized Terminal Access Attempt.');
  };

  const generateKey = () => {
    if (!newKeyLabel.trim()) return alert("Label required.");
    const newCode = crypto.randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase();
    const newKey: MasterKey = {
      id: crypto.randomUUID().replace(/-/g, '').substring(0, 9),
      code: newCode,
      label: newKeyLabel,
      createdAt: new Date().toISOString()
    };
    const updated = [newKey, ...masterKeys];
    setMasterKeys(updated);
    localStorage.setItem('edupath_master_keys', JSON.stringify(updated));
    setNewKeyLabel('');
  };

  const deleteKey = (id: string) => {
    const updated = masterKeys.filter(k => k.id !== id);
    setMasterKeys(updated);
    localStorage.setItem('edupath_master_keys', JSON.stringify(updated));
  };

  const clearLogs = () => {
    if (window.confirm("Purge all Financial Ledger entries?")) {
      localStorage.removeItem('edupath_transactions');
      localStorage.removeItem('edupath_used_ids');
      setTransactions([]);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-white/5 p-12 md:p-16 rounded-[4rem] w-full max-w-xl text-center shadow-3xl">
          <Fingerprint size={64} className="text-red-600 mx-auto mb-10" />
          <h1 className="text-4xl font-black mb-12 tracking-tighter uppercase">Admin <span className="text-red-600">Terminal.</span></h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" placeholder="Terminal ID"
              className="w-full h-20 bg-black border-2 border-white/5 rounded-3xl text-center text-xl font-black text-white focus:border-red-600 outline-none transition-all"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" placeholder="Key"
              className="w-full h-20 bg-black border-2 border-white/5 rounded-3xl text-center text-xl font-black text-white focus:border-red-600 outline-none transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-red-600 text-white h-24 rounded-3xl font-black text-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 shadow-2xl">
              SYNC ACCESS <ChevronRight />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const fraudAttempts = transactions.filter(t => t.status === 'FraudAttempt');
  const validTransactions = transactions.filter(t => t.status === 'Completed');

  return (
    <div className="min-h-screen bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 border-b border-white/5 pb-16">
           <div className="space-y-4">
             <div className="flex items-center gap-3">
               <ShieldAlert size={16} className="text-red-600" />
               <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">System Control Unit</div>
             </div>
             <h1 className="text-6xl font-black tracking-tighter uppercase">EDU <span className="text-red-600">COMMAND.</span></h1>
           </div>
           
           <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
              {['finance', 'otp', 'security'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-red-600 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
                >
                  {tab === 'finance' ? 'Revenue Ledger' : tab === 'otp' ? 'Master Keys' : 'Security Audit'}
                </button>
              ))}
           </div>
        </header>

        {activeTab === 'finance' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-gray-900 border border-white/5 p-12 rounded-[3.5rem] shadow-2xl group hover:border-red-600/30 transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <TrendingUp className="text-red-600" size={32} />
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valid Syncs</div>
                  </div>
                  <div className="text-7xl font-black text-white tracking-tighter">{validTransactions.length}</div>
               </div>
               <div className="bg-red-600 border border-red-500 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <DollarSign className="text-white" size={32} />
                      <div className="text-[10px] font-black text-red-100 uppercase tracking-widest">Gross Revenue</div>
                    </div>
                    <div className="text-7xl font-black text-white tracking-tighter">KES {(validTransactions.length * 150).toLocaleString()}</div>
                  </div>
               </div>
               <div className="bg-gray-900 border border-white/5 p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-between">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Security Operations</div>
                  <button onClick={clearLogs} className="w-full bg-white/5 text-gray-400 border border-white/5 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">
                    Wipe Database & Keys
                  </button>
               </div>
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-[4rem] overflow-hidden shadow-3xl">
               <div className="p-10 border-b border-white/5 bg-black/40 flex justify-between items-center">
                  <h3 className="font-black uppercase tracking-[0.4em] text-[10px] text-gray-400">Transaction Registry</h3>
                  <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle size={14} /> Global Sync: Active
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-white/5 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                           <th className="p-10">M-Pesa ID</th>
                           <th className="p-10">Candidate</th>
                           <th className="p-10">Method</th>
                           <th className="p-10">Status</th>
                           <th className="p-10">Timestamp</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {transactions.map(t => (
                           <tr key={t.id} className="hover:bg-white/5 transition-all group">
                              <td className="p-10 font-black text-xl tracking-tighter text-red-600">{t.transactionId?.toUpperCase()}</td>
                              <td className="p-10 font-black text-lg">{t.studentName}</td>
                              <td className="p-10">
                                <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black">{t.verifiedBy}</span>
                              </td>
                              <td className="p-10">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  t.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 
                                  t.status === 'FraudAttempt' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500'
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="p-10 text-gray-600 text-[11px] font-bold">{new Date(t.timestamp).toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  {transactions.length === 0 && (
                    <div className="p-32 text-center text-gray-800 font-black uppercase tracking-[0.6em]">No Registry Data</div>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'otp' && (
          <div className="grid lg:grid-cols-12 gap-16">
             <div className="lg:col-span-5">
                <div className="bg-gray-900 border border-white/5 p-12 rounded-[3.5rem] shadow-2xl space-y-10">
                   <h3 className="text-3xl font-black tracking-tighter">Master <span className="text-red-600">Keys.</span></h3>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Issuance ID</label>
                      <input 
                        type="text" placeholder="e.g. Helpdesk Manual"
                        className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 font-black text-white focus:border-red-600 outline-none transition-all"
                        value={newKeyLabel} onChange={(e) => setNewKeyLabel(e.target.value)}
                      />
                   </div>
                   <button onClick={generateKey} className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:scale-[1.02] transition-all">
                     <Key size={24} /> GENERATE KEY
                   </button>
                </div>
             </div>
             <div className="lg:col-span-7 space-y-8">
                {masterKeys.map(k => (
                   <div key={k.id} className="bg-gray-900/50 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 font-black text-2xl tracking-widest">{k.code}</div>
                         <div><div className="text-white font-black text-xl">{k.label}</div><div className="text-gray-600 text-[10px] font-bold mt-1 uppercase">Issued: {new Date(k.createdAt).toLocaleDateString()}</div></div>
                      </div>
                      <button onClick={() => deleteKey(k.id)} className="p-4 text-gray-700 hover:text-red-600 transition-colors"><Trash2 size={24} /></button>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-red-600 p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-between">
                  <ShieldX className="text-white mb-6" size={48} />
                  <div>
                    <div className="text-6xl font-black text-white">{fraudAttempts.length}</div>
                    <div className="text-[10px] font-black text-red-200 uppercase tracking-widest">Fraud Flags Intercepted</div>
                  </div>
               </div>
               <div className="bg-gray-900 border border-white/5 p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-between">
                  <Database className="text-gray-600 mb-6" size={48} />
                  <div>
                    <div className="text-6xl font-black text-white">{transactions.length}</div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Payloads Archived</div>
                  </div>
               </div>
            </div>

            <div className="bg-gray-900 border border-white/5 rounded-[4rem] overflow-hidden shadow-3xl">
               <div className="p-10 border-b border-white/5 bg-black/40">
                  <h3 className="font-black uppercase tracking-[0.4em] text-[10px] text-gray-400">Security Audit Logs (Raw Feed)</h3>
               </div>
               <div className="divide-y divide-white/5">
                  {transactions.map(t => (
                    <div key={t.id} className="p-10 space-y-6 hover:bg-white/[0.02] transition-all">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${t.status === 'FraudAttempt' ? 'bg-red-600 text-white animate-pulse' : 'bg-white/5 text-gray-400'}`}>
                                {t.status}
                             </span>
                             <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">TX ID: {t.transactionId || 'NULL'}</span>
                          </div>
                          <span className="text-gray-700 text-[10px] font-bold">{new Date(t.timestamp).toLocaleString()}</span>
                       </div>
                       
                       <div className="bg-black/60 rounded-3xl p-8 border border-white/5 font-mono text-sm text-gray-400 relative">
                          <div className="absolute top-4 right-4 text-[10px] font-black text-gray-700 uppercase tracking-widest">Captured SMS Body</div>
                          {showRawMsg === t.id ? (
                            <div className="space-y-4">
                              <p className="whitespace-pre-wrap">{t.rawMessage || 'No content captured.'}</p>
                              {t.reason && <p className="text-red-500 font-black">REASON: {t.reason}</p>}
                              <button onClick={() => setShowRawMsg(null)} className="text-red-600 flex items-center gap-2 hover:underline"><EyeOff size={14}/> Hide Data</button>
                            </div>
                          ) : (
                            <button onClick={() => setShowRawMsg(t.id)} className="text-gray-600 flex items-center gap-2 hover:text-white transition-all"><Eye size={14}/> Decrypt Payload</button>
                          )}
                       </div>
                    </div>
                  ))}
                  {transactions.length === 0 && <div className="p-32 text-center text-gray-800 font-black uppercase tracking-[0.4em]">Security Logs Empty</div>}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
