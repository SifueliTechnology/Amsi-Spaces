// E-guides tab seed data. Amsi's own guides (free or paid) go through
// Gumroad (overlay checkout, gumroadProductId wired up once products exist).
// Partner guides link out and are always labelled "Sponsored".

export interface EGuide {
  slug: string;
  title: string;
  owner: 'amsi' | 'partner';
  type: 'free' | 'paid';
  price?: number;
  currency?: string;
  market?: string;
  topic: string;
  summary: string;
  gumroadUrl?: string; // e.g. https://amsi.gumroad.com/l/xxxxx — set once product is live
  externalUrl?: string; // partner e-books only
}

export const eguides: EGuide[] = [
  {
    slug: 'buying-off-plan-uae-2026',
    title: 'Buying Off-Plan in the UAE: A First-Timer\'s Checklist',
    owner: 'amsi',
    type: 'free',
    market: 'uae',
    topic: 'Buying',
    summary:
      'What a DLD permit number actually verifies, how payment plans are structured, and the questions to ask before you reserve a unit.',
    gumroadUrl: 'https://amsi.gumroad.com/l/PLACEHOLDER-free-uae-checklist',
  },
  {
    slug: 'cyprus-eu-residency-property',
    title: 'Cyprus Property & EU Residency: What Actually Qualifies',
    owner: 'amsi',
    type: 'paid',
    price: 19,
    currency: 'USD',
    market: 'cyprus',
    topic: 'Investing',
    summary:
      'A plain-language walkthrough of the residency-by-investment route, with the property thresholds and paperwork timeline.',
    gumroadUrl: 'https://amsi.gumroad.com/l/PLACEHOLDER-cyprus-residency',
  },
  {
    slug: 'financing-offplan-abroad',
    title: 'Financing an Off-Plan Purchase From Abroad',
    owner: 'amsi',
    type: 'free',
    topic: 'Financing',
    summary:
      'How payment-plan-only purchases differ from mortgage financing, and what to have ready before you talk to a lender.',
    gumroadUrl: 'https://amsi.gumroad.com/l/PLACEHOLDER-financing-abroad',
  },
  {
    slug: 'georgia-batumi-buyer-guide',
    title: 'The Batumi Buyer\'s Guide',
    owner: 'partner',
    type: 'free',
    market: 'georgia',
    topic: 'Buying',
    summary: 'A partner-produced guide to Batumi\'s fastest-growing districts.',
    externalUrl: 'https://example-partner-guides.com/batumi-buyer-guide',
  },
];
