import { GoogleGenAI } from '@google/genai';

// Returns an ordered list of model candidates to try.
export const getModelCandidates = () => {
  // Single model override (explicit)
  if (process.env.MODEL_NAME) return process.env.MODEL_NAME.split(/\s*,\s*/).filter(Boolean);
  // Comma-separated fallbacks (optional)
  if (process.env.MODEL_FALLBACKS) return process.env.MODEL_FALLBACKS.split(/\s*,\s*/).filter(Boolean);
  // Default model commonly used in examples (may not be accessible on all keys)
  return ['gemini-3-flash-preview'];
};

export const getModelName = () => (getModelCandidates()[0] || 'gemini-3-flash-preview');

export async function callModel(prompt: string, opts: { config?: any } = {}) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    const e: any = new Error('API_KEY_NOT_CONFIGURED');
    e.code = 'API_KEY_NOT_CONFIGURED';
    throw e;
  }

  const candidates = getModelCandidates();
  let lastErr: any = null;

  for (const model of candidates) {
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response: any = await ai.models.generateContent({
        model,
        contents: prompt,
        ...(opts.config ? { config: opts.config } : {})
      });
      // Attach the model that successfully answered for debugging/health checks
      (response as any)._modelUsed = model;
      return response;
    } catch (err: any) {
      lastErr = err;
      const msg = String(err?.message || err);
      console.warn(`[genai] model ${model} failed: ${msg}`);
      // If this error indicates a model access problem, try the next candidate
      if (msg.includes('NOT_FOUND') || /cpt1::/i.test(msg) || (/model/i.test(msg) && /not found/i.test(msg))) {
        // continue to next model candidate
        continue;
      }
      // Non-model-related error — rethrow immediately
      throw err;
    }
  }

  // If none of the candidates worked, surface a clear MODEL_NOT_FOUND error with suggestions
  const e: any = new Error(`MODEL_NOT_FOUND: Unable to access any candidate models: ${candidates.join(', ')}. Last error: ${String(lastErr?.message || lastErr)}`);
  e.code = 'MODEL_NOT_FOUND';
  e.original = lastErr;
  e.attempted = candidates;
  e.lastError = String(lastErr?.message || lastErr);
  throw e;
}
