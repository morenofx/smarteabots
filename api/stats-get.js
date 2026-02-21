import { list } from '@vercel/blob';

const ADMIN_PWD = process.env.ADMIN_PASSWORD || 'xauadmin2024';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pwd');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const reqPwd = req.headers['x-admin-pwd'];
  if (reqPwd !== undefined && reqPwd !== ADMIN_PWD) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { blobs } = await list({ prefix: 'xau-stats.json' });
    if (!blobs || blobs.length === 0) return res.status(200).json({});
    const response = await fetch(blobs[0].downloadUrl);
    if (!response.ok) return res.status(200).json({});
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
