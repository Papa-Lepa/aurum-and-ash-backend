import { sql } from '../lib/db.js';
import { applyCors, handlePreflight } from '../lib/cors.js';

export default async function handler(req, res) {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { family } = req.query;

    const perfumes = family
      ? await sql`SELECT * FROM perfumes WHERE family = ${family} ORDER BY name`
      : await sql`SELECT * FROM perfumes ORDER BY family, name`;

    return res.status(200).json(perfumes);
  } catch (err) {
    console.error('Failed to fetch perfumes:', err);
    return res.status(500).json({ error: 'Could not load the catalog right now' });
  }
}
