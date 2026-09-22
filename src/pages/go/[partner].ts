// GET /go/:partner
// Logs the click in D1, then redirects. Used for Tools/Courses/partner
// e-guide affiliate links — NOT for Palmera "View project", which links
// straight to Palmera's own shareUrl (which already carries the referral
// code) and is never routed through here.
import type { APIRoute } from 'astro';

export const prerender = false;

// Destination registry — keep in sync with src/data/partners.ts and the
// tools/courses href values in src/pages/resources/index.astro. Move to
// D1's `partners` table once partners are managed at runtime.
const DESTINATIONS: Record<string, string> = {
  'tool-calculator-partner': 'https://example-mortgage-calculator-partner.com/?ref=amsi',
  'tool-fx-partner': 'https://example-fx-widget-partner.com/?ref=amsi',
  'course-offplan-101': 'https://example-course-partner.com/off-plan-101?ref=amsi',
  'course-payment-plans': 'https://example-course-partner.com/payment-plans?ref=amsi',
};

async function hashIp(ip: string): Promise<string> {
  const enc = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const GET: APIRoute = async ({ params, request, locals }) => {
  const env = locals.runtime.env;
  const partnerId = String(params.partner);
  const destination = DESTINATIONS[partnerId];

  if (!destination) {
    return new Response('Unknown partner link', { status: 404 });
  }

  const ip = request.headers.get('CF-Connecting-IP');
  const referer = request.headers.get('Referer');

  try {
    await env.DB.prepare(
      `INSERT INTO click_logs (id, partner_id, destination_url, source_page, ip_hash, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        partnerId,
        destination,
        referer ?? null,
        ip ? await hashIp(ip) : null,
        request.headers.get('User-Agent'),
      )
      .run();
  } catch {
    // Never block the redirect if logging fails.
  }

  return new Response(null, { status: 302, headers: { Location: destination } });
};
