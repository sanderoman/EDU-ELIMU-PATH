import { PaymentRecord } from '../../types';

/**
 * API endpoint to store payment records persistently.
 * In production, this connects to a database (MongoDB, PostgreSQL, etc.)
 * For now, uses in-memory storage (replaced on redeploy).
 */

// In-memory payment database (in production, use MongoDB/PostgreSQL)
let paymentDatabase: PaymentRecord[] = [];

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, record, transactionId, phone } = req.body;

    if (action === 'store') {
      // Store a new payment record
      const paymentRecord: PaymentRecord = {
        id: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentName: record.studentName || 'Unknown',
        phone: record.phone || '',
        amount: record.amount || 0,
        timestamp: new Date().toISOString(),
        status: record.status || 'Completed',
        transactionId: record.transactionId,
        verifiedBy: record.verifiedBy || 'AI',
        rawMessage: record.rawMessage,
        reason: record.reason
      };

      paymentDatabase.push(paymentRecord);
      
      return res.status(200).json({
        success: true,
        message: 'Payment record stored',
        paymentId: paymentRecord.id,
        transactionId: paymentRecord.transactionId
      });
    }

    if (action === 'check') {
      // Check if transaction ID has been used before (fraud detection)
      const isDuplicate = paymentDatabase.some(
        p => p.transactionId?.toUpperCase() === transactionId?.toUpperCase()
      );
      
      return res.status(200).json({
        isDuplicate,
        message: isDuplicate ? 'Transaction already registered' : 'Transaction is new'
      });
    }

    if (action === 'getByPhone') {
      // Get all payment records for a phone number (for student dashboard)
      const records = paymentDatabase.filter(p => p.phone === phone);
      return res.status(200).json({
        count: records.length,
        records
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error: any) {
    console.error('Payment store error:', error);
    return res.status(500).json({
      error: 'Failed to process payment record',
      details: error.message
    });
  }
}
