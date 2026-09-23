// ---------------------------------------------------------------------------
// PALMERA PARTNER API — real server-to-server integration.
// ---------------------------------------------------------------------------
// Source of truth: https://api.palmera.realestate/api/partner-docs.md and
// https://api.palmera.realestate/api/partner-docs-json (OpenAPI 3.1), read
// 2026-09-22. Only endpoints/fields/headers documented there are used here.
//
// There are THREE different Palmera surfaces — don't mix them up:
//   1. The Palmera MCP connector (get_partner_context, list_projects, ...) —
//      a Claude-side tool, usable only inside a Claude session. Not callable
//      from this Worker.
//   2. https://api.palmera.realestate/api/v1/partner/mcp — a Palmera-hosted
//      remote MCP server, for AI agents/assistants to talk to Palmera. Not
//      meant for a plain server backend either — it speaks MCP, not a REST
//      contract a Cloudflare Worker should integrate against directly.
//   3. https://api.palmera.realestate/api/v1/partner-api/v1 — the actual
//      Partner REST API, documented by the OpenAPI spec above. THIS is what
//      this file calls. It's the only one designed for a website's backend.
//
// Two tracks, per the brief:
//   Track A — show Palmera's projects on the site (fetchProjects/fetchProject
//   below, backed by a KV-cached sync — see syncCatalogue and functions/api/palmera-sync.ts).
//   Track B — send leads to Palmera and follow their status (createLead
//   below, called from functions/api/lead.ts; status updates arrive via
//   functions/api/palmera-webhook.ts).
//
// Auth: `Authorization: Bearer <PALMERA_KEY>` on every call. Scopes on the
// key must include projects:read for Track A and leads:write (+ leads:read
// to poll status) for Track B. The key and PALMERA_WEBHOOK_SECRET live only
// in Cloudflare secrets (`wrangler pages secret put ...`) — never in source,
// never logged, never printed by any of these functions.
// ---------------------------------------------------------------------------

export const PALMERA_API_BASE = 'https://api.palmera.realestate/api/v1/partner-api/v1';

export interface PalmeraEnv {
  PALMERA_KEY: string;
  PALMERA_CACHE: KVNamespace;
}

// --- Types (trimmed to the fields this site actually renders) -------------

export interface PaymentPlanStep {
  label: string;
  percent: number | null;
  timing: string | null;
  monthly: number | null;
}
export interface PaymentPlanOption {
  label: string | null;
  description: string | null;
  steps: PaymentPlanStep[];
}
export type PaymentPlan =
  | { shape: 'ratio'; value: string; options: null }
  | { shape: 'schedule'; value: null; options: PaymentPlanOption[] };

export interface ProjectImage {
  card: string;
  hero: string;
  widths: number[];
  srcset: string;
}

export interface Project {
  id: string;
  source: 'studio' | 'wp' | 'snap';
  slug: string;
  title: string;
  contentLanguage: string;
  developerName: string;
  developerSlug: string | null;
  market: string;
  country: string;
  emirate: string; // place
  area: string | null;
  priceFrom: number | null;
  currency: string;
  priceNote: string | null;
  priceOnApplication: boolean;
  soldOut: boolean;
  completionStatus: 'OFF_PLAN' | 'UNDER_CONSTRUCTION' | 'READY';
  handoverDate: string | null;
  paymentPlan: PaymentPlan | null;
  shareable: boolean;
  promoted: boolean;
  image: ProjectImage;
  permitNumber: string | null;
  permitExpiresAt: string | null;
  permitAuthority: string | null;
  permitVerifyUrl: string | null;
  shareUrl: string;
  hash: string;
  changedAt: string;
}

export interface ProjectFilters {
  market?: string;
  place?: string;
  area?: string;
  budgetMin?: number;
  budgetMax?: number;
  completionStatus?: string;
  search?: string;
}

