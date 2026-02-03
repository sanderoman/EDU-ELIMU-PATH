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
    if (error?.code === 'API_KEY_NOT_CONFIGURED') {
      return res.status(500).json({ error: 'API_KEY_NOT_CONFIGURED', message: 'API_KEY is not set. Add API_KEY to your environment or Vercel project.' });
    }
    if (error?.code === 'MODEL_NOT_FOUND' || /NOT_FOUND|not found/i.test(String(error?.message || error))) {
      return res.status(502).json({ error: 'MODEL_NOT_FOUND', message: 'The configured model appears unavailable or your key lacks access.', suggestedAction: 'Set MODEL_NAME to a model your key can access or enable access for the requested model', details: String(error?.message || error) });
    }
    return res.status(500).json({ error: 'AI_SERVICE_ERROR', details: String(error?.message || error) });
  }
}
