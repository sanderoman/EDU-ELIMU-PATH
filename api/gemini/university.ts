import { GoogleGenAI } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { institutionName } = req.body || {};
  if (!institutionName) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const prompt = `SEARCH FOR OFFICIAL 2025/2026 INTAKE RECORDS FOR: ${institutionName} in Kenya.\n\nTASK:\n1. Extract a structured list of ALL currently active Degrees, Diplomas, and Certificates.\n2. Identify the EXACT cluster weight/minimum grade requirements for top competitive programs (Medicine, Law, Engineering, Nursing).\n3. State approximate 2025 tuition fees for government-sponsored students vs private students.\n4. Provide the official registration/application link for the 2025 cycle.\n\nUSE GOOGLE SEARCH GROUNDING TO ENSURE 100% ACCURACY AGAINST UNIVERSITY PORTALS.`;

    const response = await callModel(prompt, { config: { tools: [{ googleSearch: {} }] } });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({ title: chunk.web?.title || 'University Portal', uri: chunk.web?.uri || '' }))
      .filter((s: any) => s.uri !== '') || [];

    return res.status(200).json({ text: response.text || 'No course data found for this institution.', sources });
  } catch (error: any) {
    console.error('university error', error);
    const msg = error?.message || String(error);
    if (/NOT_FOUND|not found/i.test(msg)) {
      return res.status(502).json({ error: 'AI_SERVICE_ERROR', reason: 'Model not found or not accessible. Check API_KEY and model access', details: msg });
    }
    return res.status(502).json({ error: 'AI_SERVICE_ERROR', reason: msg });
  }
}
