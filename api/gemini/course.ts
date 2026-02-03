import { GoogleGenAI } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { courseName, institution } = req.body || {};
  if (!courseName || !institution) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const prompt = `GENERATE A 2025/26 CAREER BLUEPRINT FOR: "${courseName}" at "${institution}".\n\nREQUIRED DATA POINTS:\n- Official 2025 Admission Requirements (Minimum Grade & Subject Cluster).\n- Current 2025 Semester Fees (Tuition + Admin Fees).\n- Market Readiness Index: Jobs available for this graduate in Kenya (2025-2030).\n- Career Ladder: Junior role to Senior role salary projections in KES.\n- Grounding: Cross-reference with KUCCPS and the institution's latest fee schedule.`;

    const response = await callModel(prompt, { config: { tools: [{ googleSearch: {} }] } });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({ title: chunk.web?.title || 'Official Source', uri: chunk.web?.uri || '' }))
      .filter((s: any) => s.uri !== '') || [];

    return res.status(200).json({ text: response.text || 'Blueprint generation failed.', sources });
  } catch (error: any) {
    console.error('course blueprint error', error);
    const msg = error?.message || String(error);
    if (/NOT_FOUND|not found/i.test(msg)) {
      return res.status(502).json({ error: 'AI_SERVICE_ERROR', reason: 'Model not found or not accessible. Check API_KEY and model access', details: msg });
    }
    return res.status(502).json({ error: 'AI_SERVICE_ERROR', reason: msg });
  }
}
