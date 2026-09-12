import { put } from '@vercel/blob';
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});

  const auth = req.headers['x-admin-password'];
  const expected = process.env.ADMIN_PASSWORD || 'lusse2026';
  if (!auth || auth !== expected) return res.status(401).json({error:'Unauthorized'});
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({error:'Storage not connected'});

  const filename = (req.query.filename || `upload-${Date.now()}`).replace(/[^\w.\-]/g,'_');
  const contentType = req.headers['content-type'] || 'application/octet-stream';

  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks);
    if (body.length === 0) return res.status(400).json({error:'Empty body'});
    if (body.length > 45 * 1024 * 1024) return res.status(413).json({error:'File too large (max 45MB)'});

    const blob = await put(`media/${filename}`, body, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });
    return res.status(200).json({ ok:true, url: blob.url, pathname: blob.pathname, size: body.length, contentType });
  } catch (e) {
    return res.status(500).json({ error: 'Upload failed: ' + String(e && e.message || e) });
  }
}
