// Static market metadata used across Properties, Blog, Resources.
// Mirrors Palmera's partner-context markets (fetched live via get_partner_context)
// so filters, currency labels, and chip lists stay in sync with what Palmera
// can actually serve for this partner.

export type MarketSlug = 'uae' | 'cyprus' | 'oman' | 'saudi' | 'georgia';

export interface Market {
  slug: MarketSlug;
  name: string;
  country: string; // ISO 2-letter, matches Palmera's `country` field
  currency: 'AED' | 'EUR' | 'OMR' | 'SAR' | 'USD';
  places: { slug: string; name: string }[];
  blurb: string;
}

export const markets: Market[] = [
  {
    slug: 'uae',
    name: 'UAE',
    country: 'ae',
    currency: 'AED',
    blurb: 'Dubai, Ras Al Khaimah, Sharjah, Ajman and Umm Al Quwain off-plan projects.',
    places: [
      { slug: 'dubai', name: 'Dubai' },
      { slug: 'ras-al-khaimah', name: 'Ras Al Khaimah' },
      { slug: 'sharjah', name: 'Sharjah' },
      { slug: 'ajman', name: 'Ajman' },
      { slug: 'umm-al-quwain', name: 'Umm Al Quwain' },
    ],
  },
  {
    slug: 'cyprus',
    name: 'Cyprus',
    country: 'cy',
    currency: 'EUR',
    blurb: 'Paphos, Limassol, Larnaca and Nicosia developments, EU residency appeal.',
    places: [
      { slug: 'paphos', name: 'Paphos' },
      { slug: 'limassol', name: 'Limassol' },
      { slug: 'larnaca', name: 'Larnaca' },
      { slug: 'nicosia', name: 'Nicosia' },
    ],
  },
  {
    slug: 'oman',
    name: 'Oman',
    country: 'om',
    currency: 'OMR',
    blurb: 'Muscat and Dhofar coastal and city projects.',
    places: [
      { slug: 'muscat', name: 'Muscat' },
      { slug: 'dhofar', name: 'Dhofar' },
    ],
  },
  {
    slug: 'saudi',
    name: 'Saudi Arabia',
    country: 'sa',
    currency: 'SAR',
    blurb: 'Riyadh and Jeddah residential communities.',
    places: [
      { slug: 'riyadh', name: 'Riyadh' },
      { slug: 'jeddah', name: 'Jeddah' },
    ],
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    country: 'ge',
    currency: 'USD',
    blurb: 'Batumi and Tbilisi apartments, priced in USD.',
    places: [
      { slug: 'batumi', name: 'Batumi' },
      { slug: 'tbilisi', name: 'Tbilisi' },
    ],
  },
];

export function getMarket(slug: string): Market | undefined {
  return markets.find((m) => m.slug === slug);
}
