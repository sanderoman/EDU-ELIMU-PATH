/**
 * Simple endpoint to get all access keys
 */

import { keyDB, KeyRecord } from './payment/_lib/keyDatabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[GET_KEYS] Fetching all keys');

    const allKeys = keyDB.getAllKeys();

    console.log(`[GET_KEYS] Found ${allKeys.length} keys`);

    return res.status(200).json({
      success: true,
      codes: allKeys.map((key: KeyRecord) => ({
        id: key.id,
        code: key.code,
        status: key.status,
        label: key.label,
        createdAt: key.createdAt,
        activatedAt: key.activatedAt,
        expiresAt: key.expiresAt,
        usageCount: key.usageCount,
        linkedPhones: key.linkedPhones,
        lastValidatedAt: key.lastValidatedAt,
        createdBy: key.createdBy
      }))
    });

  } catch (error: any) {
    console.error('[GET_KEYS] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch keys',
      details: error.message
    });
  }
}