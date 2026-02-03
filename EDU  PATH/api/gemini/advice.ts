import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { meanGrade, topSubjects } = req.body || {};
  if (!meanGrade || !Array.isArray(topSubjects)) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API_KEY not configured' });
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Act as a senior Kenyan career consultant specializing in KUCCPS placement realism. \nA KCSE 2025 student scored a Mean Grade of ${meanGrade}. \nTheir best subjects were: ${topSubjects.join(', ')}. \n\nSTRICT MERIT REALISM:\n- Only suggest Degree programs if the grade is C+ or above.\n- If grade is C+ exactly, steer them toward less competitive degrees (BA, Education) or high-level Medical Diplomas at KMTC. \n- Inform them that A and A- students take all Medicine/Engineering slots.\n- Be brutally honest about the 2025 placement trends in Kenya.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return res.status(200).json({ text: response.text || 'Advice currently unavailable.' });
  } catch (error) {
    console.error('advice error', error);
    return res.status(500).json({ error: 'AI service error' });
  }
}
