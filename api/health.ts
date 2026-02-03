export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = !!process.env.API_KEY;
  const modelEnv = process.env.MODEL_NAME || null;
  const fallbacks = process.env.MODEL_FALLBACKS || null;

  // If no API key, short-circuit.
  if (!apiKey) {
    return res.status(200).json({ ok: false, apiKeyConfigured: false, message: 'API_KEY not configured. Set API_KEY to enable AI endpoints.' });
  }

  // Try a light model check to detect common model access errors (non-fatal)
  try {
    const { callModel, getModelName, getModelCandidates } = await import('./_lib/genai');
    const testPrompt = 'Health check: please respond with OK.';
    const response: any = await callModel(testPrompt, { config: { maxOutputTokens: 8 } });

    const usedModel = response?._modelUsed || getModelName();
    return res.status(200).json({ ok: true, apiKeyConfigured: true, model: usedModel, aiStatus: 'reachable' });
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (err?.code === 'MODEL_NOT_FOUND' || /NOT_FOUND|not found/i.test(msg)) {
      const attempted = typeof err?.attempted !== 'undefined' ? err.attempted : (await import('./_lib/genai')).getModelCandidates();
      return res.status(200).json({ ok: false, apiKeyConfigured: true, modelEnv, fallbacks, attemptedModels: attempted, lastError: err?.original?.message || msg, aiStatus: 'model_not_found', message: 'Model not accessible for this API key. Consider setting MODEL_NAME or enabling model access. You can also set MODEL_FALLBACKS to a comma-separated list of models to try.' });
    }
    return res.status(200).json({ ok: false, apiKeyConfigured: true, model: modelEnv, aiStatus: 'error', message: msg });
  }
}
