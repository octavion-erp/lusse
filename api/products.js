import { list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=60');
  // 1) try Blob storage first (source of truth after first publish)
  try {
    const { blobs } = await list({ prefix: 'products' });
    const rec = blobs.find(b => b.pathname === 'products.json');
    if (rec && rec.url) {
      const r = await fetch(rec.url, { cache: 'no-store' });
      if (r.ok) {
        const data = await r.json();
        return res.status(200).json(data);
      }
    }
  } catch (e) { /* fall through to bundled */ }

  // 2) fallback: bundled products.json shipped with the deployment
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'products.json'), 'utf-8');
    return res.status(200).json(JSON.parse(raw));
  } catch (e) {
    return res.status(200).json({ products: [], updated: '', currency: 'AED', whatsapp: '971542005442' });
  }
}
