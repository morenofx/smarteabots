import { put } from '@vercel/blob';

const ADMIN_PWD = process.env.ADMIN_PASSWORD || 'xauadmin2024';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pwd');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const reqPwd = req.headers['x-admin-pwd'];
  if (!reqPwd || reqPwd !== ADMIN_PWD) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = req.body;
    if (typeof payload.profit === 'undefined') return res.status(400).json({ error: 'Invalid payload' });
    await put('xau-stats.json', JSON.stringify(payload), { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
    return res.status(200).json({ ok: true, updatedAt: payload.updatedAt });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
