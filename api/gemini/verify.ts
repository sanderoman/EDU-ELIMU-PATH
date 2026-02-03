import { GoogleGenAI, Type } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const prompt = `Analyze this M-Pesa notification: "${message}".\nVerify if exactly KSH 150.00 was paid (any recipient is acceptable).\nExtract the transaction ID (alphanumeric code).\nReturn JSON: {"isValid": boolean, "transactionId": string, "reason": string}.`;

    const response = await callModel(prompt, { config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT
      }
    }});

    const text = response.text;
    if (!text) return res.status(200).json({ isValid: false, reason: 'SYSTEM ERROR: EMPTY RESPONSE' });
    try {
      return res.status(200).json(JSON.parse(text));
    } catch (err) {
      console.error('verify parse error', err, text);
      return res.status(200).json({ isValid: false, reason: 'PARSE ERROR' });
    }
  } catch (error: any) {
    console.error('verify error', error);
    const msg = error?.message || String(error);
    if (/NOT_FOUND|not found/i.test(msg)) {
      return res.status(502).json({ error: 'AI_SERVICE_ERROR', reason: 'Model not found or not accessible. Check API_KEY and model access', details: msg });
    }
    return res.status(502).json({ error: 'AI_SERVICE_ERROR', reason: msg });
  }
}
