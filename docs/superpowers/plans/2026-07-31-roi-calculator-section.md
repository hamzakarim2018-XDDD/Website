# ROI Calculator Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's "The Problem" agitation section (`#problem`) with a self-serve ROI calculator (ticket volume + cost-per-ticket vs. AgoraCrew flat-fee, live) paired with cited live-chat conversion stats, per `docs/superpowers/specs/2026-07-31-roi-calculator-section-design.md`.

**Architecture:** Pure static HTML/CSS/vanilla-JS, matching the existing site's stack exactly (no build step, no framework). The calculator's math lives in its own tiny standalone file (`roi-calc.js`) so it can be verified with a plain `node` script instead of a browser — everything else (markup, styling, DOM wiring) is verified visually via a headless-Chromium screenshot, since that's how this repo is actually tested (it has zero existing test infra).

**Tech Stack:** Plain HTML/CSS/JS. Verification tools: `node` (for the pure calculator logic) and `npx playwright screenshot` (for visual/interactive checks — confirmed working in this environment; no `chromium-cli` or existing browser test setup present).

## Global Constraints

- No new dependencies, no build step, no new frameworks — file-for-file consistent with the rest of the repo.
- Reuse existing `styles.css` custom properties only (`--coral`, `--ink`, `--ink-*`, `--peach`, `--white`, `--font-serif`, `--font-sans`, `--radius-md`, `--radius-pill`) — no new colors or fonts introduced.
- The `id="problem"` anchor on the section must be preserved exactly — it's linked from 6 places across `index.html`, `components.js`, and inner pages via injected nav.
- Pricing numbers must match the real current plans exactly: Starter $99/500 tickets, Growth $249/1,500 tickets, Scale $599/4,000 tickets, $0.20/ticket overage beyond 4,000 (source of truth: `index.html`'s `#pricing` section).
- Motion stays restrained: exactly two `.reveal` triggers in this section (one on the calculator card, one on the stat stack), not one per stat card or per input — this section is part of a parallel site-wide effort to dial back blanket scroll-reveal animation.

---

### Task 1: Rename nav label from "The Problem" to "ROI Calculator"

**Files:**
- Modify: `index.html` (2 occurrences — desktop nav and mobile nav)
- Modify: `components.js` (2 occurrences — desktop nav and mobile nav, injected into `blog/`, `solutions/`, `resources/` pages)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks — this is a standalone, independently-shippable text change. The `href="#problem"` anchor is unchanged throughout, so no other file needs to know about this rename.

- [ ] **Step 1: Update `index.html`**

Both occurrences are the identical string `<a href="#problem">The Problem</a>` (one in the desktop nav, one in the mobile nav). Replace both:

```
old_string: <a href="#problem">The Problem</a>
new_string: <a href="#problem">ROI Calculator</a>
replace_all: true
```

- [ ] **Step 2: Update `components.js`**

Both occurrences are the identical string `'<a href="' + base + '/index.html#problem">The Problem</a>' +` (one in the desktop nav block, one in the mobile nav block). Replace both:

```
old_string: '<a href="' + base + '/index.html#problem">The Problem</a>' +
new_string: '<a href="' + base + '/index.html#problem">ROI Calculator</a>' +
replace_all: true
```

- [ ] **Step 3: Verify**

Run:
```bash
grep -rn "The Problem" "Website/index.html" "Website/components.js"
grep -rn "ROI Calculator" "Website/index.html" "Website/components.js"
```
Expected: the first command returns nothing; the second returns 4 matches total (2 per file).

- [ ] **Step 4: Commit**

```bash
cd Website
git add index.html components.js
git commit -m "rename nav label from 'The Problem' to 'ROI Calculator'"
```

---

### Task 2: Add the pure ROI calculation function with a Node-runnable test

**Files:**
- Create: `Website/roi-calc.js`
- Create: `Website/roi-calc.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: a global function `computeROI(volume, costPerTicket)` (available as `window.computeROI` in the browser once loaded via `<script>` tag in Task 4) returning `{ plan, fee, currentCost, savings, savingsPercent, annualSavings }`. Task 4's DOM-wiring code calls this function by name — the signature and return-object keys below are exactly what it expects.

- [ ] **Step 1: Write `roi-calc.js`**

```js
/* ============================================
   AGORACREW — ROI Calculator (pure logic)
   Plan tiers match the #pricing section: Starter $99/500,
   Growth $249/1,500, Scale $599/4,000, +$0.20/ticket overage.
   ============================================ */

function computeROI(volume, costPerTicket) {
  let plan, fee;
  if (volume <= 500) {
    plan = 'Starter';
    fee = 99;
  } else if (volume <= 1500) {
    plan = 'Growth';
    fee = 249;
  } else if (volume <= 4000) {
    plan = 'Scale';
    fee = 599;
  } else {
    plan = 'Scale';
    fee = 599 + (volume - 4000) * 0.20;
  }

  const currentCost = volume * costPerTicket;
  const savings = currentCost - fee;
  const savingsPercent = currentCost > 0 ? Math.round((savings / currentCost) * 100) : 0;
  const annualSavings = savings * 12;

  return { plan, fee, currentCost, savings, savingsPercent, annualSavings };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeROI };
}
```

- [ ] **Step 2: Write `roi-calc.test.js`**

```js
const assert = require('assert');
const { computeROI } = require('./roi-calc.js');

