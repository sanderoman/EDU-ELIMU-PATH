/**
 * SINGLE AUTHORITATIVE VALIDATION ENDPOINT
 * This is the ONLY place where key validation decisions are made.
 * All other parts of the system must call this endpoint.
 */

import { keyDB } from './payment/_lib/keyDatabase';

// Debug logging function
function logValidation(key: string, step: string, data: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] KEY_VALIDATION [${key}] ${step}:`, JSON.stringify(data, null, 2));
}

// Normalize key format (uppercase, trim spaces, remove hyphens)
function normalizeKey(key: string): string {
  return key?.toUpperCase().trim().replace(/-/g, '') || '';
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      valid: false,
      reason: 'method_not_allowed',
      message: 'Only POST requests allowed'
    });
  }

  try {
    const { access_key, phone, studentName } = req.body;

    // Normalize the key immediately
    const normalizedKey = normalizeKey(access_key);

    logValidation(normalizedKey, 'RECEIVED', {
      original: access_key,
      normalized: normalizedKey,
      phone: phone,
      studentName: studentName
    });

    // Validate input
    if (!normalizedKey) {
      logValidation(normalizedKey, 'INVALID_INPUT', { reason: 'empty_key' });
      return res.status(400).json({
        valid: false,
        reason: 'invalid_input',
        message: 'Access key is required'
      });
    }

    // Find key in database
    const keyRecord = keyDB.getKeyByCode(normalizedKey);

    logValidation(normalizedKey, 'DATABASE_LOOKUP', {
      found: !!keyRecord,
      record: keyRecord ? {
        id: keyRecord.id,
        status: keyRecord.status,
        expiresAt: keyRecord.expiresAt,
        usageCount: keyRecord.usageCount,
        linkedPhones: keyRecord.linkedPhones
      } : null
    });

    if (!keyRecord) {
      logValidation(normalizedKey, 'DECISION', { valid: false, reason: 'key_not_found' });
      return res.status(401).json({
        valid: false,
        reason: 'key_not_found',
        message: 'Access code not found'
      });
    }

    // Check status
    if (keyRecord.status !== 'active') {
      logValidation(normalizedKey, 'DECISION', {
        valid: false,
        reason: 'invalid_status',
        status: keyRecord.status
      });
      return res.status(401).json({
        valid: false,
        reason: 'invalid_status',
        message: `Access code is ${keyRecord.status}`,
        status: keyRecord.status
      });
    }

    // Check expiry (use UTC time)
    const now = new Date();
    if (keyRecord.expiresAt) {
      const expiryTime = new Date(keyRecord.expiresAt);
      logValidation(normalizedKey, 'EXPIRY_CHECK', {
        now: now.toISOString(),
        expiresAt: expiryTime.toISOString(),
        isExpired: expiryTime < now
      });

      if (expiryTime < now) {
        // Mark as expired in database
        keyDB.updateKey(keyRecord.id, { status: 'expired' });
        logValidation(normalizedKey, 'DECISION', { valid: false, reason: 'expired' });
        return res.status(401).json({
          valid: false,
          reason: 'expired',
          message: 'Access code has expired'
        });
      }
    }

    // Check if phone already has access via this key
    const phoneLinked = keyRecord.linkedPhones.includes(phone);

    logValidation(normalizedKey, 'PHONE_CHECK', {
      phone: phone,
      alreadyLinked: phoneLinked,
      linkedPhones: keyRecord.linkedPhones
    });

    // If phone already linked, grant access
    if (phoneLinked) {
      // Record usage
      const updatedKey = keyDB.recordUsage(normalizedKey, phone);
      logValidation(normalizedKey, 'DECISION', {
        valid: true,
        reason: 'phone_already_linked',
        usageCount: updatedKey?.usageCount
      });

      return res.status(200).json({
        valid: true,
        message: 'Access granted',
        code: keyRecord.code,
        phone: phone,
        studentName: studentName || 'Unknown',
        keyId: keyRecord.id,
        usageCount: updatedKey?.usageCount || keyRecord.usageCount + 1,
        accessType: 'existing'
      });
    }

    // If key already used by another phone, deny access
    if (keyRecord.linkedPhones.length > 0) {
      logValidation(normalizedKey, 'DECISION', {
        valid: false,
        reason: 'key_linked_to_other_phone',
        linkedPhones: keyRecord.linkedPhones
      });
      return res.status(403).json({
        valid: false,
        reason: 'key_linked_to_other_phone',
        message: 'Access code already linked to another phone number',
        linkedPhone: keyRecord.linkedPhones[0]
      });
    }

    // First time use: link key to this phone
    const updatedKey = keyDB.recordUsage(normalizedKey, phone);

    logValidation(normalizedKey, 'DECISION', {
      valid: true,
      reason: 'first_time_use',
      usageCount: updatedKey?.usageCount
    });

    return res.status(200).json({
      valid: true,
      message: 'Access granted',
      code: keyRecord.code,
      phone: phone,
      studentName: studentName || 'Unknown',
      keyId: keyRecord.id,
      usageCount: updatedKey?.usageCount || 1,
      accessType: 'new'
    });

  } catch (error: any) {
    console.error('VALIDATION_ERROR:', error);
    return res.status(500).json({
      valid: false,
      reason: 'server_error',
      message: 'Validation failed due to server error',
      error: error.message
    });
  }
}