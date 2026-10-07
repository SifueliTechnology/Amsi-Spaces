# Amsi Spaces blog topic queue

Shared topic queue for the Amsi Spaces blog-drafting automation. Topics are
ranked roughly by viral/share potential (most to least), pulled from two
sources: Reddit research (via the monthly Reddit-research scheduled task,
using the `trudax/reddit-scraper-lite` Apify actor) and earlier Perplexity
trend research (US/Dubai market data, dated 2026-09-21 — figures should be
re-verified as current before drafting, since market data moves weekly).

Each topic is marked `status: queued` until a blog-drafting run uses it,
then `status: used` with the date and the post slug/filename it produced.
Do not remove, reorder, or alter used topics — only append new research
and flip status on topics as they're consumed.

## 2026-10 research (seeded manually from Reddit test runs + prior Perplexity research)

1. **Is Your Dubai Off-Plan Investment Safe During Regional Tensions? A Realistic Risk Assessment**
   segment: diaspora investors | market: UAE | source: Reddit (r/dubairealestate — "Dubai investor here — off-plan unit handover in 2027 and honestly feeling panic after recent situation", https://www.reddit.com/r/dubairealestate/comments/1rinuni/dubai_investor_here_offplan_unit_handover_in_2027/)
   note: sensitive topic (geopolitical) — write carefully, measured, sourced, no alarmism
   status: used (2026-10-07, slug: dubai-off-plan-regional-tensions-risk-assessment, PR pending review)

2. **Moving to Dubai Without a Relocation Package: What Salary Actually Covers the Real Cost of Living**
   segment: relocators | market: UAE | source: Reddit (r/DubaiCentral / r/DubaiJobs — "26F, Got an offer of 15,000 AED to relocate from India to Dubai", https://www.reddit.com/r/DubaiCentral/comments/1o45v7k/26f_got_an_offer_of_15000_aed_to_relocate_from/ ; "Move to Dubai as expat without relocation package?", https://www.reddit.com/r/DubaiJobs/comments/1ks086x/move_to_dubai_as_expat_without_relocation_package/)
   status: used (2026-10-07, slug: dubai-relocation-without-package-real-cost-of-living, PR pending review)

3. **Moving to Cyprus: The Honest Pros, Cons, and Regrets Expats Don't Post About on Vacation**
   segment: relocators | market: Cyprus | source: Reddit (r/cyprus — "Tell me the reasons not to move to Cyprus", https://www.reddit.com/r/cyprus/comments/1kbgkwx/tell_me_the_reasons_not_to_move_to_cyprus/ ; "Do you have any regrets moving to Cyprus as an expat?", https://www.reddit.com/r/cyprus/comments/1f3xmqi/do_you_have_any_regrets_moving_to_cyprus_as_an/)
   status: queued

4. **Dubai Home Prices Dipped for the First Time Since 2021. What It Means for You**
   segment: diaspora investors | market: UAE | source: Perplexity trend research, 2026-09-21 — re-verify current price/transaction figures before drafting (Cavendish Maxwell / ValuStrat data ages quickly)
   status: queued

5. **Off-Plan vs. Ready Property in Dubai: What the 2026 Slowdown Actually Means for Buyers**
   segment: diaspora investors | market: UAE | source: Reddit (r/dubairealestate — "Dubai Property Sales Down 41% Since January - Here's What the DLD Data Actually Shows", https://www.reddit.com/r/dubairealestate/comments/1tynwkw/dubai_property_sales_down_41_since_january_heres/)
   status: queued

6. **North Cyprus Property Rules Are Changing: What Foreign Buyers Need to Know Before They Invest**
   segment: diaspora investors | market: North Cyprus | source: Reddit (r/TRNCnews — "New Property Rules in Northern Cyprus Threaten Real Estate Market and Economy", https://www.reddit.com/r/TRNCnews/comments/1g2m6e5/new_property_rules_in_northern_cyprus_threaten/ ; r/cyprus — "Buying property in North Cyprus", https://www.reddit.com/r/cyprus/comments/5tyxm4/buying_property_in_north_cyprus/)
   note: Amsi Spaces has no confirmed North Cyprus partner yet — write generically, no partner/listing claims
   status: queued

7. **Setting Up as Self-Employed in Cyprus: Real Government Costs vs. What Relocation Agencies Charge**
   segment: relocators | market: Cyprus | source: Reddit (r/cyprus — "Moving to Cyprus as an EU couple. What did you pay for, and what did you do yourself?", https://www.reddit.com/r/cyprus/comments/1wz47bh/moving_to_cyprus_as_an_eu_couple_what_did_you_pay/)
   status: queued

8. **Mortgage Rates Just Hit 6.95%. Here's How to Shop Smarter**
   segment: diaspora investors | market: USA (general cross-border context) | source: Perplexity trend research, 2026-09-21 — re-verify current Freddie Mac/Bankrate rate figures before drafting
   status: queued

9. **Georgia's 1% Tax Regime for Digital Nomads Explained: Individual Entrepreneur Status in 2026**
   segment: digital nomads | market: Georgia | source: Reddit (r/Sakartvelo — "Moving to Georgia as a digital nomad is still possible?", https://www.reddit.com/r/Sakartvelo/comments/1s3eojn/moving_to_georgia_as_a_digital_nomad_is_still/ ; "Becoming a digital nomad in Georgia", https://www.reddit.com/r/Sakartvelo/comments/if7mpc/becoming_a_digital_nomad_in_georgia/)
   status: queued

10. **Dubai Off-Plan Property: Why Your Exit Strategy Matters More Than the Entry Price**
    segment: diaspora investors | market: UAE | source: Reddit (r/dubairealestate — "I've worked in Dubai real estate for years, here's what most people get wrong when buying property here", https://www.reddit.com/r/dubairealestate/comments/1kkkb0w/ive_worked_in_dubai_real_estate_for_years_heres/)
    status: queued

11. **Buyers Have Leverage Again: How to Negotiate as Inventory Hits a 10-Year High**
    segment: diaspora investors | market: USA | source: Perplexity trend research, 2026-09-21 — re-verify current inventory figures before drafting
    status: queued

12. **Is Zanzibar's Internet Good Enough for Remote Work in 2026? What Digital Nomads Say**
    segment: digital nomads | market: Zanzibar | source: Reddit (r/digitalnomad — "Digital Nomad hub in East Africa?", https://www.reddit.com/r/digitalnomad/comments/pb7lcv/digital_nomad_hub_in_east_africa/)
    note: Amsi Spaces has no confirmed Zanzibar partner yet — "coming soon" framing only, no partner/listing claims
    status: queued

13. **Rents Are Soft and Concessions Are Everywhere: How Renters and Landlords Should Play It**
    segment: relocators | market: USA | source: Perplexity trend research, 2026-09-21 — re-verify current rental-market figures before drafting
    status: queued

14. **Dubai Rents Are Cooling in Some Areas but Not Others: A Guide for Tenants and Landlords**
    segment: relocators | market: UAE | source: Perplexity trend research, 2026-09-21 — re-verify current rent figures before drafting
    status: queued

15. **Can Foreigners Buy Land in Georgia? Rules, Restrictions, and What's Actually Allowed**
    segment: diaspora investors | market: Georgia | source: Reddit (r/u_redlandpropertygroup — "Where to Buy Georgia Land Investment Properties?", https://www.reddit.com/r/u_redlandpropertygroup/comments/u8k3vd/where_to_buy_georgia_land_investment_properties/)
    status: queued

16. **Best Neighborhoods Near Business Bay for Expats Relocating to Dubai (and How Rent Cheques Work)**
    segment: relocators | market: UAE | source: Reddit (r/DubaiCentral — "Relocating soon to Dubai - tips and tricks appreciated", https://www.reddit.com/r/DubaiCentral/comments/1qtshar/relocating_soon_to_dubai_tips_and_tricks/)
    status: queued

17. **Buying Off-Plan in Dubai in 2026: How Escrow Works and Seven Checks Before You Sign**
    segment: diaspora investors | market: UAE | source: Perplexity trend research, 2026-09-21 — evergreen reference content, low viral but strong long-term SEO value
    status: queued
