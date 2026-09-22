// POST /api/lead
// Validates the enquiry footer submission (Turnstile + honeypot), saves it
// to D1, sends an instant email alert to Michael, forwards to n8n, and —
// when the enquiry is about a specific project and the visitor ticked the
// required consent box — registers a real lead with Palmera via POST /leads
// (Track B, per https://api.palmera.realestate/api/partner-docs.md).
//
// D1 is always the source of truth: the enquiry is saved there regardless
// of whether the Palmera call, the email alert, or the n8n forward succeed.
import type { APIRoute } from 'astro';
import { createLead } from '@/lib/palmera';

export const prerender = false;

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  contactPreference?: string;
  message?: string;
  interest?: string;
  projectReference?: string; // property title, for display/email only
  projectSource?: string; // Palmera project.source — present only for a project-specific enquiry
  projectId?: string; // Palmera project.id
  sourcePage: string;
  consentContact: string | boolean;
  consentMarketing?: string | boolean;
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

  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  // Honeypot — real users never fill this hidden field in.
  if (payload.honeypot) {
    return jsonResponse({ ok: true }); // pretend success, drop silently
  }

  if (!payload.name || !payload.email || !payload.consentContact) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  const ip = request.headers.get('CF-Connecting-IP');

  // In production, require a real Turnstile pass. Skipped only if no secret
  // is configured yet (local/dev), so the endpoint stays testable pre-launch.
  if (env.TURNSTILE_SECRET_KEY) {
    const passed = await verifyTurnstile(payload.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!passed) {
      return jsonResponse({ error: 'Verification failed' }, 400);
    }
  }

  const id = crypto.randomUUID();
  const ipHash = ip ? await hashIp(ip) : null;

  try {
    await env.DB.prepare(
      `INSERT INTO leads (
        id, source_page, interest, name, email, phone, contact_preference, message,
        project_reference, project_source, project_id, consent_contact, consent_marketing,
        consent_text_version, ip_hash, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        payload.sourcePage ?? 'unknown',
        payload.interest ?? null,
        payload.name,
        payload.email,
        payload.phone ?? null,
        payload.contactPreference ?? null,
        payload.message ?? null,
        payload.projectReference || null,
        payload.projectSource || null,
        payload.projectId || null,
        payload.consentContact ? 1 : 0,
        payload.consentMarketing ? 1 : 0,
        payload.consentTextVersion ?? 'unknown',
        ipHash,
        request.headers.get('User-Agent'),
      )
      .run();
  } catch {
    return jsonResponse({ error: 'Could not save lead' }, 500);
  }

  // Track B: register with Palmera when this enquiry is about a specific
  // project. Idempotency-Key = our own lead id, so a network retry on our
  // side never double-creates the lead at Palmera. This never blocks or
  // fails the response to the visitor — D1 already has the enquiry safely.
  if (payload.projectSource && payload.projectId && env.PALMERA_KEY) {
    try {
      const palmeraLead = await createLead(env.PALMERA_KEY, id, {
        buyer: {
          fullName: payload.name,
          email: payload.email,
          phone: payload.phone || undefined,
        },
        project: { source: payload.projectSource, id: payload.projectId },
        sourceChannel: 'website',
        externalRef: id,
      });
      await env.DB.prepare(
        `UPDATE leads SET palmera_lead_id = ?, palmera_status = ?, registered_with_partner_at = datetime('now'), status = 'registered-with-partner' WHERE id = ?`,
      )
        .bind(palmeraLead.id, palmeraLead.status, id)
        .run();
    } catch (err) {
      // Log-worthy, but never block the visitor's confirmation — Michael
      // can still see and manually register this lead from D1/email.
      console.error('Palmera lead creation failed', err);
    }
  }

  // Instant email alert to Michael. Swap the fetch below for whichever
  // free-tier sender is chosen (Brevo/MailerLite/Resend) — this is written
  // against a generic REST send call; adjust the endpoint/body to match.
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
        subject: `New enquiry: ${payload.interest ?? 'General'} — ${payload.name}`,
        text: `${payload.name} <${payload.email}>\nInterest: ${payload.interest ?? 'n/a'}\nProject: ${payload.projectReference ?? 'n/a'}\nMessage: ${payload.message ?? 'n/a'}\nSource: ${payload.sourcePage}`,
      }),
    });
  } catch {
    // Do not fail the lead save if the email alert fails.
  }

  // Forward to n8n for downstream automation. Retries once on failure; the
  // lead is already safely in D1 regardless of outcome.
  if (env.N8N_LEAD_WEBHOOK_URL) {
    const forward = async () =>
      fetch(env.N8N_LEAD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload }),
      });
    try {
      await forward();
    } catch {
      try {
        await forward();
      } catch {
        // Give up silently — the lead is safe in D1.
      }
    }
  }

  return jsonResponse({ ok: true, id });
};
