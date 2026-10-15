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
   status: queued

2. **Moving to Dubai Without a Relocation Package: What Salary Actually Covers the Real Cost of Living**
   segment: relocators | market: UAE | source: Reddit (r/DubaiCentral / r/DubaiJobs — "26F, Got an offer of 15,000 AED to relocate from India to Dubai", https://www.reddit.com/r/DubaiCentral/comments/1o45v7k/26f_got_an_offer_of_15000_aed_to_relocate_from/ ; "Move to Dubai as expat without relocation package?", https://www.reddit.com/r/DubaiJobs/comments/1ks086x/move_to_dubai_as_expat_without_relocation_package/)
   status: queued

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

## 2026-10-15 research

18. **Oman's New Residency-by-Property Rules Explained: Sultan Haitham City and the Sponsor-Free Owner Visa**
    segment: diaspora investors | market: Oman | source: Reddit (r/Dubai_Real_Estate / r/propertyinvesting — "Thinking about investing in the Middle East? Consider Oman.", https://www.reddit.com/r/Dubai_Real_Estate/comments/1unedpy/thinking_about_investing_in_the_middle_east/ ; https://www.reddit.com/r/propertyinvesting/comments/1ul9tau/thinking_about_investing_in_the_middle_east/) + Perplexity (OPAZ Regulation No. 81/2026, effective 20 Sep 2026; Royal Oman Police Decision 87/2026, effective 22 Jun 2026; Sultan Haitham City residency-on-purchase model; NCSI Q2 2026 data via enterpriseam.com, 2026-09-30)
    status: queued

19. **Should You Register a Business as an Expat in Oman? What Reddit's Asking vs. the Actual Rules**
    segment: relocators | market: Oman | source: Reddit (r/UAE / r/dubai — "How to register a business as an expat living in oman?", https://www.reddit.com/r/UAE/comments/1sxwt71/how_to_register_a_business_as_an_expat_living_in/ ; https://www.reddit.com/r/dubai/comments/1sxwtl1/how_to_register_a_business_as_an_expat_living_in/)
    status: queued

20. **Saudi Arabia's Foreign Property Ownership Law Is Live: What Actually Changed in 2026 and Where You Can Buy**
    segment: diaspora investors | market: Saudi Arabia | source: Reddit (r/indianrealestate — "Saudi Arabia Opens Property Market: Here's How people Can Buy Real Estate", https://www.reddit.com/r/indianrealestate/comments/1uf7kau/saudi_arabia_opens_property_market_heres_how/) + Perplexity (Law of Real Estate Ownership by Non-Saudis effective 22 Jan 2026; implementing regulations/geographic zones approved 23 Jun 2026; Saudi Properties portal; 2% transaction fee in Riyadh/Jeddah/Makkah/Madinah — JLL update, 2026-10-13/14)
    status: queued

21. **Riyadh's Rent Freeze Explained: What a 5-Year Cap Means for Expats Weighing a Move**
    segment: relocators | market: Saudi Arabia | source: Reddit (r/RiyadhExpats / r/KingdomofSaudiArabia / r/Riyadh — "Moving to Riyadh for Work Soon – Cost of Living, Salary Expectations...", https://www.reddit.com/r/RiyadhExpats/comments/1uds7bh/moving_to_riyadh_for_work_soon_cost_of_living/) + Perplexity (Riyadh residential rent growth slowed to 4.5% in Aug 2026; 5-year rent-increase freeze in force since 7 Nov 2025 — Asharq Al-Awsat via ua.news, 2026-10-08)
    status: queued

22. **Is Saudi's Premium Residency About to Get Easier? The Reported Expansion to Property Buyers and Investors**
    segment: diaspora investors | market: Saudi Arabia | source: Perplexity (Economic Times report, 2026-10-09 — proposal under deliberation, not yet finalized, to extend Premium Residency to property buyers in major developments such as Diriyah; existing route requires unmortgaged residential property valued at ≥ SAR 4 million)
    note: frame as "proposed, not confirmed" — do not state as finalized policy
    status: queued

23. **New Jeddah Property Launches: Why Investors Are Looking Past Riyadh**
    segment: diaspora investors | market: Saudi Arabia | source: Reddit (r/dubairealestate — "New Property Projects being Launched in Jeddah, Saudi Arabia", https://www.reddit.com/r/dubairealestate/comments/1qaamao/new_property_projects_being_launched_in_jeddah/) + Perplexity (Jeddah Q2 2026: 6,669 transactions worth SAR 10.3bn, value up 31% YoY vs. Riyadh's 10,667 transactions down 2% YoY — Knight Frank, published 2026-09-15/updated 2026-10-06)
    status: queued

24. **Dubai's Market Is "Normalizing," Not Slowing: What Q3 2026 DLD Data Actually Shows Buyers**
    segment: diaspora investors | market: UAE | source: Perplexity (Khaleej Times, 2026-10-13 — Q3 2026 Dubai residential transactions ~AED 70.8–72.6bn across ~34,000-34,500 deals; DLD Q3 figures reported 2026-10-07: 37,429 sales worth AED 92.9bn, off-plan share fell to 59% of value from 68% a year earlier)
    status: queued

25. **Why Dubai Villa Prices Fell in Some Areas While Downtown Rose 7.7%: A Neighborhood-by-Neighborhood Breakdown**
    segment: diaspora investors | market: UAE | source: Perplexity (DLD-data area analysis via Palm Observer, updated 2026-10-04 — Downtown Dubai +7.7%, Dubai Hills Estate +6.6%, Dubai Creek Harbour +3.3% month-on-month, vs. Dubai Marina -7.3%, Dubai South -4.9%, DAMAC Hills -2.5%)
    status: queued

26. **Dubai's Property-Owner Visa Just Got Easier for Solo Buyers: What Changed**
    segment: relocators, diaspora investors | market: UAE | source: Perplexity (secondary reporting, 2026 — renewable two-year property-owner residence route reportedly widened so sole owners of completed, Dubai-registered residential property can apply regardless of value; joint owners generally need a registered share of at least AED 400,000 each)
    note: secondary reporting, not an official DLD/immigration-authority confirmation — verify current eligibility before publishing as fact
    status: queued

27. **Cyprus Golden Visa Review: 12,000 Permits Under Scrutiny — What It Means If You're Applying Now**
    segment: diaspora investors | market: Cyprus | source: Perplexity (Deputy Migration Minister Nicholas Ioannides, parliamentary committee testimony 2026-09-24, reported via thelegationtimes.com 2026-09-27/30 — ~12,000 investor-residence permits issued since 2013 under review; existing €300,000 investment / €50,000 income thresholds still in force, no new rules published as of 2026-10-14)
    status: queued

28. **Cyprus Joining Schengen in 2026: What It Actually Changes for Property Buyers, Remote Workers, and Visa Runners**
    segment: relocators, digital nomads | market: Cyprus | source: Reddit (r/cyprus — "What would Cyprus's joining the Schengen area bring?", https://www.reddit.com/r/cyprus/comments/1n6jlbx/what_would_cypruss_joining_the_schengen_area_bring/)
    note: Schengen accession expected 2026 — flag that the "Cyprus visa-run loophole" many digital nomads currently rely on will close; verify current accession status before publishing
    status: queued

29. **Cyprus Mortgage Rates Just Rose to 4.16%: What Foreign Buyers Should Know About Financing**
    segment: diaspora investors | market: Cyprus | source: Perplexity (Central Bank of Cyprus data via CNA.cy, average new house-purchase loan rate up to 4.16% in Aug 2026 from 3.78% in Jul; non-residents typically borrow 60-70% of property value per Cyprus Mail, 2026-10-05)
    status: queued

30. **Georgia's New Work-Permit Rule: Why "Just Stay 365 Days Visa-Free" No Longer Covers Remote Workers**
    segment: digital nomads | market: Georgia | source: Reddit (r/Sakartvelo — "Moving to Georgia as a digital nomad is still possible?", https://www.reddit.com/r/Sakartvelo/comments/1s3eojn/moving_to_georgia_as_a_digital_nomad_is_still/) + Perplexity (from 1 Mar 2026, foreigners without permanent residence generally need a "right to work" to be self-employed in Georgia; workers registered by 1 Mar 2026 have until 1 Jan 2027 to get authorized; treatment of remote work for foreign clients reported as unclear — multiple sources, 2026-09/10)
    note: tax/legal nuance — recommend readers confirm with a Georgian tax advisor before acting
    status: queued

31. **Georgia Just Raised the Property Threshold for Residency to $150,000: What Changed and Why**
    segment: diaspora investors | market: Georgia | source: Perplexity (short-term residence-by-property threshold reportedly increased from $100,000 to over $150,000 equivalent on 1 Mar 2026, value confirmed by an accredited appraiser — internationalinvestment.biz / expatsi.com, Sep 2026)
    status: queued

32. **Tbilisi vs. Batumi in 2026: Where Foreign Buyers Are Actually Putting Their Money**
    segment: diaspora investors | market: Georgia | source: Reddit (r/tbilisi / r/Sakartvelo cost-of-living threads, e.g. "What is the actual cost of a 'worry-free' life in Georgia?", https://www.reddit.com/r/tbilisi/comments/1t55j7p/what_is_the_actual_cost_of_a_worryfree_life_in/) + Perplexity (Colliers Aug 2026 data via bm.ge: Tbilisi 3,388 transactions +18.9% YoY, foreign buyers 14% of deals; Batumi 1,235 transactions -4.3% YoY, foreign buyers 52% of deals, 2026-10)
    status: queued

33. **"Is Tbilisi Actually Worth It?" What Digital Nomads on Reddit Keep Asking in 2026**
    segment: digital nomads | market: Georgia | source: Reddit (r/digitalnomad / r/tbilisi — "What's really attractive about Tbilisi in Georgia for digital nomads?", https://www.reddit.com/r/digitalnomad/comments/1tzl36f/whats_really_attractive_about_tbilisis_in_georgia/ ; "Considering moving to Tbilisi as online entrepreneurs", https://www.reddit.com/r/tbilisi/comments/1vu49kv/considering_moving_to_tbilisi_as_online/)
    status: queued

34. **Why Banks Won't Finance Your Overseas Property Purchase (And How Cross-Border Buyers Get Around It)**
    segment: real estate investors (general) | market: cross-border / multiple | source: Reddit (r/mortgageItalyexpats — "Why do banks only finance mortgages for real estate in their own country and not for the purchase of real estate abroad?", https://www.reddit.com/r/mortgageItalyexpats/comments/1h0f3hc/why_do_banks_only_finance_mortgages_for_real/)
    status: queued

35. **The 2026 Digital Nomad Visa Landscape: Comparing Georgia, Cyprus, and Zanzibar Among 55+ Countries**
    segment: digital nomads | market: Georgia, Cyprus, Zanzibar | source: Reddit (r/NomadTracker — "The Digital Nomad Visa Comparison: Every Country Offering One in 2026", https://www.reddit.com/r/NomadTracker/comments/1s8m9rv/the_digital_nomad_visa_comparison_every_country/)
    note: Amsi Spaces has no confirmed Zanzibar partner yet — "coming soon" framing only, consistent with topic #12 above
    status: queued