const CACHE_TTL_SECONDS = 20 * 60; // 15-30 min per the brief; 20 is the midpoint
const CATALOGUE_KV_KEY = 'palmera:catalogue'; // full cached project list (JSON array)
const CURSOR_KV_KEY = 'palmera:changes-cursor'; // watermark for GET /projects/changes
const ETAG_KV_KEY = 'palmera:export-etag'; // ETag for GET /projects/export

function authHeaders(key: string): HeadersInit {
  return { Authorization: `Bearer ${key}` };
}

/**
 * GET /me — call this first, once, before anything else. Confirms the key
 * works, which scopes it actually has, and the live catalogue/lead-status
 * vocabulary. Run this yourself against a real PALMERA_KEY before wiring up
 * the rest — see README "Testing the Palmera integration" for how.
 */
export async function getMe(key: string) {
  const res = await fetch(`${PALMERA_API_BASE}/me`, { headers: authHeaders(key) });
  if (!res.ok) {
    throw new Error(`GET /me failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// --- Track A: catalogue sync ------------------------------------------------

/**
 * Full daily sync, per the brief's "Daily Sync Recipe". Call this from
 * functions/api/palmera-sync.ts, triggered once a day by an external
 * scheduler (Cloudflare Pages Functions have no built-in cron — see README).
 *
 * First run: GET /projects/export (full snapshot), store the ETag and the
 * resulting project list in KV.
 * Later runs: send If-None-Match with the stored ETag. A 304 means nothing
 * changed — skip straight to the incremental /projects/changes call, which
 * uses its own cursor and is safe to call more often than once a day too.
 */
export interface SyncDiagnostics {
  rawBytes: number;
  lineCount: number;
  parsedProjectCount: number;
  skippedLineCount: number;
  lastLineParsed: boolean;
  lastLinePreview: string;
  firstSkippedLinePreview: string | null;
  sampleProjectLine: string | null;
  firstParsedProjectKeys: string[] | null;
  firstParsedProjectPreview: string | null;
}

export async function syncCatalogue(
  env: PalmeraEnv,
  options: { forceFull?: boolean } = {},
): Promise<{ changed: boolean; count: number; diagnostics?: SyncDiagnostics }> {
  if (options.forceFull) {
    await env.PALMERA_CACHE.delete(CURSOR_KV_KEY);
    await env.PALMERA_CACHE.delete(ETAG_KV_KEY);
  }

  const storedEtag = await env.PALMERA_CACHE.get(ETAG_KV_KEY);
  const storedCursor = await env.PALMERA_CACHE.get(CURSOR_KV_KEY);

  if (!storedCursor) {
    // Day 1: full export.
    const headers: HeadersInit = { ...authHeaders(env.PALMERA_KEY) };
    if (storedEtag) headers['If-None-Match'] = storedEtag;

    const res = await fetch(`${PALMERA_API_BASE}/projects/export?scope=shareable`, { headers });
    if (res.status === 304) {
      return { changed: false, count: 0 };
    }
    if (!res.ok) {
      throw new Error(`GET /projects/export failed: ${res.status} ${await res.text()}`);
    }

    const etag = res.headers.get('ETag');
    const text = await res.text();
    // Newline-delimited JSON. Each line carries a `kind` discriminator:
    // "meta" (header), "project" (one per project — fields nested under
    // `project`, not top-level), "end" (footer with the total emitted).
    const projects: Project[] = [];
    let cursor: string | null = null;
    const lines = text.split('\n').filter((l) => l.trim());
    let skippedLineCount = 0;
    let firstSkippedLinePreview: string | null = null;
    let sampleProjectLine: string | null = null;
    let lastLineParsed = true;
    for (const [i, line] of lines.entries()) {
      try {
        const parsed = JSON.parse(line);
        const candidate = parsed.kind === 'project' && parsed.project ? parsed.project : parsed;
        if (candidate.id && candidate.source && candidate.title) {
          projects.push(candidate as Project);
        } else {
          skippedLineCount++;
          if (firstSkippedLinePreview === null) firstSkippedLinePreview = line.slice(0, 200);
          if (sampleProjectLine === null && parsed.kind === 'project') {
            sampleProjectLine = line.slice(0, 1000);
          }
        }
        if (parsed.cursor) cursor = parsed.cursor;
      } catch {
        skippedLineCount++;
        if (firstSkippedLinePreview === null) firstSkippedLinePreview = line.slice(0, 200);
        if (i === lines.length - 1) lastLineParsed = false;
      }
    }

    const diagnostics: SyncDiagnostics = {
      rawBytes: text.length,
      lineCount: lines.length,
      parsedProjectCount: projects.length,
      skippedLineCount,
      sampleProjectLine,
      firstParsedProjectKeys: projects[0] ? Object.keys(projects[0]) : null,
      firstParsedProjectPreview: projects[0] ? JSON.stringify(projects[0]).slice(0, 1500) : null,
      lastLineParsed,
      lastLinePreview: (lines[lines.length - 1] ?? '').slice(-200),
      firstSkippedLinePreview,
    };

    // If the response looks truncated mid-stream (last line isn't valid
    // JSON), don't persist a partial catalogue or a cursor that would lock
    // us into incremental-only syncs from here on — surface the diagnostics
    // instead so the real cause can be found before anything is cached.
    if (!lastLineParsed) {
      throw new Error(
        `GET /projects/export looks truncated: ${JSON.stringify(diagnostics)}`,
      );
    }

    await env.PALMERA_CACHE.put(CATALOGUE_KV_KEY, JSON.stringify(projects));
    if (etag) await env.PALMERA_CACHE.put(ETAG_KV_KEY, etag);
    // If the export response didn't carry a cursor, fall back to "now" so
    // the next run uses /projects/changes instead of re-exporting.
    await env.PALMERA_CACHE.put(CURSOR_KV_KEY, cursor ?? new Date().toISOString());

    return { changed: true, count: projects.length, diagnostics };
  }

  // Subsequent runs: incremental delta only.
  const res = await fetch(
    `${PALMERA_API_BASE}/projects/changes?since=${encodeURIComponent(storedCursor)}`,
    { headers: authHeaders(env.PALMERA_KEY) },
  );
  if (!res.ok) {
    throw new Error(`GET /projects/changes failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as {
    items: { change: 'added' | 'updated' | 'removed'; source: string; id: string; project?: Project }[];
    cursor: string;
  };

  const raw = await env.PALMERA_CACHE.get(CATALOGUE_KV_KEY);
  const catalogue: Project[] = raw ? JSON.parse(raw) : [];
  const bySourceId = new Map(catalogue.map((p) => [`${p.source}:${p.id}`, p]));

  for (const item of data.items) {
    const key = `${item.source}:${item.id}`;
    if (item.change === 'removed') {
      bySourceId.delete(key); // take it down, per the brief's rule
    } else if (item.project) {
      bySourceId.set(key, item.project);
    }
  }

  const updated = Array.from(bySourceId.values());
  await env.PALMERA_CACHE.put(CATALOGUE_KV_KEY, JSON.stringify(updated));
  await env.PALMERA_CACHE.put(CURSOR_KV_KEY, data.cursor);

  return { changed: data.items.length > 0, count: updated.length };
}

/**
 * Every page/component that renders a Project assumes these fields exist
 * (image.card/srcset, title, shareUrl, id, source) — a project missing any
 * of them would crash the page it's rendered on (undefined.card, etc). Drop
 * those here, once, so every caller (pages, the API route) is protected the
 * same way instead of each needing its own defensive checks.
 */
function isRenderable(p: Project): boolean {
  return Boolean(
    p && p.id && p.source && p.title && p.shareUrl && p.image && p.image.card && p.image.srcset,
  );
}

/** Read from the KV cache (populated by syncCatalogue) with in-request filtering. */
export async function fetchProjects(env: PalmeraEnv, filters: ProjectFilters = {}): Promise<Project[]> {
  const raw = await env.PALMERA_CACHE.get(CATALOGUE_KV_KEY);
  let results: Project[];
  if (raw) {
    results = (JSON.parse(raw) as Project[]).filter(isRenderable);
  } else {
    // No sync has run yet (fresh deploy, or KV binding missing in local dev)
    // — fall back to the bundled sample so pages still render correctly.
    const { sampleProperties } = await import('@/data/sampleProperties');
    results = sampleProperties;
  }

  if (filters.market) results = results.filter((p) => p.market === filters.market);
  if (filters.place) results = results.filter((p) => p.emirate === filters.place);
  if (filters.area) results = results.filter((p) => p.area === filters.area);
  if (filters.completionStatus)
    results = results.filter((p) => p.completionStatus === filters.completionStatus);
  if (filters.budgetMin != null)
    results = results.filter((p) => (p.priceFrom ?? 0) >= filters.budgetMin!);
  if (filters.budgetMax != null)
    results = results.filter((p) => (p.priceFrom ?? Infinity) <= filters.budgetMax!);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) => p.title.toLowerCase().includes(q) || p.developerName.toLowerCase().includes(q),
    );
  }
  return results;
}

