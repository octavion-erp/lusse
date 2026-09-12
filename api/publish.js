import { put } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({error:'Use POST'});

  const auth = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD) return res.status(500).json({error:'Server missing ADMIN_PASSWORD env var'});
  if (!auth || auth !== process.env.ADMIN_PASSWORD) return res.status(401).json({error:'Invalid password'});

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({error:'Invalid JSON'}); } }
  if (!body || !Array.isArray(body.products)) return res.status(400).json({error:'Missing products[]'});
  body.updated = new Date().toISOString().slice(0,10);

  try {
    const { url } = await put('products.json', JSON.stringify(body, null, 2), {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 30,
    });
    return res.status(200).json({ ok:true, url, updated: body.updated, count: body.products.length });
  } catch (e) {
    const msg = String(e && e.message || e);
    if (msg.includes('BLOB_READ_WRITE_TOKEN') || msg.includes('No token')) {
      return res.status(503).json({ error: 'Storage not connected yet. Open Vercel dashboard → Storage → Create Blob store, then Redeploy.', setup: true });
    }
    return res.status(500).json({ error: 'Publish failed: ' + msg });
  }
}