// Default calculator state: 800 tickets/mo at $4.50 each → Growth plan
let r = computeROI(800, 4.5);
assert.strictEqual(r.plan, 'Growth');
assert.strictEqual(r.fee, 249);
assert.strictEqual(r.currentCost, 3600);
assert.strictEqual(r.savings, 3351);
assert.strictEqual(r.savingsPercent, 93);
assert.strictEqual(r.annualSavings, 40212);

// Starter tier, exact upper boundary (500 tickets)
r = computeROI(500, 3);
assert.strictEqual(r.plan, 'Starter');
assert.strictEqual(r.fee, 99);

// Crossing into Growth tier (501 tickets)
r = computeROI(501, 3);
assert.strictEqual(r.plan, 'Growth');
assert.strictEqual(r.fee, 249);

// Scale tier, exact upper boundary (4,000 tickets, no overage yet)
r = computeROI(4000, 2);
assert.strictEqual(r.plan, 'Scale');
assert.strictEqual(r.fee, 599);

// Overage above Scale's included volume: 599 + 0.20 * 1000 = 799
r = computeROI(5000, 2);
assert.strictEqual(r.plan, 'Scale');
assert.strictEqual(r.fee, 799);

console.log('All roi-calc tests passed.');
```

- [ ] **Step 3: Run the test and confirm it passes**

Run: `node Website/roi-calc.test.js`
Expected output: `All roi-calc tests passed.` with exit code 0. (There's no "make it fail first" step here since the function and its test were designed together against the worked example in the spec — if you want to double check the harness itself works, temporarily change one `assert.strictEqual` expected value and confirm the script throws, then revert.)

- [ ] **Step 4: Commit**

```bash
cd Website
git add roi-calc.js roi-calc.test.js
git commit -m "add ROI calculator pure logic with node-runnable test"
```

---

### Task 3: Replace the `#problem` section markup and add its CSS

**Files:**
- Modify: `Website/index.html` (replace the `<!-- PROBLEM / AGITATION -->` section)
- Modify: `Website/styles.css` (append new `.roi-*` rules; add one line to the existing mobile media query)

**Interfaces:**
- Consumes: nothing (static markup only in this task — no JS wiring yet, so all values are hardcoded to match `computeROI(800, 4.5)`'s output from Task 2's test: current cost $3,600, plan "Growth", fee $249, savings $3,351/mo, 93% less, $40,212/yr).
- Produces: DOM elements with the following IDs, which Task 4's JS will bind to: `roiVolumeSlider`, `roiVolumeNumber`, `roiCostSlider`, `roiCostNumber`, `roiCurrentCost`, `roiPlanName`, `roiPlanFee`, `roiSavingsAmount`, `roiSavingsSubline`, `roiSavingsBlock`, `roiNeutralMessage`.

- [ ] **Step 1: Replace the section in `index.html`**

Find the block starting with `<!-- ==================== PROBLEM / AGITATION ==================== -->` and ending at the `</section>` that closes `<section class="benefits" id="problem">` (it contains the "The Cost Trap" / "The Time Drain" / "The Scaling Cliff" cards). Replace the entire block:

