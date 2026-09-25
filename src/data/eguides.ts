// E-guides tab seed data. Amsi's own PAID guides go through Gumroad (overlay
// checkout). Amsi's own FREE guides are gated by an email-capture popup
// instead (see GuideCaptureModal.astro + src/pages/api/guide-request.ts) —
// no payment involved, so no Gumroad step: the visitor's name/phone/email is
// saved as a lead and the guide is emailed to them via a download link.
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
  gumroadUrl?: string; // e.g. https://amsi.gumroad.com/l/xxxxx — paid amsi guides only
  fileUrl?: string; // e.g. /guides/xxx.pdf — free amsi guides delivered via the capture popup
  externalUrl?: string; // partner e-books only
}

export const eguides: EGuide[] = [
  {
    slug: 'overseas-buyers-guide',
    title: "The Overseas Buyer's Guide",
    owner: 'amsi',
    type: 'free',
    topic: 'Buying',
    summary:
      'Buying property from abroad in the UK, US, UAE/Dubai, Spain or Portugal — who can buy, purchase taxes, buying without flying in (power of attorney, your team on the ground), financing and moving money, and the costs and checks to run before you sign.',
    fileUrl: '/guides/overseas-buyers-guide.pdf',
  },
  {
    slug: 'relocation-guide',
    title: 'The Relocation Guide',
    owner: 'amsi',
    type: 'free',
    topic: 'Relocation',
    summary:
      'Moving to the UAE, Saudi Arabia, Oman, Cyprus, Spain, Portugal, Georgia or Africa from the UK or US — visas, tax residency, renting vs. buying, cost of living, banking, healthcare, schools, and a move timeline.',
    fileUrl: '/guides/relocation-guide.pdf',
  },
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
