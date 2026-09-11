// Server-side publisher: writes products.json to GitHub via API.
// Env vars required (set in Vercel dashboard → Settings → Environment Variables):
//   ADMIN_PASSWORD   — password expected in x-admin-password header
//   GITHUB_TOKEN     — fine-grained PAT with "Contents: Read and write" on octavion-erp/lusse
//   GITHUB_REPO      — optional, defaults to "octavion-erp/lusse"
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({error:"Use POST"});

  const pass = req.headers["x-admin-password"];
  if (!process.env.ADMIN_PASSWORD) return res.status(500).json({error:"Server missing ADMIN_PASSWORD env"});
  if (!pass || pass !== process.env.ADMIN_PASSWORD) return res.status(401).json({error:"Invalid password"});

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({error:"Server missing GITHUB_TOKEN env"});
  const repo = process.env.GITHUB_REPO || "octavion-erp/lusse";
  const path = "products.json";
  const branch = "main";

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { return res.status(400).json({error:"Invalid JSON"}); } }
  if (!body || !Array.isArray(body.products)) return res.status(400).json({error:"Missing products[] in body"});
  body.updated = new Date().toISOString().slice(0,10);

  const contentB64 = Buffer.from(JSON.stringify(body, null, 2), "utf-8").toString("base64");
  const H = {"Authorization":`Bearer ${token}`,"Accept":"application/vnd.github+json","User-Agent":"lusse-admin","X-GitHub-Api-Version":"2022-11-28"};

  // Get current SHA (if file exists)
  let sha;
  try {
    const cur = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {headers:H});
    if (cur.ok) { const j = await cur.json(); sha = j.sha; }
    else if (cur.status !== 404) {
      const txt = await cur.text();
      return res.status(500).json({error:"Failed to read current file", status:cur.status, detail:txt.slice(0,300)});
    }
  } catch (e) { return res.status(500).json({error:"GitHub read error", detail:String(e)}); }

  const put = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method:"PUT",
    headers:{...H,"Content-Type":"application/json"},
    body: JSON.stringify({
      message: `Update products.json via admin (${body.updated})`,
      content: contentB64,
      branch,
      ...(sha && {sha}),
      committer: {name:"LUSSÉ Admin", email:"admin@lussehair.com"},
    })
  });

  if (!put.ok) {
    const txt = await put.text();
    return res.status(500).json({error:"GitHub commit failed", status:put.status, detail:txt.slice(0,400)});
  }
  const j = await put.json();
  return res.status(200).json({ok:true, sha:j.commit?.sha, commit_url:j.commit?.html_url});
}