```
old_string:
  <!-- ==================== PROBLEM / AGITATION ==================== -->
  <section class="benefits" id="problem">
    <div class="section-container">
      <div class="text-center">
        <span class="section-label"><span class="dot"></span> The Problem</span>
        <h2 class="section-title">Support Is Eating Your Margins.<br/><span class="accent-text">And Your Sanity.</span></h2>
        <p class="section-subtitle mx-auto">
          You started a brand, not a help desk. But your inbox doesn't care.
        </p>
      </div>

      <div class="benefits-grid">
        <div class="benefit-card benefit-card--peach reveal">
          <div class="benefit-icon">💸</div>
          <h3 class="benefit-title">The Cost Trap</h3>
          <p class="benefit-text">
            A full-time support rep costs $2,000–$4,000/mo before benefits. And you still need coverage for nights, weekends, and Black Friday spikes.
          </p>
        </div>

        <div class="benefit-card benefit-card--dark reveal reveal-delay-1">
          <div class="benefit-icon">⏱️</div>
          <h3 class="benefit-title">The Time Drain</h3>
          <p class="benefit-text">
            Every hour in the inbox is an hour not spent on product, marketing, or growth. And the inbox never empties.
          </p>
        </div>

        <div class="benefit-card reveal reveal-delay-2">
          <div class="benefit-icon">📈</div>
          <h3 class="benefit-title">The Scaling Cliff</h3>
          <p class="benefit-text">
            Per-ticket pricing sounds cheap until your order volume doubles overnight. Suddenly your "affordable" support bill is a runaway cost you can't predict.
          </p>
        </div>
      </div>
    </div>
  </section>

new_string:
  <!-- ==================== ROI CALCULATOR ==================== -->
  <section class="benefits" id="problem">
    <div class="section-container">
      <div class="text-center">
        <span class="section-label"><span class="dot"></span> ROI Calculator</span>
        <h2 class="section-title">See What Your Inbox Is<br/><span class="accent-text">Really Costing You.</span></h2>
        <p class="section-subtitle mx-auto">
          Most stores overpay for support and still lose sales to slow response times. Run your own numbers.
        </p>
      </div>

      <div class="roi-grid">
        <div class="roi-calc-card reveal">
          <h3 class="roi-calc-heading">Your Numbers</h3>

          <div class="roi-field">
            <div class="roi-field-label">
              <span>Monthly support tickets</span>
              <span class="roi-field-value"><input type="number" id="roiVolumeNumber" value="800" min="100" max="6000" step="50" aria-label="Monthly support tickets" /></span>
            </div>
            <input type="range" class="roi-slider" id="roiVolumeSlider" min="100" max="6000" step="50" value="800" aria-label="Monthly support tickets" />
          </div>

          <div class="roi-field">
            <div class="roi-field-label">
              <span>Cost per ticket today</span>
              <span class="roi-field-value">$<input type="number" id="roiCostNumber" value="4.50" min="1" max="15" step="0.5" aria-label="Cost per ticket today in dollars" /></span>
            </div>
            <input type="range" class="roi-slider" id="roiCostSlider" min="1" max="15" step="0.5" value="4.5" aria-label="Cost per ticket today in dollars" />
          </div>

          <div class="roi-divider"></div>

          <div id="roiOutput" aria-live="polite">
            <div class="roi-output-row"><span>Your cost today</span><strong id="roiCurrentCost">$3,600</strong></div>
            <div class="roi-output-row"><span>AgoraCrew (<span id="roiPlanName">Growth</span>)</span><strong id="roiPlanFee">$249</strong></div>

            <div class="roi-savings-block" id="roiSavingsBlock">
              <div class="roi-savings-amount"><span id="roiSavingsAmount">$3,351/mo</span></div>
              <p class="roi-savings-subline" id="roiSavingsSubline">(93% less &middot; $40,212/yr)</p>
            </div>
            <p class="roi-neutral-message" id="roiNeutralMessage" hidden>AgoraCrew scales with your ticket volume &mdash; no surprise cliffs.</p>
          </div>

          <div class="roi-cta-group">
            <a href="#contact" class="roi-cta-primary">Start My Free Trial</a>
            <a href="#pricing" class="roi-cta-secondary">See Full Pricing</a>
          </div>
        </div>

        <div class="roi-stats-stack reveal reveal-delay-1">
          <h3 class="roi-stats-heading">Why Chat Converts Better</h3>

          <div class="roi-stat-card">
            <div class="roi-stat-icon">💬</div>
            <div>
              <div class="roi-stat-figure">~20% lift</div>
              <p class="roi-stat-text">Adding live chat lifts overall site conversion.</p>
              <p class="roi-stat-source">Source: Forrester (industry-aggregated data)</p>
            </div>
          </div>

          <div class="roi-stat-card">
            <div class="roi-stat-icon">🛍️</div>
            <div>
              <div class="roi-stat-figure">10&ndash;15% of revenue</div>
              <p class="roi-stat-text">What e-commerce brands attribute to live chat interactions.</p>
              <p class="roi-stat-source">Source: Forrester</p>
            </div>
          </div>

          <div class="roi-stat-card">
            <div class="roi-stat-icon">🤝</div>
            <div>
              <div class="roi-stat-figure">79% of businesses</div>
              <p class="roi-stat-text">Say live chat improved sales, revenue, and customer loyalty.</p>
              <p class="roi-stat-source">Source: Kayako</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Append new CSS rules to `styles.css`**

Add at the end of the file:

```css

