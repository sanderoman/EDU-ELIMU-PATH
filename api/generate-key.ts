/**
 * Simple key generation endpoint for admin dashboard
 * Creates and activates a key in one step
 */

import { keyDB } from './payment/_lib/keyDatabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentName, studentPhone, expiryHours = 24 } = req.body;

    if (!studentName?.trim() || !studentPhone?.trim()) {
      return res.status(400).json({ error: 'Student name and phone are required' });
    }

    // Generate unique code
    const code = `EDU${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate expiry
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();

    console.log(`[GENERATE] Creating key for ${studentName}: ${code}`);

    // Create key in database
    const newKey = keyDB.createKey({
      code,
      label: `Access for ${studentName.trim()}`,
      status: 'active', // Create as active immediately
      createdBy: 'admin',
      expiresAt
    });

    console.log(`[GENERATE] Key created: ${newKey.id}`);

    // Verify the key was created
    const verification = keyDB.getKeyById(newKey.id);
    if (!verification) {
      console.error(`[GENERATE] Key verification failed for ${newKey.id}`);
      return res.status(500).json({ error: 'Key creation verification failed' });
    }

    console.log(`[GENERATE] Key verified and ready: ${code}`);

    return res.status(200).json({
      success: true,
      key: {
        id: newKey.id,
        code: newKey.code,
        label: newKey.label,
        status: newKey.status,
        expiresAt: newKey.expiresAt
      }
    });

  } catch (error: any) {
    console.error('[GENERATE] Error:', error);
    return res.status(500).json({
      error: 'Failed to generate key',
      details: error.message
    });
  }
}