// POST /api/palmera-sync
// Runs the daily catalogue sync (src/lib/palmera.ts: syncCatalogue), which
// populates the KV cache that /properties and /api/properties read from.
//
// Cloudflare Pages Functions/Astro-on-Pages don't get a built-in cron
// trigger the way a plain Cloudflare Worker does, so this is a plain HTTP
// endpoint, protected by a shared secret, meant to be called once a day (or
// as often as you like — it's cheap; /projects/changes is 60/min) by an
// external scheduler. Three easy options, pick one:
//   1. cron-job.org (free) — POST this URL with the header below, daily.
//   2. A GitHub Actions workflow on a schedule (`cron:` trigger) that curls it.
//   3. n8n, once it's stood up — a Cron node calling this endpoint.
import type { APIRoute } from 'astro';
import { syncCatalogue } from '@/lib/palmera';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;

  const provided = request.headers.get('X-Sync-Secret');
  if (!env.PALMERA_SYNC_SECRET || provided !== env.PALMERA_SYNC_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await syncCatalogue(env);
    return new Response(JSON.stringify({ ok: true, ...result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Convenience GET for a quick manual trigger/health-check from a browser —
// same auth requirement, via a query param instead of a header.
export const GET: APIRoute = async ({ url, locals }) => {
  const env = locals.runtime.env;
  const provided = url.searchParams.get('secret');
  if (!env.PALMERA_SYNC_SECRET || provided !== env.PALMERA_SYNC_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  try {
    const result = await syncCatalogue(env);
    return new Response(JSON.stringify({ ok: true, ...result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
