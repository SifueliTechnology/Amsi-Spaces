// POST /api/gumroad-ping
// Receives Gumroad's Ping webhook (sale/download events) for Amsi's own
// e-guides, logs it to D1 first so nothing is lost, then forwards to n8n to
// trigger follow-up sequences.
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const contentType = request.headers.get('Content-Type') ?? '';
  let fields: Record<string, string> = {};

  // Gumroad Ping sends application/x-www-form-urlencoded by default.
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const body = await request.text();
    fields = Object.fromEntries(new URLSearchParams(body));
  } else {
    try {
      fields = await request.json();
    } catch {
      return new Response('Invalid payload', { status: 400 });
    }
  }

  const id = crypto.randomUUID();

  try {
    await env.DB.prepare(
      `INSERT INTO gumroad_events (id, product_id, sale_id, email, price, raw_payload)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        fields.product_id ?? fields.product_permalink ?? null,
        fields.sale_id ?? null,
        fields.email ?? null,
        fields.price ? Number(fields.price) / 100 : null, // Gumroad sends price in cents
        JSON.stringify(fields),
      )
      .run();
  } catch {
    return new Response('Could not log event', { status: 500 });
  }

  if (env.N8N_LEAD_WEBHOOK_URL) {
    try {
      await fetch(env.N8N_LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gumroad_sale', id, ...fields }),
      });
      await env.DB.prepare(`UPDATE gumroad_events SET forwarded_to_n8n = 1 WHERE id = ?`).bind(id).run();
    } catch {
      // Leave forwarded_to_n8n = 0 — a retry/replay job can pick this up later.
    }
  }

  return new Response('OK', { status: 200 });
};
