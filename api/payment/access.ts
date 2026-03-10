/**
 * API endpoint to validate access keys/codes.
 * Centralized real-time validation against database.
 * Once a code is used with a phone number, that phone can access from any device.
 */

import { keyDB } from './_lib/keyDatabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, code, phone, studentName } = req.body;

    if (action === 'validate') {
      // Validate an access code with phone number against centralized database
      const accessCode = code?.toUpperCase().trim();

      if (!accessCode) {
        return res.status(400).json({
          success: false,
          message: 'Access code is required'
        });
      }

      const keyRecord = keyDB.getKeyByCode(accessCode);

      if (!keyRecord) {
        return res.status(401).json({
          success: false,
          message: 'Invalid access code'
        });
      }

      // Check if key is active
      if (keyRecord.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: `Access code is ${keyRecord.status}`
        });
      }

      // Check if key has expired
      if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
        keyDB.updateKey(keyRecord.id, { status: 'expired' });
        return res.status(401).json({
          success: false,
          message: 'Access code has expired'
        });
      }

      // If code already used by this phone, allow access
      if (keyRecord.linkedPhones.includes(phone)) {
        // Record usage
        keyDB.recordUsage(accessCode, phone);
        return res.status(200).json({
          success: true,
          message: 'Access granted',
          code: keyRecord.code,
          phone: phone,
          studentName: studentName || 'Unknown',
          keyId: keyRecord.id,
          usageCount: keyRecord.usageCount + 1
        });
      }

      // If code already used by another phone, deny access
      if (keyRecord.linkedPhones.length > 0) {
        return res.status(403).json({
          success: false,
          message: 'Access code already linked to another phone number',
          linkedPhone: keyRecord.linkedPhones[0]
        });
      }

      // First time use: link code to this phone
      const updatedKey = keyDB.recordUsage(accessCode, phone);

      return res.status(200).json({
        success: true,
        message: 'Access granted',
        code: keyRecord.code,
        phone: phone,
        studentName: studentName || 'Unknown',
        keyId: keyRecord.id,
        usageCount: updatedKey?.usageCount || 1
      });
    }

    if (action === 'checkPhone') {
      // Check if a phone number has access via centralized database
      if (!phone) {
        return res.status(400).json({ error: 'Phone number required' });
      }

      const hasAccess = keyDB.phoneHasAccess(phone);

      if (hasAccess) {
        // Get all keys linked to this phone
        const linkedKeys = keyDB.getAllKeys().filter(key =>
          key.status === 'active' && key.linkedPhones.includes(phone)
        );

        return res.status(200).json({
          hasAccess: true,
          accessCount: linkedKeys.length,
          keys: linkedKeys.map(key => ({
            code: key.code,
            label: key.label,
            activatedAt: key.activatedAt,
            lastValidatedAt: key.lastValidatedAt,
            usageCount: key.usageCount
          }))
        });
      }

      return res.status(200).json({
        hasAccess: false,
        accessCount: 0,
        keys: []
      });
    }

    if (action === 'generateCode') {
      // Generate a new master code (admin only) - now handled by admin.ts
      return res.status(400).json({
        error: 'Use admin API to generate codes. Action: createKey'
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error: any) {
    console.error('Access validation error:', error);
    return res.status(500).json({
      error: 'Failed to validate access',
      details: error.message
    });
  }
}
