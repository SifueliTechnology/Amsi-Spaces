// GET /sitemap.xml
// Static pages + blog posts are known at build time; property detail pages
// aren't (they come from Palmera's catalogue, synced into KV — see
// src/lib/palmera.ts), so this reads the same KV cache the /properties
// pages do rather than shipping a static sitemap that goes stale.
import type { APIRoute } from 'astro';
import { markets } from '@/data/markets';
import { blogPosts } from '@/data/blogPosts';
import { fetchProjects } from '@/lib/palmera';

export const prerender = false;

const SITE = 'https://amsispaces.com';

function url(loc: string, changefreq: string, priority: string): string {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env;

  const entries: string[] = [
    url('/', 'weekly', '1.0'),
    url('/properties', 'daily', '0.9'),
    url('/resources', 'weekly', '0.7'),
    url('/blog', 'weekly', '0.7'),
    url('/advertise', 'monthly', '0.4'),
    url('/disclosure', 'yearly', '0.3'),
    url('/privacy', 'yearly', '0.3'),
    url('/terms', 'yearly', '0.3'),
  ];

  for (const post of blogPosts) {
    entries.push(url(`/blog/${post.slug}`, 'monthly', '0.6'));
  }

  // Best-effort — a KV/Palmera hiccup here shouldn't break the whole sitemap,
  // just omit that market's property pages until the next crawl.
  for (const market of markets) {
    try {
      const properties = await fetchProjects(env, { market: market.slug });
      for (const property of properties) {
        entries.push(url(`/properties/${market.slug}/${property.slug}`, 'weekly', '0.8'));
      }
    } catch {
      // skip this market
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
