/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

// Cloudflare bindings + secrets available at request time via
// Astro.locals.runtime.env (the @astrojs/cloudflare adapter populates this).
// Keep this in sync with wrangler.toml's [[d1_databases]] / [[kv_namespaces]]
// / [vars] and whatever's set with `wrangler pages secret put`.
type CloudflareEnv = {
  DB: D1Database;
  PALMERA_CACHE: KVNamespace;
  PALMERA_KEY: string;
  PALMERA_WEBHOOK_SECRET: string;
  PALMERA_SYNC_SECRET: string;
  TURNSTILE_SECRET_KEY: string;
  ALERT_EMAIL_API_KEY: string;
  ALERT_EMAIL_TO: string;
  ALERT_EMAIL_FROM: string;
  N8N_LEAD_WEBHOOK_URL?: string;
};

declare namespace App {
  interface Locals extends Runtime {}
}

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>;
