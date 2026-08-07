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