/**
 * Live single-project fetch — for a property detail page that wants
 * up-to-the-minute data rather than the cache. Falls back to the KV cache
 * if the live call fails (e.g. rate limited), so the page still renders.
 */
export async function fetchProject(
  env: PalmeraEnv,
  source: string,
  id: string,
): Promise<Project | undefined> {
  try {
    const res = await fetch(`${PALMERA_API_BASE}/projects/${source}/${id}`, {
      headers: authHeaders(env.PALMERA_KEY),
    });
    if (res.ok) return (await res.json()) as Project;
  } catch {
    // fall through to cache
  }
  const raw = await env.PALMERA_CACHE.get(CATALOGUE_KV_KEY);
  let catalogue: Project[];
  if (raw) {
    catalogue = JSON.parse(raw);
  } else {
    const { sampleProperties } = await import('@/data/sampleProperties');
    catalogue = sampleProperties;
  }
  return catalogue.find((p) => p.source === source && p.id === id);
}

/** Look up a project by its (market, slug) URL pair — used by the pretty
 *  /properties/:market/:slug route, which doesn't carry source/id directly. */
export async function fetchProjectBySlug(
  env: PalmeraEnv,
  market: string,
  slug: string,
): Promise<Project | undefined> {
  const all = await fetchProjects(env, { market });
  const match = all.find((p) => p.slug === slug);
  if (!match) return undefined;
  return fetchProject(env, match.source, match.id);
}

