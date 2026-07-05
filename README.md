# AURUM & ASH — Backend

A minimal Node.js backend for the perfume catalog: Postgres for data, Vercel
serverless functions for the API, Resend for order-confirmation emails.
Every piece here has a free tier and no card is required for any of them at
this scale.

## What's inside

```
api/
  perfumes.js       GET  /api/perfumes            list catalog (optional ?family=)
  orders.js         POST /api/orders               place an order
  orders/[id].js    GET  /api/orders/:id           look up one order
lib/
  db.js             Postgres connection (Neon serverless driver)
  email.js          Resend email sending
sql/
  schema.sql        table definitions — run this first
  seed.sql          the 21 perfumes from the catalog — run this second
.env.example        copy to .env for local testing
```

## 1. Create a free Postgres database (Neon)

Neon is the recommended option because Vercel has a native integration for
it and its free tier is generous (0.5 GB storage, autosuspends when idle).

1. Go to your Vercel project → **Storage** tab → **Create Database** → choose
   **Neon** (Postgres) → follow the prompts. This automatically adds a
   `DATABASE_URL` environment variable to your project.
   - Alternative: sign up directly at [neon.tech](https://neon.tech), create
     a project, and copy the connection string it gives you — it looks like
     `postgresql://user:password@host/dbname?sslmode=require`.
2. Run the schema and seed files against that database. The easiest way is
   Neon's built-in **SQL Editor** in its dashboard: paste in the contents of
   `sql/schema.sql`, run it, then paste in `sql/seed.sql` and run that.
   - Or from your machine, if you have `psql` installed:
     ```bash
     psql "$DATABASE_URL" -f sql/schema.sql
     psql "$DATABASE_URL" -f sql/seed.sql
     ```

## 2. Create a free Resend account (for order emails)

1. Sign up at [resend.com](https://resend.com) — free tier includes 3,000
   emails/month, 100/day.
2. Go to **API Keys** → create one → copy it (starts with `re_`).
3. **Important limitation until you verify a domain:** on a brand-new Resend
   account you can only send emails **from** `onboarding@resend.dev`, and
   **to** the email address you signed up with. This is fine for testing the
   whole flow end-to-end. To email real customers, go to **Domains** in
   Resend, verify a domain you own (add a couple of DNS records), then set
   `ORDER_FROM_EMAIL` to something like `orders@yourdomain.com`.

## 3. Set environment variables in Vercel

Project → Settings → Environment Variables → add:

| Key | Value |
|---|---|
| `DATABASE_URL` | from step 1 (already set if you used the Storage tab) |
| `RESEND_API_KEY` | from step 2 |
| `ORDER_FROM_EMAIL` | `onboarding@resend.dev` (or your verified domain address) |
| `OWNER_EMAIL` | *(optional)* your own email, to get a copy of every new order |

## 4. Deploy

If this folder is its own repo:

```bash
npm install -g vercel   # one-time
vercel                  # first deploy, follow the prompts
vercel --prod           # promote to production
```

Or push this folder to a GitHub repo and import it in the Vercel dashboard —
every push to `main` redeploys automatically. No `vercel.json` is needed:
Vercel auto-detects the `api/` folder as serverless functions.

## 5. Test it

```bash
# List the catalog
curl https://your-project.vercel.app/api/perfumes

# Place an order (use perfume ids from the list above)
curl -X POST https://your-project.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Doe",
    "customerEmail": "you@yourinbox.com",
    "address": "123 Example St",
    "items": [{ "perfumeId": 1, "quantity": 2 }]
  }'
```

If it works, you'll get back a JSON order confirmation and an email should
land within a few seconds (check spam on first send).

## Connecting to a separately-hosted frontend (e.g. your React app)

This backend is set up to be deployed as its **own** Vercel project,
separate from your frontend's repo/project. That's a perfectly good setup —
it just means the two live on different domains, so the API needs CORS
enabled (it already is, via `lib/cors.js`), and your frontend needs to know
the backend's full URL rather than a relative `/api/...` path.

Steps:

1. Push this `aurum-backend` folder to its own GitHub repo (separate from
   your React app's repo).
2. Import it into Vercel as a new project. Once deployed, note its URL,
   e.g. `https://aurum-backend.vercel.app`.
3. In your **React app**, add an env var (in its own `.env`, or in Vercel's
   env vars for the frontend project):
   ```
   REACT_APP_API_URL=https://aurum-backend.vercel.app
   ```
4. In your React app's `src/api.js`, point requests at that URL, e.g.:
   ```js
   const API_URL = process.env.REACT_APP_API_URL;

   export async function getPerfumes() {
     const res = await fetch(`${API_URL}/api/perfumes`);
     return res.json();
   }

   export async function placeOrder(orderPayload) {
     const res = await fetch(`${API_URL}/api/orders`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(orderPayload),
     });
     return res.json();
   }
   ```
5. Once you know your frontend's deployed URL, set `CORS_ORIGIN` in the
   **backend** project's env vars to that exact URL (e.g.
   `https://aurum-frontend.vercel.app`), and redeploy the backend. This
   locks the API down so only your frontend can call it, instead of any
   site on the internet.

## Notes on "free"

- **Neon free tier**: no credit card required, database auto-suspends after
  inactivity (cold starts take ~1s to wake back up — fine for this use case).
- **Vercel free (Hobby) tier**: no credit card required, generous serverless
  function invocation limits for a project at this scale.
- **Resend free tier**: no credit card required, 3,000 emails/month.

None of these should incur any charge for a catalog at this scale, but it's
worth glancing at each provider's current free-tier limits before you launch,
since terms can change.
