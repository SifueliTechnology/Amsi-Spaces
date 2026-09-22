// POST /api/palmera-webhook
// Receives Palmera's webhook events (lead.status_changed, commission.accrued,
// etc.) and follows the brief's three receiver rules exactly:
//   1. Verify the signature over the RAW request bytes before parsing.
//   2. Dedupe on the event id (delivery is at least-once by design).
//   3. Answer 2xx immediately; Palmera waits up to 10s, then treats it as
//      failed and retries on its 8-step schedule (1m, 5m, 30m, 2h, 6h, 12h, 24h).
//
// Register this endpoint's URL (https://amsispaces.com/api/palmera-webhook)
// in the Palmera partner area once deployed, then use
// POST /webhook-endpoints/{id}/ping to send a test `endpoint.test` event and
// confirm it verifies correctly end to end.
import type { APIRoute } from 'astro';

export const prerender = false;

async function verifySignature(
  rawBody: string,
  headers: Headers,
  secret: string,
  toleranceSec = 300,
): Promise<boolean> {
  const ts = headers.get('palmera-webhook-timestamp') ?? '';
  if (!/^\d+$/.test(ts)) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > toleranceSec) return false; // stale timestamp — refuse

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret.trim()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signed = new TextEncoder().encode(`${ts}.${rawBody}`);
  const sigBuffer = await crypto.subtle.sign('HMAC', key, signed);
  const expected = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const presented = (headers.get('palmera-webhook-signature') ?? '').split(' ');
  // Support two signatures during Palmera's key-rotation window.
  return presented.some((part) => {
    if (!part.startsWith('v1=')) return false;
    const got = part.slice(3);
    // Constant-time-ish compare: lengths must match, then compare char codes.
    if (got.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const rawBody = await request.text(); // raw bytes — verify BEFORE any JSON.parse

  const valid = await verifySignature(rawBody, request.headers, env.PALMERA_WEBHOOK_SECRET);
  if (!valid) {
    return new Response('Invalid signature', { status: 401 });
  }

  let event: {
    id: string;
    type: string;
    occurredAt: string;
    data: Record<string, unknown>;
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Dedupe on event id — a delivery may arrive more than once by design.
  const already = await env.DB.prepare(`SELECT id FROM palmera_webhook_events WHERE id = ?`)
    .bind(event.id)
    .first();
  if (already) {
    return new Response('OK (duplicate, already processed)', { status: 200 });
  }

  await env.DB.prepare(
    `INSERT INTO palmera_webhook_events (id, type, occurred_at, raw_payload) VALUES (?, ?, ?, ?)`,
  )
    .bind(event.id, event.type, event.occurredAt, rawBody)
    .run();

  // Answer 2xx now; everything below is best-effort and never blocks the
  // response Palmera is waiting on.
  const work = (async () => {
    try {
      if (event.type === 'lead.status_changed' || event.type === 'lead.created') {
        const lead = event.data.lead as { id: string; status: string } | undefined;
        if (lead?.id) {
          await env.DB.prepare(
            `UPDATE leads SET palmera_status = ? WHERE palmera_lead_id = ?`,
          )
            .bind(lead.status, lead.id)
            .run();
        }
      }
      if (event.type === 'catalog.changed') {
        // A cheap nudge: the next request to /properties will still read
        // whatever's cached until the next scheduled sync. If near-real-time
        // freshness matters more than the daily cadence, call syncCatalogue(env)
        // here directly — left out by default to respect Palmera's rate limits
        // if catalog.changed fires often.
      }
    } catch (err) {
      console.error('Palmera webhook processing failed', event.id, err);
    }
  })();

  // Cloudflare Workers: ensure the async work actually finishes even though
  // we've already returned the response below.
  // @ts-expect-error - waitUntil is provided by the Cloudflare runtime context
  locals.runtime?.ctx?.waitUntil?.(work);

  return new Response('OK', { status: 200 });
};
