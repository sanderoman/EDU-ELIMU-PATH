import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { institutionName } = req.body || {};
  if (!institutionName) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API_KEY not configured' });
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `SEARCH FOR OFFICIAL 2025/2026 INTAKE RECORDS FOR: ${institutionName} in Kenya.\n\nTASK:\n1. Extract a structured list of ALL currently active Degrees, Diplomas, and Certificates.\n2. Identify the EXACT cluster weight/minimum grade requirements for top competitive programs (Medicine, Law, Engineering, Nursing).\n3. State approximate 2025 tuition fees for government-sponsored students vs private students.\n4. Provide the official registration/application link for the 2025 cycle.\n\nUSE GOOGLE SEARCH GROUNDING TO ENSURE 100% ACCURACY AGAINST UNIVERSITY PORTALS.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({ title: chunk.web?.title || 'University Portal', uri: chunk.web?.uri || '' }))
      .filter((s: any) => s.uri !== '') || [];

    return res.status(200).json({ text: response.text || 'No course data found for this institution.', sources });
  } catch (error) {
    console.error('university error', error);
    return res.status(500).json({ error: 'AI service error' });
  }
}
