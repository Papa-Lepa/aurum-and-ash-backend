import { sql } from '../../lib/db.js';
import { applyCors, handlePreflight } from '../../lib/cors.js';

export default async function handler(req, res) {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { id } = req.query;
  if (!/^\d+$/.test(String(id))) {
    return res.status(400).json({ error: 'Order id must be a number' });
  }

  try {
    const [order] = await sql`SELECT * FROM orders WHERE id = ${id}`;
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const items = await sql`SELECT * FROM order_items WHERE order_id = ${id}`;
    return res.status(200).json({ ...order, items });
  } catch (err) {
    console.error('Failed to fetch order:', err);
    return res.status(500).json({ error: 'Could not load this order' });
  }
}
