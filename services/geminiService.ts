
// SERVER-ONLY: Use the server endpoints under `/api/gemini/*` instead of importing this file in browser bundles.
// This guard will throw if accidentally imported in client code to prevent bundling server SDKs and leaking API keys.

export const _serverOnlyGeminiGuard = () => {
  throw new Error('This module is server-only. Call the server endpoints at /api/gemini/* instead.');
};

export type GroundedResponse = { text: string; sources: { title: string; uri: string }[] };

// The server-side Gemini implementations live under `/api/gemini/*` (serverless endpoints).