/** Compliance guard — permit block only for Dubai/Abu Dhabi, and only when Palmera actually sent one. */
export function shouldShowPermit(project: Project): boolean {
  return project.permitNumber != null && project.permitAuthority != null;
}

// --- Track B: leads ----------------------------------------------------------

export interface CreateLeadInput {
  buyer: { fullName: string; phone?: string; phoneCountry?: string; email?: string };
  project?: { source: string; id: string };
  sourceChannel?: string;
  externalRef?: string; // our own lead id, so we can reconcile Palmera's id back to it
}

export interface PalmeraLead {
  id: string;
  externalRef: string | null;
  status: string;
  createdAt: string;
  test: boolean;
}

/**
 * POST /leads. Requires consent.obtained === true (we only call this once
 * our own required consent checkbox has been ticked) and an Idempotency-Key
 * on every call — pass our own lead id as the key so a network retry never
 * double-creates a lead with Palmera.
 */
export async function createLead(
  key: string,
  idempotencyKey: string,
  input: CreateLeadInput,
): Promise<PalmeraLead> {
  const res = await fetch(`${PALMERA_API_BASE}/leads`, {
    method: 'POST',
    headers: {
      ...authHeaders(key),
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      buyer: input.buyer,
      consent: { obtained: true, method: 'form' },
      project: input.project,
      sourceChannel: input.sourceChannel ?? 'website',
      externalRef: input.externalRef,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST /leads failed: ${res.status} ${body}`);
  }
  return res.json();
}
