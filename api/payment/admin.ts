/**
 * Admin API endpoint to retrieve student data across all devices/sessions.
 * Requires admin authentication key.
 */

import { keyDB } from './_lib/keyDatabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify admin authentication
    const adminKey = req.headers['x-admin-key'] || req.body?.adminKey;
    const expectedKey = process.env.ADMIN_KEY || 'admin-secret-key';
    
    if (adminKey !== expectedKey) {
      return res.status(403).json({ 
        error: 'Unauthorized access. Invalid admin key.' 
      });
    }

    const { action, phone, studentName, filterStatus } = req.body || req.query;

    if (action === 'getStudents') {
      // Retrieve all students who have accessed the system
      // In production, this queries the database
      return res.status(200).json({
        message: 'Student data retrieval',
        totalStudents: 0,
        students: [
          {
            id: 'STU_001',
            name: 'Sample Student',
            phone: '+254712345678',
            lastAccess: new Date().toISOString(),
            accessCount: 2,
            deviceCount: 1,
            paymentStatus: 'Paid',
            grades: { meanGrade: 'B', clusterScore: 28 }
          }
        ]
      });
    }

    if (action === 'getByPhone') {
      // Get all data for a specific student by phone
      if (!phone) {
        return res.status(400).json({ error: 'Phone number required' });
      }

      return res.status(200).json({
        message: 'Student records retrieved',
        phone,
        records: [
          {
            timestamp: new Date().toISOString(),
            studentName: studentName || 'Unknown',
            grades: { meanGrade: 'B', clusterScore: 28 },
            courses: [],
            advice: 'Sample advice',
            paymentStatus: 'Paid'
          }
        ]
      });
    }

    if (action === 'getPayments') {
      // Get all payment records (with optional filtering)
      return res.status(200).json({
        message: 'Payment records',
        total: 0,
        filter: filterStatus,
        payments: []
      });
    }

    if (action === 'getAccessCodes') {
      // Get all access codes and their usage from centralized database
      const allKeys = keyDB.getAllKeys();

      return res.status(200).json({
        message: 'Access codes inventory',
        total: allKeys.length,
        codes: allKeys.map(key => ({
          id: key.id,
          code: key.code,
          status: key.status,
          label: key.label,
          createdAt: key.createdAt,
          activatedAt: key.activatedAt,
          expiresAt: key.expiresAt,
          usageCount: key.usageCount,
          linkedPhones: key.linkedPhones,
          lastValidatedAt: key.lastValidatedAt
        }))
      });
    }

    if (action === 'createKey') {
      // Create a new master key in centralized database
      const { label, expiryHours } = req.body;

      if (!label?.trim()) {
        return res.status(400).json({ error: 'Key label is required' });
      }

      // Generate unique code
      const code = `EDU${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Calculate expiry if specified
      let expiresAt: string | undefined;
      if (expiryHours && typeof expiryHours === 'number') {
        expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
      }

      // Create key in database
      const newKey = keyDB.createKey({
        code,
        label: label.trim(),
        status: 'inactive', // Start as inactive, admin must activate
        createdBy: 'admin',
        expiresAt
      });

      return res.status(200).json({
        success: true,
        message: 'Key created successfully',
        key: {
          id: newKey.id,
          code: newKey.code,
          status: newKey.status,
          label: newKey.label,
          createdAt: newKey.createdAt,
          expiresAt: newKey.expiresAt
        }
      });
    }

    if (action === 'activateKey') {
      // Activate a key in centralized database
      const { keyId } = req.body;

      if (!keyId) {
        return res.status(400).json({ error: 'Key ID is required' });
      }

      const activatedKey = keyDB.activateKey(keyId, 'admin');

      if (!activatedKey) {
        return res.status(404).json({ error: 'Key not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Key activated successfully',
        key: {
          id: activatedKey.id,
          code: activatedKey.code,
          status: activatedKey.status,
          activatedAt: activatedKey.activatedAt
        }
      });
    }

    if (action === 'deactivateKey') {
      // Deactivate a key in centralized database
      const { keyId } = req.body;

      if (!keyId) {
        return res.status(400).json({ error: 'Key ID is required' });
      }

      const deactivatedKey = keyDB.deactivateKey(keyId);

      if (!deactivatedKey) {
        return res.status(404).json({ error: 'Key not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Key deactivated successfully',
        key: {
          id: deactivatedKey.id,
          code: deactivatedKey.code,
          status: deactivatedKey.status
        }
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error: any) {
    console.error('Admin API error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve admin data',
      details: error.message
    });
  }
}
