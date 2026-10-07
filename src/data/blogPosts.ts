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
  /** Optional pre-rendered HTML body (headings, lists, paragraphs) for
   * fully structured long-form posts. When present, [slug].astro renders
   * this instead of wrapping `body` in a single <p>. `body` is still used
   * as a plain-text fallback/excerpt source, so always keep it populated. */
  bodyHtml?: string;
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
  {
    slug: 'dubai-off-plan-regional-tensions-risk-assessment',
    title: 'Is Your Dubai Off-Plan Investment Safe During Regional Tensions? A Realistic Risk Assessment',
    market: 'uae',
    category: 'Investing',
    excerpt:
      "Dubai's off-plan market has slowed since regional tensions began in 2026. Here's what the transaction data actually shows, what legal protections buyers have, and how past shocks played out.",
    publishedAt: '2026-10-09',
    stat: { label: 'Dubai Q3 2026 sales value vs. Q3 2025', value: '-47% (Cavendish Maxwell)' },
    promotes: {
      kind: 'property',
      label: 'Browse UAE off-plan projects',
      href: '/properties?market=uae',
    },
    body:
      "Dubai's off-plan market has cooled noticeably since regional tensions began in early 2026 — this piece looks at what the data actually shows, what legal protections off-plan buyers already have, and how the market behaved after past shocks.",
    bodyHtml: `
<p>If you're holding — or thinking about buying — an off-plan unit in Dubai right now, you've probably seen the headlines. Regional tensions, a damaged airport, tankers queued off Oman. It's reasonable to ask: is my money still safe? Here's a sourced, non-alarmist look at what's actually happening, what your contract protects you from, and how Dubai's market has handled shocks like this before.</p>

<h2>What's Actually Happening Right Now</h2>
<p>Regional tensions that began in February 2026 have affected UAE infrastructure and sentiment at points through the year, including disruption at Dubai International Airport and rerouted shipping through the Strait of Hormuz, which maritime trackers rated "Restricted" as of October 6, 2026, with oil and product flow running at roughly 75-80% of pre-conflict levels (Gulf News, October 6, 2026). As of October 7, 2026, Gulf News reported no direct security alerts or evacuations active within UAE borders, with Dubai, Al Maktoum and Abu Dhabi airports operating at near-normal levels and local financial markets (DFM and ADX) stable.</p>

<h2>How Much Has the Market Really Slowed?</h2>
<p>The honest answer is: meaningfully, but not in a straight line. Cavendish Maxwell data reported by The National (October 7, 2026) shows Dubai Q3 2026 home sales fell 47% year-on-year in value (to AED 72.6 billion) and 38% in volume (34,000 transactions). Off-plan still made up 65% of sales value and 72% of transactions in the quarter — it hasn't disappeared, it's just moving more slowly. S&P Global Ratings, cited in the same report, found prices down 5-15% between end-2025 and September 2026, and expects "a gradual price correction rather than a rapid price decline."</p>
<p>Not every segment moved the same way. fäm Properties found that of 717 off-plan projects launched since July 2023, only 44 (about 6%) had cut list prices by 5% or more since the conflict began, and just 28 projects were selling below their original launch price (Khaleej Times, September 30, 2026) — most of the adjustment has shown up in sales pace and buyer caution, not headline price cuts. Cavendish Maxwell's Ali Siddiqui put it simply: "Purchasing activity became more measured, with buyers being more cautious in the weeks and months following the start of the conflict" (The National, October 7, 2026).</p>

<h2>What Happens to Your Contract If Things Get Worse</h2>
<p>This is the part most coverage skips, and it's the part that actually matters if you own a unit. Dubai's off-plan system is built around mandatory escrow: every buyer payment must go into a RERA-approved, project-specific escrow account at a DLD-approved trustee bank, and developers can only draw funds against independently verified construction milestones (Law No. 8 of 2007, as amended; source: kayrouzandassociates.com, March 2026). Those funds stay protected from a developer's creditors even if the developer runs into financial trouble.</p>
<p>If a developer tries to claim force majeure to excuse a delay, the bar is genuinely high — the disrupting event has to be unforeseeable, unavoidable, and make performance genuinely impossible, not just more expensive or inconvenient, and DLD assesses each claim individually (Chambers, legal practice guide, 2024-2026 update). Most sale and purchase agreements also build in a grace period of 6-12 months beyond the scheduled completion date before a buyer can act, and if a delay runs more than 6 months past that date, buyers may be entitled to compensation of 1% of the property's value per quarter under Executive Council Resolution No. 6 of 2010. If RERA formally cancels a project outright, Law No. 19 of 2020 requires a full refund from escrow.</p>

<h2>How Dubai's Market Has Handled Shocks Before</h2>
<p>Dubai real estate has been through genuine shocks twice in the last two decades, and both are informative. The 2008 financial crisis hit hardest: prices fell an estimated 40-60% and recovery took roughly 5-7 years — but it's also the crisis that produced the regulatory system protecting buyers today, including mandatory escrow and mortgage caps. COVID-19 was a sharper but shorter shock: prices and rents dipped an estimated 10-20%, but by November 2020 the market had already set a seven-year transaction record, and prices surpassed pre-pandemic peaks by 2022.</p>
<p>That history doesn't guarantee anything about how the current situation resolves — regional conflict is a different kind of risk than a credit crisis or a pandemic, and it's genuinely too early to call whether sentiment has structurally shifted or is simply pausing. What it does show is that Dubai's property market has absorbed serious disruption before without the underlying legal protections for buyers breaking down.</p>

<h2>A Realistic Read, Not a Panic Read</h2>
<p>If you already own an off-plan unit: your payments are in escrow, your developer still has to hit verified milestones to draw funds, and you have contractual recourse if delays run long. If you're considering buying now: Samana Developers' Imran Farooq noted at the International Property Show that today's market is "dominated largely by end users" rather than speculators, and a 10-15% price correction is arguably "healthy" rather than alarming (AGBI, September 2026). Either way, the move is the same one it always is before signing anything: verify the specific project's escrow account, its construction progress against the payment schedule, and the developer's track record — not the headlines.</p>
`,
  },
  {
    slug: 'dubai-relocation-without-package-real-cost-of-living',
    title: "Moving to Dubai Without a Relocation Package: What Salary Actually Covers the Real Cost of Living",
    market: 'uae',
    category: 'Renting',
    excerpt:
      "Weighing a Dubai offer with no relocation package? Here's what rent, the multi-cheque system, utilities, visas and schooling actually cost in 2026 — and what salary range makes it realistically workable.",
    publishedAt: '2026-10-13',
    stat: { label: 'Comfortable single-professional budget (2026)', value: 'AED 12,000-22,000/month' },
    promotes: {
      kind: 'sponsored',
      label: 'See financing options',
      href: '/resources?tab=financing',
    },
    body:
      "A realistic breakdown of what moving to Dubai without an employer relocation package actually costs in 2026 — rent, multi-cheque payments, utilities, visa costs, and what salary range makes it workable.",
    bodyHtml: `
<p>A lot of Dubai relocation advice assumes someone else is paying for the move. If your offer doesn't include a relocation package, the number on your contract can be misleading — what breaks the budget isn't the headline salary, it's the costs nobody mentions until you're already there. Here's what actually shows up on the bill in 2026.</p>

<h2>Rent: The Multi-Cheque Trap</h2>
<p>Dubai rent is still typically paid in 1-4 cheques a year rather than monthly, and paying in a single annual cheque usually earns a 3-5% discount versus splitting it into 4 or 12 payments (Takween Advisory, September 4, 2026). That means you often need several months' rent in cash upfront, on top of a security deposit (5% of annual rent, or 10% if the unit is furnished) and an agency commission of roughly 5% of annual rent (uaewise.com, March 2026). Some developer-owned buildings now offer true monthly payment with no premium, but it's still the exception rather than the norm (Labeeb.ae, February 2026).</p>
<p>Annual rent ranges vary a lot by area. Bayut and dubizzle's 2026 market reports put a 1-bedroom around AED 77,000-79,000 in JVC, AED 104,000 in Business Bay, AED 65,000-66,000 in Deira, and AED 97,000-103,000 in Dubai Marina. Citywide, Takween Advisory's Ejari-registered median for a 1-bedroom was roughly AED 68,000 as of September 2026 — a more realistic benchmark than asking prices, since it reflects what people actually signed for.</p>

<h2>Utilities and the Cooling Bill Nobody Warns You About</h2>
<p>DEWA bills a progressive tariff starting at AED 0.23/kWh and rising to AED 0.38/kWh above 6,000 kWh, plus a 5% housing fee charged monthly based on your annual rent (Takween Advisory, September 2026). A typical 1-bedroom DEWA bill runs AED 400-700 a month in summer versus AED 200-400 in winter — before district cooling. If your building uses district cooling (common in newer towers, billed separately by providers like Empower or Tabreed), expect AED 500-1,500 a month depending on unit size and season, often with a fixed demand charge that applies even when the apartment is empty.</p>

<h2>Visa Costs: What Your Employer Must Legally Cover</h2>
<p>This is worth knowing before you negotiate: under Federal Decree-Law No. 33 of 2021, your employer is legally required to cover 100% of standard employment visa costs — work permit, entry permit, medical test, Emirates ID, insurance, stamping — and cannot deduct them from your salary (egsh.ae, September 2026). Total employer-side cost typically runs AED 3,000-9,000+ depending on the company's MOHRE classification. If you're asked to personally front these costs, that's worth raising directly; as one UAE immigration guide puts it, "UAE law is unambiguous: the employer bears all recruitment and visa-related costs" (immigrationstartguide.com, December 2025). Where costs do commonly fall on you regardless: dependents' visas for a spouse or children typically aren't covered even when your own work visa is.</p>

<h2>If You're Also Weighing Schooling</h2>
<p>For a family relocating with school-age children, Dubai's Knight Frank regulator KHDA froze private-school tuition increases for the 2026-27 academic year (announced May 22, 2026). Even so, fee bands run wide: budget and Indian-curriculum schools AED 12,000-35,000 a year, mid-market British/American curricula AED 35,000-65,000, and premium British or IB schools AED 70,000-130,000+. On top of tuition, budget for registration fees, a seat deposit, and a one-off capital or building fund — a reasonable rule of thumb from school-placement guides is to add 25-35% to the published tuition figure for the realistic all-in annual cost.</p>

<h2>What "Comfortable" Actually Means by Salary</h2>
<p>Putting the pieces together, cost-of-living guides converge on a few bands for 2026. A single professional on a genuinely tight budget can get by on roughly AED 7,000-10,000 a month, but most sources place a realistically comfortable single-professional budget — covering a 1-bedroom in a mid-tier area like JVC or Business Bay — at AED 12,000-22,000 a month, most commonly cited around AED 15,000-20,000. For a family with school-age children, ongoing costs commonly run AED 25,000-40,000 a month once schooling is factored in, and relocation guides suggest having AED 60,000-100,000+ in one-time setup cash on hand before you move, covering security deposits, agency fees, and school seat deposits that a relocation package would otherwise absorb. One Dubai expat guide summed up the real failure point plainly: "What breaks the model: multiple rent cheques, summer DEWA/district cooling, agency fees and one child in a premium school" (dubaiexpathub.com, September 2026).</p>

<h2>Before You Accept the Offer</h2>
<p>If you're weighing a Dubai offer with no relocation package, run your own numbers against the ranges above rather than the headline salary figure alone — and be specific with your employer about what they're legally required to cover versus what you'd be fronting yourself. [CTA: link to enquiry footer]</p>
`,
  },
];
