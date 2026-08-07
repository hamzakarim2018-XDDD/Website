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