/* ==================== ROI CALCULATOR ==================== */
.roi-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 32px;
  margin-top: 56px;
  align-items: stretch;
}

.roi-calc-card {
  background: var(--peach);
  border-radius: var(--radius-md);
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.roi-calc-heading {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--ink);
  margin-bottom: 24px;
}

.roi-field { margin-bottom: 24px; }

.roi-field-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink-70);
  margin-bottom: 10px;
}

.roi-field-value {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: var(--font-sans);
  font-weight: 700;
  color: var(--coral);
}

.roi-field-value input {
  width: 64px;
  border: none;
  background: transparent;
  font: inherit;
  font-weight: 700;
  color: var(--coral);
  text-align: right;
  padding: 0;
}

.roi-field-value input:focus { outline: none; border-bottom: 1px solid var(--coral); }

.roi-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--ink-10);
  outline: none;
}

.roi-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--coral);
  cursor: pointer;
  border: 3px solid var(--white);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.roi-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--coral);
  cursor: pointer;
  border: 3px solid var(--white);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.roi-divider {
  height: 1px;
  background: var(--ink-10);
  margin: 8px 0 20px;
}

.roi-output-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.95rem;
  color: var(--ink-70);
  margin-bottom: 10px;
}

.roi-output-row strong {
  font-family: var(--font-sans);
  font-size: 1.1rem;
  color: var(--ink);
}

.roi-savings-block { margin-top: 4px; }

.roi-savings-amount {
  font-family: var(--font-serif);
  font-size: 2.25rem;
  color: var(--coral);
  line-height: 1.1;
}

.roi-savings-subline {
  font-size: 0.85rem;
  color: var(--ink-50);
  margin-top: 4px;
  margin-bottom: 24px;
}

.roi-neutral-message {
  font-size: 0.95rem;
  color: var(--ink-70);
  margin: 4px 0 24px;
}

.roi-cta-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: auto;
}

.roi-cta-primary {
  display: inline-flex;
  align-items: center;
  background: var(--coral);
  color: var(--white);
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
  font-weight: 600;
}

.roi-cta-secondary {
  display: inline-flex;
  align-items: center;
  background: transparent;
  color: var(--ink);
  padding: 14px 28px;
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid var(--ink-10);
}

.roi-stats-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.roi-stats-heading {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--ink);
  margin-bottom: 4px;
}

