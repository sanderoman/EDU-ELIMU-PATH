export default async function handler(req: any, res: any) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return res.status(200).json({ ok: false, reason: 'API_KEY not configured on server. Set API_KEY or Vercel secret api_key.' });
    // Basic health check — we avoid making an AI call to prevent accidental quota consumption.
    return res.status(200).json({ ok: true, message: 'API_KEY is present. If you still receive NOT_FOUND from model calls, ensure your API key has access to the requested Gemini model.' });
  } catch (error: any) {
    console.error('health error', error);
    return res.status(500).json({ ok: false, error: String(error) });
  }
}