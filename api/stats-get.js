import { list, download } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { blobs } = await list({
      prefix: 'xau-stats.json',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    if (!blobs || blobs.length === 0) return res.status(200).json({});

    const { body } = await download(blobs[0].url, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    const chunks = [];
    for await (const chunk of body) chunks.push(chunk);
    const data = JSON.parse(Buffer.concat(chunks).toString());
    return res.status(200).json(data);
  } catch (err) {
    console.error('stats-get error:', err);
    return res.status(500).json({ error: err.message });
  }
}