.roi-stat-card {
  background: var(--white);
  border: 1px solid var(--ink-10);
  border-radius: var(--radius-md);
  padding: 24px 28px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.roi-stat-icon { font-size: 1.75rem; line-height: 1; }

.roi-stat-figure {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: var(--coral);
  line-height: 1.1;
}

.roi-stat-text {
  font-size: 0.9rem;
  color: var(--ink-70);
  margin-top: 4px;
}

.roi-stat-source {
  font-size: 0.75rem;
  color: var(--ink-50);
  margin-top: 8px;
}
```

- [ ] **Step 3: Add the mobile stacking rule**

In the existing `@media (max-width: 768px)` block, next to the other `-grid` overrides (`.benefits-grid { grid-template-columns: 1fr; }` etc.), add:

```
old_string: .benefits-grid { grid-template-columns: 1fr; }
new_string: .benefits-grid { grid-template-columns: 1fr; }
  .roi-grid { grid-template-columns: 1fr; }
  .roi-calc-card { padding: 28px 24px; }
```

- [ ] **Step 4: Verify with a screenshot**

```bash
npx --yes playwright screenshot --viewport-size=1280,1400 --wait-for-timeout=500 "file:///$(cd Website && pwd -W 2>/dev/null || pwd)/index.html" /tmp_roi_static.png
```
(Adjust the `file://` path for your shell if `pwd -W` isn't available — any way of getting the absolute Windows path to `Website/index.html` works.)

Open the screenshot and confirm: the section headed "ROI Calculator" appears where "The Problem" used to be, showing a two-column layout — a peach calculator card on the left with two labeled sliders/inputs and "Your cost today $3,600 / AgoraCrew (Growth) $249 / $3,351/mo (93% less · $40,212/yr)", and three white stat cards on the right (💬 ~20% lift, 🛍️ 10–15% of revenue, 🤝 79% of businesses), each with a "Source:" line.

- [ ] **Step 5: Commit**

```bash
cd Website
git add index.html styles.css
git commit -m "add ROI calculator section markup and styles (static state)"
```

---

### Task 4: Wire up live interactivity

**Files:**
- Modify: `Website/index.html` (add two `<script>` tags for `roi-calc.js`, before the existing `script.js` tag)
- Modify: `Website/script.js` (add DOM-binding logic inside the existing `DOMContentLoaded` handler)

**Interfaces:**
- Consumes: `computeROI(volume, costPerTicket)` from Task 2 (global function, loaded via `<script src="roi-calc.js" defer>`), and the element IDs produced in Task 3.
- Produces: nothing further consumed by other tasks — this is the last task.

- [ ] **Step 1: Load `roi-calc.js` in `index.html`**

```
old_string:   <script src="script.js" defer></script>
new_string:   <script src="roi-calc.js" defer></script>
  <script src="script.js" defer></script>
```

- [ ] **Step 2: Add the wiring code to `script.js`**

Insert this new subsection immediately before the final `});` that closes the `DOMContentLoaded` handler (i.e., right after the existing "SMOOTH SCROLL FOR ANCHOR LINKS" block's closing `});`, which is currently the last thing in the file before the handler itself closes):

```
old_string:
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});

new_string:
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================
  // ROI CALCULATOR
  // ============================
  const roiVolumeSlider = document.getElementById('roiVolumeSlider');
  const roiVolumeNumber = document.getElementById('roiVolumeNumber');
  const roiCostSlider = document.getElementById('roiCostSlider');
  const roiCostNumber = document.getElementById('roiCostNumber');
  const roiCurrentCost = document.getElementById('roiCurrentCost');
  const roiPlanName = document.getElementById('roiPlanName');
  const roiPlanFee = document.getElementById('roiPlanFee');
  const roiSavingsAmount = document.getElementById('roiSavingsAmount');
  const roiSavingsSubline = document.getElementById('roiSavingsSubline');
  const roiSavingsBlock = document.getElementById('roiSavingsBlock');
  const roiNeutralMessage = document.getElementById('roiNeutralMessage');

  if (roiVolumeSlider) {
    const roiCurrencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

    const updateROI = () => {
      let volume = parseInt(roiVolumeNumber.value, 10);
      let cost = parseFloat(roiCostNumber.value);

      if (isNaN(volume) || volume < 100) volume = 100;
      if (volume > 6000) volume = 6000;
      if (isNaN(cost) || cost < 1) cost = 1;
      if (cost > 15) cost = 15;

      roiVolumeSlider.value = volume;
      roiVolumeNumber.value = volume;
      roiCostSlider.value = cost;
      roiCostNumber.value = cost.toFixed(2);

      const result = computeROI(volume, cost);

      roiCurrentCost.textContent = roiCurrencyFormatter.format(result.currentCost);
      roiPlanName.textContent = result.plan;
      roiPlanFee.textContent = roiCurrencyFormatter.format(result.fee);

      if (result.savings > 0) {
        roiSavingsBlock.hidden = false;
        roiNeutralMessage.hidden = true;
        roiSavingsAmount.textContent = roiCurrencyFormatter.format(result.savings) + '/mo';
        roiSavingsSubline.textContent = '(' + result.savingsPercent + '% less · ' + roiCurrencyFormatter.format(result.annualSavings) + '/yr)';
      } else {
        roiSavingsBlock.hidden = true;
        roiNeutralMessage.hidden = false;
      }
    };

    roiVolumeSlider.addEventListener('input', () => {
      roiVolumeNumber.value = roiVolumeSlider.value;
      updateROI();
    });
    roiVolumeNumber.addEventListener('input', updateROI);
    roiCostSlider.addEventListener('input', () => {
      roiCostNumber.value = parseFloat(roiCostSlider.value).toFixed(2);
      updateROI();
    });
    roiCostNumber.addEventListener('input', updateROI);

    updateROI();
  }

});
```

- [ ] **Step 3: Re-run the pure-logic test (confirm nothing regressed)**

Run: `node Website/roi-calc.test.js`
Expected: `All roi-calc tests passed.`

- [ ] **Step 4: Verify interactively with a screenshot script**

Create a temporary script (not committed) to drive the page and confirm the live update works, e.g. using Playwright directly:

```bash
node -e "
const { chromium } = require(require.resolve('playwright', { paths: [process.env.APPDATA + '\\\\npm\\\\node_modules'] }));
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.goto('file:///' + process.argv[1].replace(/\\\\/g, '/'));
  await page.fill('#roiVolumeNumber', '2000');
  await page.fill('#roiCostNumber', '5');
  await page.dispatchEvent('#roiVolumeNumber', 'input');
  await page.dispatchEvent('#roiCostNumber', 'input');
  await page.waitForTimeout(200);
  console.log('plan:', await page.textContent('#roiPlanName'));
  console.log('fee:', await page.textContent('#roiPlanFee'));
  console.log('cost:', await page.textContent('#roiCurrentCost'));
  console.log('savings:', await page.textContent('#roiSavingsAmount'));
  await page.screenshot({ path: 'roi_interactive.png', clip: { x: 0, y: 200, width: 1280, height: 700 } });
  await browser.close();
})();
" "$(cd Website && pwd -W 2>/dev/null || pwd)/index.html"
```

Expected console output: `plan: Scale`, `fee: $599`, `cost: $10,000`, `savings: $9,401/mo` (2,000 × $5 = $10,000; Scale fee $599; savings $9,401 — matches `computeROI(2000, 5)`). Open `roi_interactive.png` and confirm the numbers visible in the screenshot match.

- [ ] **Step 5: Commit**

```bash
cd Website
git add index.html script.js
git commit -m "wire up live ROI calculator interactivity"
```

---

## Self-Review Notes

- **Spec coverage:** header copy ✓ (Task 3), calculator mechanics + plan matching ✓ (Task 2 + 4), cited stats ✓ (Task 3), CTAs ✓ (Task 3), nav label + anchor preservation ✓ (Task 1, anchor untouched throughout), no-new-tokens visual system ✓ (Task 3 CSS uses only existing custom properties), restrained motion (2 reveals) ✓ (Task 3 markup), edge-case safety net for non-positive savings ✓ (Task 4 `updateROI`), whole-dollar formatting ✓ (Task 4 `Intl.NumberFormat`), cost-per-ticket shown to nearest $0.50 ✓ (Task 4 `toFixed(2)` display / `step="0.5"` inputs).
- **Type/ID consistency checked:** every element ID referenced in Task 4's `script.js` code (`roiVolumeSlider`, `roiVolumeNumber`, `roiCostSlider`, `roiCostNumber`, `roiCurrentCost`, `roiPlanName`, `roiPlanFee`, `roiSavingsAmount`, `roiSavingsSubline`, `roiSavingsBlock`, `roiNeutralMessage`) matches exactly what Task 3's HTML defines. `computeROI`'s return object keys (`plan`, `fee`, `currentCost`, `savings`, `savingsPercent`, `annualSavings`) match between Task 2's definition, its test, and Task 4's consumption.
- **No placeholders:** every step has literal, runnable code — no "add appropriate styling" or "write tests for the above" left unfilled.
