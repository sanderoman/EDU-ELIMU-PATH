
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Calculator, ChevronRight, Info, BookCheck, Microscope, Landmark, PenTool, User, GraduationCap, Languages } from 'lucide-react';
import { Grade, GradeToPoints, SubjectGrade } from '../types';
import { SUBJECT_GROUPS } from '../constants';
import { calculateMeanGrade } from '../utils/logic';

const GradeInput: React.FC = () => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [subjectGrades, setSubjectGrades] = useState<Record<string, Grade | ''>>({});
  const [error, setError] = useState('');

  const grades: Grade[] = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

  const handleUpdateGrade = (subject: string, grade: Grade | '') => {
    setSubjectGrades(prev => ({ ...prev, [subject]: grade }));
    if (error) setError('');
  };

  const handleCalculate = () => {
    if (!studentName.trim()) {
      setError('Student name is required.');
      return;
    }

    const selectedGrades: SubjectGrade[] = Object.entries(subjectGrades)
      .filter(([_, grade]) => grade !== '')
      .map(([name, grade]) => ({
        name,
        grade: grade as Grade,
        points: GradeToPoints[grade as Grade]
      }));

    if (selectedGrades.length < 7) {
      setError(`Minimum 7 subjects required (Currently ${selectedGrades.length}).`);
      return;
    }

    if (selectedGrades.length > 8) {
      setError(`Maximum 8 subjects allowed (Currently ${selectedGrades.length}).`);
      return;
    }

    const meanGrade = calculateMeanGrade(selectedGrades);
    navigate('/results', { state: { studentName, selectedSubjects: selectedGrades, meanGrade } });
  };

  const getGroupIcon = (groupId: string) => {
    switch (groupId) {
      case 'group1': return <BookCheck className="text-red-600" size={24} />;
      case 'group2': return <Microscope className="text-red-600" size={24} />;
      case 'group3': return <Landmark className="text-red-600" size={24} />;
      case 'group5': return <Languages className="text-red-600" size={24} />;
      default: return <PenTool className="text-red-600" size={24} />;
    }
  };

  const subjectsCount = Object.values(subjectGrades).filter(g => g !== '').length;

  return (
    <div className="py-10 md:py-24 px-4 md:px-6 min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-white/[0.02] backdrop-blur-3xl p-6 md:p-16 lg:p-20 rounded-3xl md:rounded-[4rem] border border-white/5 shadow-2xl animate-in zoom-in-95 duration-1000 overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/40 to-transparent"></div>

          {/* Progress Indicator */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 md:mb-16">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-black tracking-tight uppercase text-white">Merit Engine</h2>
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Placement cycle 2025/26</p>
                </div>
             </div>
             <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                <div className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-black text-xs md:text-sm transition-all border text-center ${
                  subjectsCount >= 7 && subjectsCount <= 8 ? 'bg-green-600 text-white border-green-500' : 'bg-red-600 text-white border-red-500 animate-pulse'
                }`}>
                  {subjectsCount}/8 SUBJECTS COMPLETE
                </div>
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2 hidden xs:block">Target: 7 or 8 subjects</span>
             </div>
          </div>

          <header className="space-y-4 md:space-y-6 mb-12 md:mb-20 max-w-2xl">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase text-white">VERIFY <br/><span className="text-red-600">YOUR MERIT.</span></h1>
            <p className="text-gray-400 text-base md:text-xl font-medium leading-relaxed">
              Input your KCSE results exactly as they appear on your slip. EDU PATH uses direct placement logic to analyze your eligibility.
            </p>
          </header>

          <div className="space-y-12 md:space-y-20">
            {/* Student ID / Name Input */}
            <div className="relative group w-full lg:max-w-xl">
              <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3 md:mb-4 block ml-1">Candidate Full Name</label>
              <div className="relative">
                <User className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={20} md:size={24} />
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  className="w-full h-14 md:h-20 bg-white/[0.04] border-2 border-white/5 rounded-2xl md:rounded-[2rem] pl-14 md:pl-20 pr-6 text-lg md:text-xl font-black text-white focus:border-red-600/50 outline-none transition-all placeholder:text-gray-800"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
            </div>

            {/* Subject Groups */}
            <div className="space-y-16 md:space-y-24">
              {SUBJECT_GROUPS.map((group, idx) => (
                <section key={group.id} className="animate-in fade-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center gap-4 mb-6 md:mb-10">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shrink-0">
                      {getGroupIcon(group.id)}
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase text-white">{group.name}</h2>
                      <p className="text-gray-500 font-bold text-[9px] md:text-xs uppercase tracking-widest leading-none mt-1">{group.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {group.subjects.map((subject) => (
                      <div 
                        key={subject} 
                        className={`group p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 transition-all duration-300 ${
                          subjectGrades[subject] ? 'bg-red-600/10 border-red-600/40 shadow-lg' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                        }`}
                      >
                        <label className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4 truncate group-hover:text-white transition-colors">
                          {subject}
                        </label>
                        <select 
                          className={`w-full h-10 md:h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm md:text-base font-black outline-none cursor-pointer transition-all ${
                            subjectGrades[subject] ? 'text-white border-red-600/30' : 'text-gray-700 hover:text-white'
                          }`}
                          value={subjectGrades[subject] || ''}
                          onChange={(e) => handleUpdateGrade(subject, e.target.value as Grade | '')}
                        >
                          <option value="">Select Grade</option>
                          {grades.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Submission Hub */}
            <div className="pt-12 md:pt-20 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex items-start gap-4 max-w-sm w-full">
                 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                    <Info className="text-red-600" size={20} />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-white font-black text-sm uppercase tracking-tight">System Notice</h4>
                    <p className="text-gray-500 text-[10px] md:text-xs font-medium leading-relaxed">
                      Merit matching requires exactly 7 or 8 subjects. Incomplete profiles will not pass the eligibility gate.
                    </p>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
                {error && (
                  <div className="w-full lg:w-auto bg-red-600/10 border border-red-600/30 px-6 py-3 rounded-xl flex items-center justify-center gap-3 text-red-500 font-black animate-in fade-in slide-in-from-top-2 text-xs md:text-sm">
                    <AlertTriangle size={18} /> {error}
                  </div>
                )}
                <button 
                  onClick={handleCalculate}
                  className="w-full lg:w-auto bg-red-600 text-white px-10 md:px-16 py-5 md:py-6 rounded-2xl md:rounded-[2.5rem] font-black text-lg md:text-2xl flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all shadow-xl active:scale-95 group cursor-pointer"
                >
                  ANALYZE MY ELIGIBILITY <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeInput;
