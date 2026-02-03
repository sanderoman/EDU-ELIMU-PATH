import { GoogleGenAI, Type } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { meanGrade, topSubjects, courseList } = req.body || {};
  if (!meanGrade || !Array.isArray(topSubjects) || !Array.isArray(courseList)) return res.status(400).json({ error: 'Invalid payload' });

  try {
    const prompt = `Analyze the following courses for a student with Mean Grade ${meanGrade} and top subjects ${topSubjects.join(', ')}. \nOut of these options: ${courseList.slice(0, 50).join(', ')}...\n\nTASK:\nSelect the TOP 20 most MARKETABLE and RECOMMENDED courses for this specific student.\nConsider the 2025-2030 Kenyan Job Market (Health, ICT, Agriculture, Blue Economy, Infrastructure).\n\nReturn a JSON array of 20 objects:\n[{"course": "Course Name", "institution": "Institution", "marketability": "90-99%", "reason": "Short growth-focused reason"}]`;

    const response = await callModel(prompt, { config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT
        }
      }
    }});

    const text = response.text || '[]';
    try {
      const parsed = JSON.parse(text);
      return res.status(200).json(parsed);
    } catch (err) {
      console.error('marketable parse error', err, text);
      return res.status(200).json([]);
    }
  } catch (error: any) {
    console.error('marketable error', error);
    if (error?.code === 'API_KEY_NOT_CONFIGURED') {
      return res.status(500).json({ error: 'API_KEY_NOT_CONFIGURED', message: 'API_KEY is not set. Add API_KEY to your environment or Vercel project.' });
    }
    if (error?.code === 'MODEL_NOT_FOUND' || /NOT_FOUND|not found/i.test(String(error?.message || error))) {
      return res.status(502).json({ error: 'MODEL_NOT_FOUND', message: 'The configured model appears unavailable or your key lacks access.', suggestedAction: 'Set MODEL_NAME to a model your key can access or enable access for the requested model', details: String(error?.message || error) });
    }
    return res.status(500).json({ error: 'AI_SERVICE_ERROR', details: String(error?.message || error) });
  }
}
