import { GoogleGenAI, Type } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const prompt = `You are verifying an M-Pesa payment message. Analyze: "${message}"
    
Rules:
- Accept if amount is exactly KSH 150.00 (or 150 KSH)
- Extract any alphanumeric transaction ID
- Return valid JSON format

Return only this JSON format:
{"isValid": true/false, "transactionId": "extracted_id_or_empty", "reason": "brief_explanation"}`;

    const response = await callModel(prompt, { config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          transactionId: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["isValid", "transactionId", "reason"]
      }
    }});

    const text = response.text;
    if (!text) return res.status(200).json({ isValid: false, transactionId: "", reason: 'Empty AI response' });
    
    try {
      const result = JSON.parse(text);
      return res.status(200).json(result);
    } catch (err) {
      console.error('verify parse error', err, text);
      // Fallback: try to extract manually
      const amountMatch = message.match(/KSH\s*150\.?00?/i);
      const idMatch = message.match(/Transaction ID:\s*([A-Z0-9]+)/i);
      
      return res.status(200).json({
        isValid: !!amountMatch,
        transactionId: idMatch ? idMatch[1] : "",
        reason: amountMatch ? "Manual verification successful" : "Amount not found"
      });
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
