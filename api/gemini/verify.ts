import { GoogleGenAI, Type } from '@google/genai';
import { callModel } from '../_lib/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Invalid payload' });

  try {
    // Pure regex-based verification - more reliable than AI
    const amountMatch = message.match(/Ksh\s*150\.?00?/i) || message.match(/KSH\s*150\.?00?/i);
    const eduPathMatch = message.match(/sent to EDU PATH/i);
    const confirmedMatch = message.match(/Confirmed/i);
    
    // Extract transaction ID from multiple patterns
    let transactionId = "";
    const idPatterns = [
      /^([A-Z0-9]{10})\s+Confirmed/i,  // ID at start like "QAZ7XPL9MN Confirmed"
      /^([A-Z0-9]{8,12})/i,           // Any alphanumeric ID at start
      /Transaction ID:\s*([A-Z0-9]+)/i,
      /transaction code:\s*([A-Z0-9]+)/i,
      /ID:\s*([A-Z0-9]+)/i
    ];
    
    for (const pattern of idPatterns) {
      const match = message.match(pattern);
      if (match) {
        transactionId = match[1];
        break;
      }
    }
    
    // Validation logic
    const isValid = !!(amountMatch && eduPathMatch && confirmedMatch && transactionId);
    const reason = isValid 
      ? "Payment verified successfully" 
      : !amountMatch ? "Amount Ksh150.00 not found"
      : !eduPathMatch ? "Payment not sent to EDU PATH"
      : !confirmedMatch ? "Payment not confirmed"
      : !transactionId ? "Transaction ID not found"
      : "Validation failed";

    return res.status(200).json({
      isValid,
      transactionId,
      reason
    });

  } catch (error: any) {
    console.error('verify error', error);
    return res.status(500).json({ error: 'Verification failed', reason: error.message });
  }
}
