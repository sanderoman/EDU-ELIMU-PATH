import { GoogleGenAI } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { meanGrade, topSubjects, clusterScore } = req.body || {};
  if (!meanGrade || !Array.isArray(topSubjects)) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const prompt = `Act as a senior Kenyan career consultant specializing in KUCCPS placement realism. \nA KCSE 2025 student scored a Mean Grade of ${meanGrade} with a cluster score of ${clusterScore || 0} (calculated using official KUCCPS methodology - sum of best 3 subjects). \nTheir best subjects were: ${topSubjects.join(', ')}. \n\nSTRICT MERIT REALISM:\n- Only suggest Degree programs if the grade is C+ or above.\n- If grade is C+ exactly, steer them toward less competitive degrees (BA, Education) or high-level Medical Diplomas at KMTC. \n- Inform them that A and A- students take all Medicine/Engineering slots.\n- Be brutally honest about the 2025 placement trends in Kenya.`;

    const response = await callModel(prompt);

    return res.status(200).json({ text: response.text || 'Advice currently unavailable.' });
  } catch (error: any) {
    console.error('advice error', error);
    // Provide a generic fallback message so the client can still show something
    const fallbackText = `Based on a mean grade of ${meanGrade} and strongest subjects (${topSubjects.join(', ')}),
suggest considering programmes aligned with your grade: prioritize C+ or above degrees if eligible, diplomas for C-/C,
and certificate/artisan courses for D+. Always verify with KUCCPS and institution portals.`;

    // handle specific error codes as before but still return fallback
    if (error?.code === 'API_KEY_NOT_CONFIGURED') {
      return res.status(200).json({ text: fallbackText });
    }
    if (error?.code === 'MODEL_NOT_FOUND' || /NOT_FOUND|not found/i.test(String(error?.message || error))) {
      return res.status(200).json({ text: fallbackText });
    }
    return res.status(200).json({ text: fallbackText });
  }
}
