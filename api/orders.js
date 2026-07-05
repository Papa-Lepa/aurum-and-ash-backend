import { sql } from '../lib/db.js';
import { sendOrderConfirmationEmail, sendOwnerNotification } from '../lib/email.js';
import { applyCors, handlePreflight } from '../lib/cors.js';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default async function handler(req, res) {
  applyCors(req, res);
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { customerName, customerEmail, address, items } = req.body || {};

    if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'customerName, customerEmail, and at least one item are required',
      });
    }
    if (!EMAIL_RE.test(customerEmail)) {
      return res.status(400).json({ error: 'customerEmail is not a valid email address' });
    }

    const perfumeIds = [...new Set(items.map((i) => Number(i.perfumeId)))];
    if (perfumeIds.some((id) => !Number.isInteger(id))) {
      return res.status(400).json({ error: 'Every item needs a valid perfumeId' });
    }

    // Always price from the database — never trust a price sent by the client.
    const perfumes = await sql`SELECT id, name, price_cents FROM perfumes WHERE id = ANY(${perfumeIds})`;
    if (perfumes.length !== perfumeIds.length) {
      return res.status(400).json({ error: 'One or more items reference a perfume that does not exist' });
    }
    const priceMap = new Map(perfumes.map((p) => [p.id, p]));

    let totalCents = 0;
    const resolvedItems = items.map((i) => {
      const p = priceMap.get(Number(i.perfumeId));
      const quantity = Math.max(1, parseInt(i.quantity, 10) || 1);
      totalCents += p.price_cents * quantity;
      return { perfumeId: p.id, name: p.name, unitPriceCents: p.price_cents, quantity };
    });

    const [order] = await sql`
      INSERT INTO orders (customer_name, customer_email, address, total_cents, status)
      VALUES (${customerName}, ${customerEmail}, ${address || null}, ${totalCents}, 'received')
      RETURNING id, created_at
    `;

    for (const item of resolvedItems) {
      await sql`
        INSERT INTO order_items (order_id, perfume_id, perfume_name, quantity, unit_price_cents)
        VALUES (${order.id}, ${item.perfumeId}, ${item.name}, ${item.quantity}, ${item.unitPriceCents})
      `;
    }

    // The order is already saved at this point. If email fails, we log it
    // but still tell the customer their order went through.
    try {
      await sendOrderConfirmationEmail({
        to: customerEmail,
        orderId: order.id,
        items: resolvedItems,
        total: totalCents,
        customerName,
      });
      if (process.env.OWNER_EMAIL) {
        await sendOwnerNotification({
          ownerEmail: process.env.OWNER_EMAIL,
          orderId: order.id,
          customerName,
          customerEmail,
          total: totalCents,
        });
      }
    } catch (emailErr) {
      console.error(`Order #${order.id} saved, but confirmation email failed:`, emailErr);
    }

    return res.status(201).json({
      orderId: order.id,
      status: 'received',
      total: totalCents / 100,
      createdAt: order.created_at,
    });
  } catch (err) {
    console.error('Failed to create order:', err);
    return res.status(500).json({ error: 'Something went wrong while placing your order' });
  }
}
