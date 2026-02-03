import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API_KEY not configured' });
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze this M-Pesa notification: "${message}".\nVerify if exactly KES 150 was paid to \"EDU PATH\".\nExtract the 10-char Alphanumeric ID.\nReturn JSON: {"isValid": boolean, "transactionId": string, "reason": string}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT
        }
      }
    });

    const text = response.text;
    if (!text) return res.status(200).json({ isValid: false, reason: 'SYSTEM ERROR: EMPTY RESPONSE' });
    try {
      return res.status(200).json(JSON.parse(text));
    } catch (err) {
      console.error('verify parse error', err, text);
      return res.status(200).json({ isValid: false, reason: 'PARSE ERROR' });
    }
  } catch (error) {
    console.error('verify error', error);
    return res.status(500).json({ error: 'AI service error' });
  }
}
