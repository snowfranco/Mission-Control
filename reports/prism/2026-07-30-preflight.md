# Prism Memo: Preflight demand thesis (AI-CVE surge vs a crowding audit market)

## Verdict
Go, with one required reframe. Extend existing: Preflight (slot 1, shipping). This is not a new-slot call.

In 3 sentences: The demand is real and steeply growing, so the problem Preflight audits is confirmed, not speculative. But Torus's specific wedge ("the automated lane is open, undercut human agencies") is half wrong: free automated scanners already crowd that lane, so raw automation is not the moat. Preflight's defensible edge is the paid, trustworthy scored report plus fix PRs sold to non-technical founders who will not run a CLI or read a scanner dump, and the memo is Go only if the positioning shifts from "cheaper automated scan" to "the report and the fix a non-coder can act on."

## Path to revenue
Who pays: non-technical or semi-technical founders of vibe-coded apps (Lovable, Bolt, Cursor, Replit) about to launch or already live. For what: a scored audit report with file-level evidence plus generated fix PRs. Price: $99 single audit, $249 launch-gate bundle (already set, ROADMAP.md Phase 6; registry commercial_line). Distribution: inbound from the "is my vibe-coded app secure" search and community demand (evidence below), plus a free teaser (grade + severity counts) as the funnel. To hit slot 1's $2,500 MRR target (registry portfolio.yaml mrr_target_usd): roughly 25 single audits or 10 bundles per month, or a recurring re-scan tier. At $99/$249 one-shot pricing this is transactional, not subscription, so the real path to durable MRR is a recurring re-audit or monitoring tier, which the current pricing does not yet encode. Flag: MRR math assumes one-shot pricing repeats monthly; that is an inference, not a validated repeat rate.

## Intersect memo (related_projects: [preflight])
This is an extension, not net-new: it sharpens the go-to-market story for an already-shipping bet, it does not open a slot. What it should change in Preflight's ROADMAP: (1) reframe positioning away from "automated and cheaper" toward "the paid report and fix a non-technical founder can trust and act on," because the free-scanner field is filling; (2) add a recurring re-scan / monitoring tier to the pricing decision, since one-shot $99 does not compound into MRR; (3) treat the free teaser as the wedge against free competitors, not the price. No change to the Phase 7 hardening gate or the go-live runbook.

## Evidence
- AI-attributed CVEs rose 6 (Jan) to 15 (Feb) to 35 (Mar) 2026, near-sixfold; 74 total AI-tool-attributed, Claude Code 27, per Georgia Tech SSLab "Vibe Security Radar" (infosecurity-magazine.com/news/ai-generated-code-vulnerabilities; labs.cloudsecurityalliance.org CSA note). Label: evidence.
- Broader CVE volume 45,207 Jan to late July 2026, ~66K projected for 2026 (+46% over forecast), AI-driven (securityboulevard.com 2026/07; first.org/blog/20260615-vulnerability-forecast-update). Label: evidence (context, not Preflight-specific).
- Demand for audits is real: 92% of AI codebases have >=1 critical vuln, avg 8.3 findings (sherlockforensics.com AI Code Security Report 2026); ~45% of AI code carries OWASP Top 10 flaws (CodeRabbit, cited hatchworks.com, contextstudios.ai); Feb 2026 Moltbook breach exposed 1.5M auth tokens on a fully vibe-coded app (hatchworks.com/blog/gendd/cost-of-vibe-coding). Label: evidence.
- Willingness to pay confirmed at prices well above Preflight: Sherlock Forensics audits from $1,500 CAD (sherlockforensics.com); human agency audits priced in days, Damian Galarza found 69 vulns across 15 apps (vibecoding.app/blog/best-vibe-code-audit-agencies); verified agency directory exists (Railsware, Beesoul). Preflight at $99/$249 undercuts these by 15x+. Label: evidence.
- The automated lane is NOT open, it is filling: ZeriFlow offers a free 30-second scan, 12,400+ sites analyzed (zeriflow.com/blog/best-security-scanner-vibe-coders); a published free OWASP-Top-10 audit agent built on Airia (instagram itsthatlady.dev, Jul 2026); a Reddit-built scanner ran 100 projects, 318 vulns (reddit.com/r/webdev showoff); Windsurf by Snyk bundles scanning into the IDE (testomat.io). Label: evidence. This directly contradicts the card's "automated lane open" claim.

## Kill conditions
1. A well-funded free scanner adds trustworthy fix PRs for non-technical users at $0, collapsing the $99 value gap.
2. Vibe-coding platforms (Lovable, Bolt, Replit) ship built-in pre-launch security gates, removing the third-party need.
3. Repeat-purchase rate on one-shot audits stays near zero after 60 days live, confirming no path to MRR without a recurring tier.
4. Paid conversion from the free teaser lands below ~2%, showing the teaser trains users to self-fix for free instead of buying.
5. CVE-surge coverage cools and "vibe code audit" search demand declines two consecutive months.

## Cost of being wrong
If Go is wrong (demand or willingness-to-pay is thinner than it looks, or free scanners win): Preflight is already built and shipping, so the sunk cost is the launch effort plus roughly 1 to 2 weeks repositioning; low dollars, mostly time. If No-Go were wrong (we under-invest and the window is real): we cede a market with confirmed 15x pricing headroom and a live, growing demand curve to the agencies and free tools; opportunity cost is the clearest near-term line to the first MRR dollar in the whole portfolio.

## Slot math
No displacement. Preflight already holds slot 1 (shipping) and this memo extends its positioning, it does not add a bet. WIP cap (5) and commercial cap (3) unchanged. If the operator later wants a recurring-monitoring product as a separate bet, that would need its own slot and displace something; not proposed here.

-- Prism
