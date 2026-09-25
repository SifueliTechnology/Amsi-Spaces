// POST /api/guide-request
// Backs the free e-guide capture popup (GuideCaptureModal.astro). Saves the
// visitor as a lead in D1 (interest: 'e-guide', so it's easy to filter from
// property/general enquiries), then emails them the guide's download link.
// Mirrors src/pages/api/lead.ts's structure — see that file for the fuller
// version of this pattern (Palmera registration, n8n forward) which doesn't
// apply here since a guide request isn't about a specific property.
import type { APIRoute } from 'astro';
import { eguides } from '@/data/eguides';

export const prerender = false;

interface GuideRequestPayload {
  name: string;
  email?: string; // omitted when alreadyGivenEmail is set — resolved by phone instead
  phone?: string;
  alreadyGivenEmail?: string | boolean; // checkbox: "look my email up by phone instead"
  guideSlug: string;
  guideTitle?: string;
  sourcePage: string;
  consentTextVersion: string;
  honeypot?: string;
  turnstileToken?: string;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function verifyTurnstile(token: string | undefined, secret: string, ip: string | null) {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

async function hashIp(ip: string): Promise<string> {
  const enc = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = locals.runtime.env;

  let payload: GuideRequestPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  // Honeypot — real users never fill this hidden field in.
  if (payload.honeypot) {
    return jsonResponse({ ok: true }); // pretend success, drop silently
  }

  const alreadyGivenEmail = payload.alreadyGivenEmail === true || payload.alreadyGivenEmail === 'true' || payload.alreadyGivenEmail === 'on';

  if (!payload.name || !payload.guideSlug || (!payload.email && !(alreadyGivenEmail && payload.phone))) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  const guide = eguides.find((g) => g.slug === payload.guideSlug && g.fileUrl);
  if (!guide || !guide.fileUrl) {
    return jsonResponse({ error: 'Unknown guide' }, 400);
  }

  const ip = request.headers.get('CF-Connecting-IP');

  // Same Turnstile gate as /api/lead — skipped only if no secret is
  // configured yet (local/dev), so the endpoint stays testable pre-launch.
  if (env.TURNSTILE_SECRET_KEY) {
    const passed = await verifyTurnstile(payload.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!passed) {
      return jsonResponse({ error: 'Verification failed' }, 400);
    }
  }

  // "I've already given my email" — look up their most recent lead with
  // that phone number instead of asking again.
  let email = payload.email;
  if (!email && alreadyGivenEmail && payload.phone) {
    const found = await env.DB.prepare(
      `SELECT email FROM leads WHERE phone = ? AND email IS NOT NULL ORDER BY created_at DESC LIMIT 1`,
    )
      .bind(payload.phone)
      .first<{ email: string }>();
    if (!found) {
      return jsonResponse(
        { error: "We couldn't find an email on file for that phone number — please enter your email once." },
        400,
      );
    }
    email = found.email;
  }

  const id = crypto.randomUUID();
  const ipHash = ip ? await hashIp(ip) : null;

  try {
    await env.DB.prepare(
      `INSERT INTO leads (
        id, source_page, interest, name, email, phone,
        project_reference, consent_contact, consent_marketing,
        consent_text_version, ip_hash, user_agent
      ) VALUES (?, ?, 'e-guide', ?, ?, ?, ?, 1, 1, ?, ?, ?)`,
    )
      .bind(
        id,
        payload.sourcePage ?? 'unknown',
        payload.name,
        email,
        payload.phone ?? null,
        guide.title,
        payload.consentTextVersion ?? 'unknown',
        ipHash,
        request.headers.get('User-Agent'),
      )
      .run();
  } catch {
    return jsonResponse({ error: 'Could not save request' }, 500);
  }

  const downloadUrl = new URL(guide.fileUrl, request.url).toString();

  // Email the guide's download link to the visitor. Never blocks the
  // response — the lead is already safely in D1 regardless of outcome.
  if (env.ALERT_EMAIL_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.ALERT_EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.ALERT_EMAIL_FROM,
          to: email,
          subject: `Your guide: ${guide.title}`,
          html: `<p>Hi ${payload.name},</p><p>Thanks for requesting <strong>${guide.title}</strong> — here's your download link:</p><p><a href="${downloadUrl}">${downloadUrl}</a></p><p>Amsi Spaces</p>`,
          text: `Hi ${payload.name},\n\nThanks for requesting ${guide.title} — here's your download link:\n${downloadUrl}\n\nAmsi Spaces`,
        }),
      });
    } catch {
      // Do not fail the request if the email fails — lead is saved; can be
      // followed up manually from D1.
    }

    // Internal alert to Michael, same as new enquiries — keeps guide
    // requests visible alongside property leads instead of only in D1.
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.ALERT_EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.ALERT_EMAIL_FROM,
          to: env.ALERT_EMAIL_TO,
          subject: `New guide request: ${guide.title} — ${payload.name}`,
          text: `${payload.name} <${email}>\nPhone: ${payload.phone ?? 'n/a'}\nGuide: ${guide.title}\nSource: ${payload.sourcePage}${alreadyGivenEmail ? '\n(email looked up by phone)' : ''}`,
        }),
      });
    } catch {
      // Non-blocking.
    }
  }

  return jsonResponse({ ok: true, id });
};
