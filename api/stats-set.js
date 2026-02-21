import { put } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pwd');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const payload = req.body;
    if (typeof payload.profit === 'undefined') return res.status(400).json({ error: 'Invalid payload' });
    await put('xau-stats.json', JSON.stringify(payload), { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
    return res.status(200).json({ ok: true, updatedAt: payload.updatedAt });
  } catch (err) {
    console.error('stats-set error:', err);
    return res.status(500).json({ error: err.message });
  }
}
