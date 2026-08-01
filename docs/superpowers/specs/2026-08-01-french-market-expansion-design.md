# French Market Expansion — Design Spec

**Date:** 2026-08-01
**Status:** Approved, pending implementation plan(s)

## Goal

Expand AgoraCrew into the French B2B market (a new outbound campaign targeting French Shopify stores) by adding French-language support across three systems: the marketing website, the embeddable support widget + its backend (Project Rising Lion), and the client dashboard (Project Control). This is strictly an **addition alongside** existing functionality — the American campaign and existing English-speaking clients must see zero behavior change.

Repos involved (all under `C:\Users\miche\.gemini\antigravity\scratch\`):
- `optimise-inbox\Website` — marketing site
- `Project Rising Lion` — Node/Express backend + embeddable chat widget
- `Project Control` — Next.js 16 (App Router) staff + client dashboard

## Non-goals / explicit constraints

- **No regressions for existing clients.** `locale` defaults to `en` everywhere; anyone not explicitly set to `fr` sees identical behavior to today. No migration required for existing data.
- **No `.fr` ccTLD.** `/fr` subdirectory on the existing domain, with `hreflang` tags — standard 2026 guidance for a non-enterprise site (inherits domain authority, avoids building SEO from zero).
- **No new payment processor.** Shopify Billing already handles every charge, in the merchant's Shopify-configured currency (`Project Control/app/dashboard/billing/page.js:284`). Nothing to build here beyond display formatting.
- **No lawyer-drafted legal content.** User is supplying the French mentions légales / CGV text directly.
- **No translation vendor.** Translation is done directly (AI-assisted); a native-speaker spot-check of the homepage, pricing, and legal pages is recommended before launch but not blocking.
- **No translation of existing knowledge bases** (`brand_a_rules.md`, `brand_b_rules.md`, `agoracrew_com_rules.md`, `company.md`). Those belong to existing English clients/AgoraCrew's own dogfooding. New French clients author their own KB in French at onboarding — there's no existing content to translate for them.
- **No Shopify Markets auto-locale-detection in v1.** `locale` is set explicitly (onboarding + admin edit). Auto-populating it from a store's Shopify Markets configuration is a fast-follow, not part of this pass.
- **The AI conversational layer is unchanged.** `aiService.js` already detects a customer's message language and replies in kind (`matchLanguage()`); this already works for French today and needs no new engineering.

## Cross-cutting foundation

### `Client.locale`
Add a `locale` field to the Client schema in `Project Rising Lion/clientStore.js`: enum `['en', 'fr']`, default `'en'`. This is the single source of truth for **that merchant's storefront-facing default** — it drives the widget's default UI language and the dashboard's initial language when a `client`-role user first logs in. It does not drive AI reply language (already dynamic) and it is not the same thing as a dashboard viewer's personal UI-language choice (see below).

### Currency
Display currency is derived from `locale` via a fixed mapping (`en → USD`, `fr → EUR`) rather than a separately stored field, since v1 only supports these two locale/market pairs. Project Control's billing UI switches from hardcoded `$` + `.toFixed(2)` (e.g. `billing/page.js:238,284`, `PricingCard.js`) to `Intl.NumberFormat(locale, { style: 'currency', currency })`. Actual payment collection is untouched — Shopify already bills merchants in their store's configured currency.

### Dashboard language switcher (Project Control)
An explicit, always-visible language switcher, available to every role (`client`, `manager`, `admin`) — not just an automatic default. This is a **personal UI preference**, deliberately kept separate from `Client.locale`:
- A `client`-role user's dashboard language initializes from their `Client.locale` on first login (sensible default), but switching it in the dashboard only changes what that person sees in Project Control. It does **not** write back to `Client.locale` or change their live widget's customer-facing language.
- Rationale: a merchant switching their own dashboard to French to test it (or a bilingual staff member toggling for QA) must never accidentally flip the language their live shoppers see on the storefront widget. Those are two independent concerns — who's looking at the dashboard vs. who's talking to the widget.
- Staff (`admin`/`manager`) default to English and can switch freely; this has no `Client.locale` to initialize from.
- Persisted as a lightweight per-session preference (cookie/localStorage), not a new database field.

### Website language experience
Combination of detection + prompt, not silent auto-redirect: detect via `Accept-Language`/geo-IP as a signal, surface a small dismissible banner ("On dirait que vous êtes en France — voir en français ?"), remember the visitor's choice in a cookie. Never block content with an interstitial, and never silently redirect (hurts crawlability and annoys users on VPNs/expats).

## Website

- Add `/fr` routes mirroring every existing page: homepage, 3 solutions pages, 3 resources pages, privacy policy, blog index + the 1 existing post, the CX audit tool.
- Two new pages: mentions légales and CGV (French only, using the boilerplate the user is drafting).
- `hreflang` tags (`en`↔`fr`, plus `x-default`) added to every page pair's `<head>`.
- Language banner per "Website language experience" above.
- Content translated directly; homepage/pricing/legal pages get a native-speaker spot-check before launch.
- French sitemap entries; translated `<title>`/meta description/OG tags per page.

## Project Rising Lion (backend + widget)

- Externalize the ~10 hardcoded widget-chrome strings in `public/widget/widget.js` (header text, input placeholder, send button, email placeholder, "Powered by AgoraCrew" attribution — lines ~270-311) into an `en`/`fr` string map, selected by the embedding client's `locale`.
- Audit and fix the small number of fallback/error strings that currently bypass `matchLanguage()` — e.g. the invalid-email message at `routes/widget.js:375` — so every widget-emitted string is locale-correct, not just AI-generated replies.
- No change to `aiService.js`'s system prompts or `matchLanguage()` logic — already functioning correctly for French conversations.
- No KB translation (see Non-goals).

## Project Control (dashboard)

- Adopt `next-intl`; restructure routing to `app/[locale]/...` (App Router-native, Server Component support — the 2026-standard choice over `next-i18next`).
- Extract hardcoded copy out of the ~28 files identified as containing inline JSX text into `messages/en.json` / `messages/fr.json`.
- Wire `Intl.NumberFormat` / `Intl.DateTimeFormat` per the Currency section above, replacing the hardcoded `$` strings and any ad hoc date rendering.
- Add the language switcher described above.
- Visual QA pass once French strings land — French text runs ~15-20% longer than English and can break tight layouts (buttons, table headers, nav).

## Rollout order

Dependency-driven (no fixed launch date, so sequencing optimizes for not re-doing work):

1. **Foundation** — `Client.locale` field + currency-mapping decision.
2. **Rising Lion** — widget chrome externalization + fallback-string audit. Smallest piece; unblocks onboarding a real French client end-to-end even before the other two systems are done.
3. **Website** — `/fr` pages, hreflang, legal pages, banner. Campaign-facing, so this matters for launch visibility.
4. **Project Control** — `next-intl` migration + string extraction. Largest lift, done last since it depends on nothing else finishing first.
5. **Cross-system QA** — full walkthrough as a simulated French merchant: website (fr) → signup → widget embedded on their store (fr) → dashboard login (fr, via switcher) → billing display in EUR.

## Testing

- Existing English-locale behavior is the regression baseline: before/after screenshots or a manual pass on the homepage, widget, and dashboard in `en` confirming zero visible change.
- New `/fr` website pages: hreflang validation (a single broken hreflang pair causes Google to ignore the whole cluster), broken-link check across the mirrored page set.
- Widget: verify chrome strings switch correctly per `Client.locale`, verify AI conversation language-matching still works unaffected.
- Dashboard: verify the language switcher changes only the current user's view, not `Client.locale`; verify EUR formatting on a test French client's billing page; visual QA for text-expansion breakage across the extracted-string surface.

## Out of scope (explicitly deferred)

- Shopify Markets locale auto-detection (`Client.locale` stays manually set in v1).
- Translating existing brand/company knowledge bases.
- Any `.fr` ccTLD purchase.
- Professional/agency translation — AI-translated with an optional native spot-check only.
- Any new payment processor or multi-currency payment infrastructure beyond display formatting.
