// GET /api/properties?market=uae&place=dubai&...
// Backs the client-side market-tab/filter refresh on /properties (see the
// script at the bottom of src/pages/properties/index.astro). Returns
// pre-rendered card HTML rather than raw JSON so the client can just swap
// innerHTML — keeps the filtering logic and the card markup in one place
// (server-side) instead of duplicating PropertyCard's design in JS.
import type { APIRoute } from 'astro';
import { fetchProjects, shouldShowPermit, type Project } from '@/lib/palmera';
import { formatPrice } from '@/lib/currency';

export const prerender = false;

const STATUS_LABEL: Record<string, string> = {
  OFF_PLAN: 'Off-plan',
  UNDER_CONSTRUCTION: 'Under construction',
  READY: 'Ready',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function cardHtml(p: Project): string {
  const price = p.priceOnApplication ? 'Price on application' : formatPrice(p.priceFrom, p.currency);
  const place = (p.emirate ?? '').replace(/-/g, ' ');
  const area = p.area ? `, ${p.area.replace(/-/g, ' ')}` : '';
  const permit = shouldShowPermit(p) ? `<p class="text-xs text-ink-500">DLD permit ${escapeHtml(p.permitNumber!)}</p>` : '';
  const handover = p.handoverDate ? `<span class="text-xs text-ink-500">Handover ${escapeHtml(p.handoverDate)}</span>` : '';

  return `
  <div class="property-item">
    <article class="group flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white transition hover:shadow-lg">
      <div class="relative aspect-[4/3] overflow-hidden bg-sand-100">
        <img src="${p.image.card}" srcset="${p.image.srcset}" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" alt="${escapeHtml(p.title)}" loading="lazy" class="h-full w-full object-cover transition group-hover:scale-105" />
        <span class="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-ink-900 shadow-sm">${STATUS_LABEL[p.completionStatus] ?? p.completionStatus}</span>
      </div>
      <div class="flex flex-1 flex-col gap-2 p-4">
        <h3 class="font-serif text-lg font-semibold text-ink-900">${escapeHtml(p.title)}</h3>
        <p class="text-sm text-ink-500">${escapeHtml(p.developerName)}</p>
        <p class="text-sm text-ink-500 capitalize">${escapeHtml(place)}${escapeHtml(area)}</p>
        <div class="mt-1 flex items-baseline justify-between">
          <span class="text-lg font-semibold text-ink-900">${price}</span>
          ${handover}
        </div>
        ${permit}
        <div class="mt-3 flex flex-col gap-2 sm:flex-row">
          <a href="${p.shareUrl}" target="_blank" rel="noopener sponsored" class="btn-primary flex-1 text-center">View project</a>
          <a href="#enquiry" class="btn-secondary flex-1 text-center" data-enquiry-project-title="${escapeHtml(p.title)}" data-enquiry-project-source="${p.source}" data-enquiry-project-id="${p.id}">Ask Amsi about this</a>
        </div>
      </div>
    </article>
  </div>`;
}

export const GET: APIRoute = async ({ url, locals }) => {
  const env = locals.runtime.env;
  const params = url.searchParams;

  const properties = await fetchProjects(env, {
    market: params.get('market') ?? undefined,
    place: params.get('place') ?? undefined,
    area: params.get('area') ?? undefined,
    budgetMin: params.get('budgetMin') ? Number(params.get('budgetMin')) : undefined,
    budgetMax: params.get('budgetMax') ? Number(params.get('budgetMax')) : undefined,
    completionStatus: params.get('completionStatus') ?? undefined,
    search: params.get('search') ?? undefined,
  });

  const html = properties.map(cardHtml).join('\n');

  return new Response(JSON.stringify({ html, count: properties.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
