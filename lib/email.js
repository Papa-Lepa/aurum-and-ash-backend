 import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Until you verify your own domain with Resend, you must send FROM
// onboarding@resend.dev, and you can only send TO the email address you
// signed up to Resend with. Verify a domain in the Resend dashboard to
// lift both restrictions. See README.md for details.
const FROM_EMAIL = process.env.ORDER_FROM_EMAIL || 'onboarding@resend.dev';

function money(cents) {
  return `KSh ${(cents / 100).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function itemsTable(items) {
  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${i.name}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${money(i.unitPriceCents)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${money(i.unitPriceCents * i.quantity)}</td>
      </tr>`
    )
    .join('');

  return `
    <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:6px 10px;border-bottom:2px solid #111;">Item</th>
          <th style="text-align:center;padding:6px 10px;border-bottom:2px solid #111;">Qty</th>
          <th style="text-align:right;padding:6px 10px;border-bottom:2px solid #111;">Price</th>
          <th style="text-align:right;padding:6px 10px;border-bottom:2px solid #111;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

export async function sendOrderConfirmationEmail({ to, orderId, items, total, customerName }) {
  const html = `
    <div style="font-family:sans-serif;color:#111;max-width:520px;margin:0 auto;">
      <h2 style="font-weight:400;">Thank you, ${customerName}.</h2>
      <p>Your order <strong>#${orderId}</strong> has been received.</p>
      ${itemsTable(items)}
      <p style="text-align:right;font-size:16px;margin-top:16px;">
        <strong>Total: ${money(total)}</strong>
      </p>
      <p style="color:#666;font-size:13px;margin-top:32px;">
        We'll be in touch if anything about your order needs attention.
      </p>
    </div>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Order Confirmation — #${orderId}`,
    html,
  });
}

export async function sendOwnerNotification({ ownerEmail, orderId, customerName, customerEmail, total }) {
  const html = `
    <div style="font-family:sans-serif;color:#111;">
      <h3>New order #${orderId}</h3>
      <p><strong>${customerName}</strong> (${customerEmail}) just placed an order totaling <strong>${money(total)}</strong>.</p>
    </div>`;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ownerEmail,
    subject: `New order #${orderId} — ${money(total)}`,
    html,
  });
}
