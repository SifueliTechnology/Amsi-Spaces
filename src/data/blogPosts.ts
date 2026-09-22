export interface BlogPost {
  slug: string;
  title: string;
  market: string; // market slug or 'global'
  category: 'Buying' | 'Renting' | 'Investing' | 'Financing' | 'Tools';
  excerpt: string;
  publishedAt: string;
  stat?: { label: string; value: string };
  promotes?: { kind: 'property' | 'sponsored'; label: string; href: string };
  body: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'dubai-off-plan-payment-plans-explained',
    title: 'Dubai Off-Plan Payment Plans, Explained Without the Jargon',
    market: 'uae',
    category: 'Buying',
    excerpt:
      'Post-handover, 60/40, construction-linked — what these payment plan shapes actually mean for your cash flow.',
    publishedAt: '2026-08-14',
    stat: { label: 'Typical Dubai down payment', value: '10-20% on booking' },
    promotes: {
      kind: 'property',
      label: 'Browse UAE off-plan projects',
      href: '/properties?market=uae',
    },
    body: 'Full article body goes here — replace with the finished editorial content.',
  },
  {
    slug: 'cyprus-permanent-residency-property-route',
    title: 'Cyprus Permanent Residency Through Property: The 2026 Route',
    market: 'cyprus',
    category: 'Investing',
    excerpt:
      'What the current permanent residency route requires, and how it interacts with off-plan purchase timing.',
    publishedAt: '2026-07-30',
    promotes: {
      kind: 'property',
      label: 'Browse Cyprus projects',
      href: '/properties?market=cyprus',
    },
    body: 'Full article body goes here — replace with the finished editorial content.',
  },
  {
    slug: 'how-to-vet-a-financing-partner',
    title: 'How to Vet a Financing Partner Before You Sign Anything',
    market: 'global',
    category: 'Financing',
    excerpt: 'Questions worth asking before you commit to any lender or broker introduction.',
    publishedAt: '2026-06-02',
    promotes: {
      kind: 'sponsored',
      label: 'See financing options',
      href: '/resources?tab=financing',
    },
    body: 'Full article body goes here — replace with the finished editorial content.',
  },
];
