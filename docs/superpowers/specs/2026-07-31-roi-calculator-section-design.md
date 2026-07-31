# ROI Calculator Section — Design Spec

**Date:** 2026-07-31
**Status:** Approved, pending implementation plan

## Goal

Replace the homepage's `#problem` ("The Cost Trap / The Time Drain / The Scaling Cliff") agitation section with a self-serve ROI calculator: a prospect enters their monthly ticket volume and current cost-per-ticket, and sees a live comparison against AgoraCrew's flat-fee pricing. Pairs it with cited industry stats on live-chat conversion lift, so the section makes both the cost argument (cheaper) and the revenue argument (chat converts better) in one place.

Works as a landing-page asset today, and is self-contained enough to link to directly (`#problem` anchor is unchanged) in a follow-up email once a prospect has engaged.

## Placement

- Replaces the entire `<section class="benefits" id="problem">` block in `index.html` (currently lines ~280–317), in the same position in page flow (between the platform-logos band and "How It Works").
- The `id="problem"` anchor is kept as-is so all existing nav links (`index.html` desktop + mobile nav, and `components.js`'s injected nav used by `blog/`, `solutions/`, `resources/` pages) keep working without needing changes there.
- The nav link **label** changes from "The Problem" to "ROI Calculator" in all 4 places it appears (`index.html` lines ~85 and ~170; `components.js` lines ~27 and ~88).

## Layout

Two-column section (stacks to single column on mobile), inside the existing `.section-container` wrapper:

```
[ ROI Calculator ]
See What Your Inbox Is Really Costing You.
Most stores overpay for support and still lose sales to slow response times. Run your own numbers.

+-------------------------------+  +--------------------------------+
|  Your Numbers                 |  |  Why Chat Converts Better       |
|                                |  |                                |
|  Monthly support tickets       |  |  +--------------------------+  |
|  [======O============] 800     |  |  | 💬  ~20% lift            |  |
|                                |  |  | Adding live chat lifts   |  |
|  Cost per ticket today         |  |  | site-wide conversion     |  |
|  [====O==============] $4.50   |  |  | Source: Forrester        |  |
|                                |  |  +--------------------------+  |
|  ────────────────────          |  |  +--------------------------+  |
|  Your cost today      $3,600   |  |  | 🛍️  10–15% of revenue    |  |
|  AgoraCrew (Growth)     $249   |  |  | is what e-commerce brands|  |
|  ────────────────────          |  |  | attribute to live chat   |  |
|  You save        $3,351/mo     |  |  | Source: Forrester        |  |
|  (93% less · $40,212/yr)       |  |  +--------------------------+  |
|                                |  |  +--------------------------+  |
|  [Start My Free Trial]         |  |  | 🤝  79% of businesses    |  |
|  [See Full Pricing]            |  |  | say chat improved sales, |  |
|                                |  |  | revenue & loyalty        |  |
|                                |  |  | Source: Kayako           |  |
+-------------------------------+  |  +--------------------------+  |
                                    +--------------------------------+
```

## Calculator mechanics

**Inputs** (both range sliders, each paired with a synced, directly-editable number display):
- Monthly support tickets — range 100–6,000, step 50, default 800
- Cost per ticket today — range $1–$15, step $0.50, default $4.50

**Plan matching** (uses real current pricing, `index.html` pricing section as source of truth):
| Ticket volume | Plan | Fee |
|---|---|---|
| ≤ 500 | Starter | $99/mo |
| ≤ 1,500 | Growth | $249/mo |
| ≤ 4,000 | Scale | $599/mo |
| > 4,000 | Scale | $599 + $0.20 × (volume − 4,000) |

**Derived values, recalculated live on every input change:**
- `currentCost = volume × costPerTicket`
- `agoraCost` = matched plan fee (above)
- `savings = currentCost − agoraCost`
- `savingsPercent = round(savings / currentCost × 100)`
- `annualSavings = savings × 12`

**Output panel**, all values in an `aria-live="polite"` region so screen readers announce changes:
- "Your cost today" — `$currentCost`
- "AgoraCrew (`{plan}`)" — `$agoraCost`
- "You save" — `$savings/mo` with `({savingsPercent}% less · ${annualSavings}/yr)` as a smaller sub-line
- If `savings` is ever ≤ 0 (edge case at very low cost-per-ticket + high volume against Scale+overage), the savings line is hidden and replaced with a neutral "AgoraCrew scales with your ticket volume — no surprise cliffs." line instead of showing a negative/zero "you save $0" number.

**CTAs below the output:**
- Primary: "Start My Free Trial" → `#contact` (matches every other primary CTA on the page)
- Secondary: "See Full Pricing" → `#pricing`

## Stats column

Three stat cards, each: icon, large stat figure (serif, coral), one-line explanation, small `Source: X` footnote in muted ink. Content locked in as:

1. 💬 **~20% lift** in site-wide conversion — "Adding live chat lifts overall site conversion." — *Source: Forrester (industry-aggregated data)*
2. 🛍️ **10–15% of revenue** — "What e-commerce brands attribute to live chat interactions." — *Source: Forrester*
3. 🤝 **79% of businesses** — "Say live chat improved sales, revenue, and customer loyalty." — *Source: Kayako*

These are widely-cited, secondary-sourced industry figures (as virtually all "live chat stats" marketing citations are — no primary Forrester/Kayako report was fetched directly). They're presented as directional industry data with attribution, not as AgoraCrew's own measured results.

## Visual system (no new tokens)

Reuses existing `styles.css` custom properties exclusively:
- Colors: `--coral`, `--ink` / `--ink-*`, `--peach`, `--white`
- Type: `--font-serif` (headings, big numbers) / `--font-sans` (body, labels)
- Radius: `--radius-md` (cards), `--radius-pill` (slider thumb / badges)
- The calculator card and the stat-card stack sit at equal visual weight (no dark-card treatment forced on one side) — avoids the existing "peach / dark / light" three-way pattern from the section it replaces, since this is a two-panel, not three-panel, layout.

## Motion

Two `.reveal` triggers total — one on the calculator card, one on the stat-card stack — not one per stat card or per input. Matches the fix the parallel design-audit pass is making elsewhere on the site (avoid blanket per-element scroll-reveal).

## Implementation notes

- Pure client-side JS, no backend/API call — added to `script.js` inside the existing `DOMContentLoaded` handler, following its existing style (plain vanilla JS, no framework).
- Currency formatting: whole-dollar rounding for all displayed amounts (no cents) via `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })` (or equivalent), except the cost-per-ticket input itself, which displays to the nearest $0.50.
- Sliders are native `<input type="range">` with a synced `<input type="number">` (or plain text display, editable) — keyboard accessible by default; no custom slider widget needed.
- No new dependencies, no build step (site has none currently).

## Out of scope (explicitly deferred)

- No toggle between "per-ticket" vs "rep salary" input modes (per-ticket only, per approved decision).
- No server-side lead capture tied to calculator values (e.g. pre-filling the contact form with the visitor's numbers) — future enhancement if desired, not part of this pass.
- No new page — this only touches the homepage section and the 4 nav-label references.
