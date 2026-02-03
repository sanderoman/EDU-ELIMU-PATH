import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { courseName, institution } = req.body || {};
  if (!courseName || !institution) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API_KEY not configured' });
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `GENERATE A 2025/26 CAREER BLUEPRINT FOR: "${courseName}" at "${institution}".\n\nREQUIRED DATA POINTS:\n- Official 2025 Admission Requirements (Minimum Grade & Subject Cluster).\n- Current 2025 Semester Fees (Tuition + Admin Fees).\n- Market Readiness Index: Jobs available for this graduate in Kenya (2025-2030).\n- Career Ladder: Junior role to Senior role salary projections in KES.\n- Grounding: Cross-reference with KUCCPS and the institution's latest fee schedule.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({ title: chunk.web?.title || 'Official Source', uri: chunk.web?.uri || '' }))
      .filter((s: any) => s.uri !== '') || [];

    return res.status(200).json({ text: response.text || 'Blueprint generation failed.', sources });
  } catch (error) {
    console.error('course blueprint error', error);
    return res.status(500).json({ error: 'AI service error' });
  }
}
