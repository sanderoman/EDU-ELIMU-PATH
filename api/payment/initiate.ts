export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { phone, amount, studentName } = req.body || {};
  if (!phone || !amount) return res.status(400).json({ error: 'Invalid payload' });

  // Validate Safaricom number
  if (!phone.match(/^(?:254|\+254|0)?7(?:[0-9]){8}$/)) {
    return res.status(400).json({ error: 'Invalid Safaricom number' });
  }

  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));

  const checkoutRequestId = 'ws_CO_' + crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
  return res.status(200).json({ checkoutRequestId });
}
