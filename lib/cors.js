// Lets the API be called from a frontend hosted on a different domain
// (your CRA app's Vercel URL, e.g. https://aurum-frontend.vercel.app).
//
// Set CORS_ORIGIN in the backend project's env vars to that exact URL once
// you know it. Until then it defaults to "*" (any origin) so you can test
// freely — tighten it before you consider this "done".

export function applyCors(req, res) {
  const allowedOrigin = process.env.CORS_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Browsers send an OPTIONS "preflight" request before POSTs with a JSON
// body. Call this at the top of every handler; if it returns true, the
// handler should stop (the preflight response has already been sent).
export function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    applyCors(req, res);
    res.status(204).end();
    return true;
  }
  return false;
}
