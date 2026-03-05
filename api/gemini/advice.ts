import { GoogleGenAI } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { meanGrade, topSubjects } = req.body || {};
  if (!meanGrade || !Array.isArray(topSubjects)) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const prompt = `Act as a senior Kenyan career consultant specializing in KUCCPS placement realism. \nA KCSE 2025 student scored a Mean Grade of ${meanGrade}. \nTheir best subjects were: ${topSubjects.join(', ')}. \n\nSTRICT MERIT REALISM:\n- Only suggest Degree programs if the grade is C+ or above.\n- If grade is C+ exactly, steer them toward less competitive degrees (BA, Education) or high-level Medical Diplomas at KMTC. \n- Inform them that A and A- students take all Medicine/Engineering slots.\n- Be brutally honest about the 2025 placement trends in Kenya.`;

    const response = await callModel(prompt);

    return res.status(200).json({ text: response.text || 'Advice currently unavailable.' });
  } catch (error: any) {
    console.error('advice error', error);
    
    // Fallback advice when AI fails
    const fallbackAdvice = getFallbackAdvice(meanGrade, topSubjects);
    
    if (error?.code === 'API_KEY_NOT_CONFIGURED') {
      return res.status(200).json({ text: fallbackAdvice });
    }
    if (error?.code === 'MODEL_NOT_FOUND' || /NOT_FOUND|not found/i.test(String(error?.message || error))) {
      return res.status(200).json({ text: fallbackAdvice });
    }
    
    return res.status(200).json({ text: fallbackAdvice });
  }
}

function getFallbackAdvice(meanGrade: string, topSubjects: string[]): string {
  const gradePoints = { 'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1 };
  const points = gradePoints[meanGrade as keyof typeof gradePoints] || 1;
  
  if (points >= 11) {
    return `EXCELLENT PERFORMANCE! With a Mean Grade of ${meanGrade}, you qualify for competitive degree programmes like Medicine, Engineering, and Architecture. Your top subjects (${topSubjects.join(', ')}) align well with these fields. Focus on University of Nairobi, Kenyatta University, and Strathmore for best placement opportunities.`;
  } else if (points >= 9) {
    return `STRONG PERFORMANCE! Your Mean Grade of ${meanGrade} opens doors to most degree programmes. Consider Business, IT, Applied Sciences, or Education degrees. Your strengths in ${topSubjects.join(', ')} give you good placement chances at mid-tier universities. Avoid overly competitive courses like Medicine.`;
  } else if (points >= 7) {
    return `GOOD PERFORMANCE! With a Mean Grade of ${meanGrade}, you qualify for degree programmes but should be strategic. Consider Education, Arts, Social Sciences, or less competitive technical degrees. Your ${topSubjects.join(', ')} subjects are valuable. Also explore diploma programmes at KMTC and technical universities as backup options.`;
  } else if (points >= 5) {
    return `DIPLOMA PATHWAY! Your Mean Grade of ${meanGrade} is perfect for diploma programmes. Focus on KMTC for medical diplomas, technical institutes for engineering diplomas, or business colleges. Your ${topSubjects.join(', ')} subjects can lead to excellent diploma careers with good employment prospects.`;
  } else {
    return `CERTIFICATE PATHWAY! With a Mean Grade of ${meanGrade}, focus on certificate and artisan programmes. Consider TVET institutions for technical skills, business certificates, or agricultural certificates. Your ${topSubjects.join(', ')} subjects can be developed through practical certificate programmes that lead to self-employment or further studies.`;
  }
}
