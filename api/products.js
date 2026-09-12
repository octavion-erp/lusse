import { list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: 'products' });
      const rec = blobs.find(b => b.pathname === 'products.json');
      if (rec && rec.url) {
        const r = await fetch(rec.url + '?t=' + Date.now(), { cache: 'no-store' });
        if (r.ok) {
          const data = await r.json();
          data.__source = 'blob';
          return res.status(200).json(data);
        }
      }
    } catch (e) { /* fall through */ }
  }

  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'products.json'), 'utf-8');
    const data = JSON.parse(raw);
    data.__source = 'bundle';
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({ products: [], updated: '', currency: 'AED', whatsapp: '971542005442', __source: 'empty' });
  }
}
