import { put, list } from '@vercel/blob';

const DEFAULTS = {
  brand: 'LUSSÉ',
  tagline: 'REMY HUMAN HAIR',
  phone: '+971 54 200 5442',
  whatsapp: '971542005442',
  email: 'info@lussehair.com',
  address: 'Dubai, UAE',
  hours: 'Tue–Sun · 10 am – 8 pm',
  social: {
    instagram: 'https://www.instagram.com/lussehaircom',
    tiktok: '',
    facebook: '',
    snapchat: '',
    x: '',
    youtube: '',
    threads: '',
    pinterest: '',
    website: 'https://lussehair.com'
  }
};

const PATH = 'settings.json';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(200).json(DEFAULTS);
      const { blobs } = await list({ prefix: 'settings' });
      const rec = blobs.find(b => b.pathname === PATH);
      if (rec && rec.url) {
        const r = await fetch(rec.url + '?t=' + Date.now(), { cache: 'no-store' });
        if (r.ok) return res.status(200).json(await r.json());
      }
      return res.status(200).json(DEFAULTS);
    } catch (e) {
      return res.status(200).json(DEFAULTS);
    }
  }

  if (req.method === 'POST') {
    const auth = req.headers['x-admin-password'];
    const expected = process.env.ADMIN_PASSWORD || 'lusse2026';
    if (!auth || auth !== expected) return res.status(401).json({ error: 'Unauthorized' });
    if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'Storage not connected', setup: true });

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); } }
    if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Body must be an object' });

    const merged = { ...DEFAULTS, ...body, social: { ...DEFAULTS.social, ...(body.social || {}) }, updated: new Date().toISOString().slice(0,10) };
    if (merged.whatsapp) merged.whatsapp = String(merged.whatsapp).replace(/\D/g, '');

    try {
      const { url } = await put(PATH, JSON.stringify(merged, null, 2), {
        access: 'public',
        contentType: 'application/json; charset=utf-8',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 10,
      });
      return res.status(200).json({ ok: true, url, settings: merged });
    } catch (e) {
      return res.status(500).json({ error: 'Save failed: ' + (e.message || String(e)) });
    }
  }

  return res.status(405).json({ error: 'GET or POST' });
}
