import { put } from '@vercel/blob';

const DEFAULT_PW = 'lusse2026';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') return res.status(405).json({error:'Use POST'});

  const auth = req.headers['x-admin-password'];
  const expected = process.env.ADMIN_PASSWORD || DEFAULT_PW;
  if (!auth || auth !== expected) return res.status(401).json({error:'Incorrect password'});

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({error:'Invalid JSON'}); } }
  if (!body || !Array.isArray(body.products)) return res.status(400).json({error:'Body must contain products[]'});
  body.updated = new Date().toISOString().slice(0,10);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({
      error: 'Storage not connected. Open Vercel dashboard → Storage → create a Blob store (30 seconds).',
      setup: true,
      setupUrl: 'https://vercel.com/sirizonecom-2195s-projects/lusse/stores',
    });
  }

  try {
    const { url } = await put('products.json', JSON.stringify(body, null, 2), {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 10,
    });
    return res.status(200).json({ ok:true, url, updated: body.updated, count: body.products.length });
  } catch (e) {
    const msg = String(e && e.message || e);
    return res.status(500).json({ error: 'Publish failed: ' + msg });
  }
}
