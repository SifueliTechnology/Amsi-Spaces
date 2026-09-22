import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Amsi Spaces — deployed to Cloudflare Pages via the official Cloudflare
// adapter. output: 'server' because Properties (live Palmera catalogue) and
// the API routes (lead capture, Palmera webhook, daily sync) all need
// per-request access to Cloudflare bindings (D1, KV, secrets) — that's only
// available at request time, not at `astro build` time. Pages that don't
// need live data (legal pages, blog, resources' static tabs) opt back into
// static prerendering individually with `export const prerender = true`.
export default defineConfig({
  site: 'https://amsispaces.com',
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [tailwind()],
});
