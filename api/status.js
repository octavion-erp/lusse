export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json({
    blob: !!process.env.BLOB_READ_WRITE_TOKEN,
    ready: !!process.env.BLOB_READ_WRITE_TOKEN,
    setupUrl: 'https://vercel.com/sirizonecom-2195s-projects/lusse/stores',
  });
}
