/**
 * Simple key deactivation endpoint
 */

import { keyDB } from './payment/_lib/keyDatabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keyId } = req.body;

    if (!keyId) {
      return res.status(400).json({ error: 'Key ID is required' });
    }

    console.log(`[DEACTIVATE] Deactivating key: ${keyId}`);

    const deactivatedKey = keyDB.deactivateKey(keyId);

    if (!deactivatedKey) {
      console.error(`[DEACTIVATE] Key not found: ${keyId}`);
      return res.status(404).json({ error: 'Key not found' });
    }

    console.log(`[DEACTIVATE] Key deactivated: ${keyId}`);

    return res.status(200).json({
      success: true,
      key: {
        id: deactivatedKey.id,
        code: deactivatedKey.code,
        status: deactivatedKey.status
      }
    });

  } catch (error: any) {
    console.error('[DEACTIVATE] Error:', error);
    return res.status(500).json({
      error: 'Failed to deactivate key',
      details: error.message
    });
  }
}