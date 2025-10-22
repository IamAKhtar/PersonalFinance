// app/lib/productSelector.ts
import type { MutualFund, FDRate, TermInsurance, HealthInsurance } from '../../data/products.types';

export type SuggestedSIP = {
  fund: MutualFund;
  allocation_pct: number;
  monthly_amount: number;
  reason: string;
};

export type SuggestedParking = {
  option: MutualFund | FDRate;
  type: 'liquid_fund' | 'fd';
  allocation_pct: number;
  amount: number;
  reason: string;
};

export type SuggestedTerm = {
  policy: TermInsurance;
  reason: string;
};

export type SuggestedHealth = {
  policy: HealthInsurance;
  reason: string;
};

/**
 * Select SIP basket based on equity/debt split and risk tolerance
 */
export function selectSIPBasket(
  mutualFunds: MutualFund[],
  targetEquityPct: number,
  targetDebtPct: number,
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive',
  monthlySIP: number
): SuggestedSIP[] {
  const basket: SuggestedSIP[] = [];

  if (monthlySIP <= 0 || targetEquityPct + targetDebtPct === 0) return basket;

  // Equity allocation
  if (targetEquityPct > 0) {
    const equityAmount = Math.round((monthlySIP * targetEquityPct) / 100);

    // Core: Large Cap Index (50% of equity)
    const largeCap = mutualFunds
      .filter((f) => f.category === 'Large Cap' && f.expense_ratio < 0.2)
      .sort((a, b) => a.expense_ratio - b.expense_ratio)[0];

    if (largeCap) {
      basket.push({
        fund: largeCap,
        allocation_pct: targetEquityPct * 0.5,
        monthly_amount: Math.round(equityAmount * 0.5),
        reason: 'Core equity allocation - Low cost index fund',
      });
    }

    // Satellite: Mid/Small Cap (balance equity)
    let satelliteAmount = equityAmount - Math.round(equityAmount * 0.5);

    if (riskTolerance === 'Aggressive') {
      // 30% Mid, 20% Small
      const midCap = mutualFunds
        .filter((f) => f.category === 'Mid Cap')
        .sort((a, b) => (b.returns_3y || 0) - (a.returns_3y || 0))[0];

      const smallCap = mutualFunds
        .filter((f) => f.category === 'Small Cap')
        .sort((a, b) => (b.returns_3y || 0) - (a.returns_3y || 0))[0];

      if (midCap) {
        basket.push({
          fund: midCap,
          allocation_pct: targetEquityPct * 0.3,
          monthly_amount: Math.round(equityAmount * 0.3),
          reason: 'Satellite - Mid cap for growth',
        });
      }

      if (smallCap) {
        basket.push({
          fund: smallCap,
          allocation_pct: targetEquityPct * 0.2,
          monthly_amount: Math.round(equityAmount * 0.2),
          reason: 'Satellite - Small cap for higher growth',
        });
      }
    } else if (riskTolerance === 'Moderate') {
      // 40% Flexi or Mid, 10% Small
      const flexiOrMid = mutualFunds
        .filter((f) => f.category === 'Flexi Cap' || f.category === 'Mid Cap')
        .sort((a, b) => (b.returns_3y || 0) - (a.returns_3y || 0))[0];

      if (flexiOrMid) {
        basket.push({
          fund: flexiOrMid,
          allocation_pct: targetEquityPct * 0.4,
          monthly_amount: Math.round(equityAmount * 0.4),
          reason: 'Satellite - Balanced growth',
        });
      }

      const smallCap = mutualFunds
        .filter((f) => f.category === 'Small Cap')
        .sort((a, b) => (b.returns_3y || 0) - (a.returns_3y || 0))[0];

      if (smallCap) {
        basket.push({
          fund: smallCap,
          allocation_pct: targetEquityPct * 0.1,
          monthly_amount: Math.round(equityAmount * 0.1),
          reason: 'Satellite - Small allocation to small cap',
        });
      }
    } else {
      // Conservative: 50% Flexi Cap
      const flexi = mutualFunds
        .filter((f) => f.category === 'Flexi Cap')
        .sort((a, b) => (b.returns_5y || 0) - (a.returns_5y || 0))[0];

      if (flexi) {
        basket.push({
          fund: flexi,
          allocation_pct: targetEquityPct * 0.5,
          monthly_amount: satelliteAmount,
          reason: 'Satellite - Flexi cap for conservative equity',
        });
      }
    }
  }

  // Debt allocation
  if (targetDebtPct > 0) {
    const debtAmount = Math.round((monthlySIP * targetDebtPct) / 100);

    // Pick conservative debt based on risk
    let debtCategory: MutualFund['category'] = 'Corporate Bond';
    if (riskTolerance === 'Conservative') debtCategory = 'Short Duration';

    const debtFund = mutualFunds
      .filter((f) => f.category === debtCategory || f.category === 'Corporate Bond')
      .sort((a, b) => a.expense_ratio - b.expense_ratio)[0];

    if (debtFund) {
      basket.push({
        fund: debtFund,
        allocation_pct: targetDebtPct,
        monthly_amount: debtAmount,
        reason: `Debt allocation - ${debtFund.category}`,
      });
    }
  }

  return basket;
}

/**
 * Select emergency fund parking options
 */
export function selectParkingOptions(
  mutualFunds: MutualFund[],
  fdRates: FDRate[],
  efMonthsToReach: number,
  targetAmount: number
): SuggestedParking[] {
  const options: SuggestedParking[] = [];

  if (targetAmount <= 0) return options;

  // 50% Liquid/Overnight fund
  let liquidCategory: MutualFund['category'] = 'Liquid';
  if (efMonthsToReach <= 6) liquidCategory = 'Overnight'; // ultra-safe for short horizon

  const liquidFund = mutualFunds
    .filter((f) => f.category === liquidCategory)
    .sort((a, b) => a.expense_ratio - b.expense_ratio)[0];

  if (liquidFund) {
    options.push({
      option: liquidFund,
      type: 'liquid_fund',
      allocation_pct: 50,
      amount: Math.round(targetAmount * 0.5),
      reason: `High liquidity - ${liquidFund.category} fund`,
    });
  }

  // 50% FD (AAA or Govt)
  const safeFD = fdRates
    .filter((f) => f.rating_band === 'Government' || f.rating_band === 'AAA')
    .filter((f) => f.tenure_min_m <= 12) // prefer shorter tenure
    .sort((a, b) => b.rate_general - a.rate_general)[0];

  if (safeFD) {
    options.push({
      option: safeFD,
      type: 'fd',
      allocation_pct: 50,
      amount: Math.round(targetAmount * 0.5),
      reason: `Safe returns - ${safeFD.institution} FD`,
    });
  }

  return options;
}

/**
 * Select term insurance shortlist
 */
export function selectTermInsurance(
  termPolicies: TermInsurance[],
  recommendedCover: number
): SuggestedTerm[] {
  if (recommendedCover === 0) return [];

  // Filter policies that can cover the amount
  const eligible = termPolicies.filter((p) => p.max_sum_insured >= recommendedCover);

  // Sort by CSR desc, then solvency desc
  const sorted = eligible.sort((a, b) => {
    if (Math.abs(b.claim_settlement_ratio - a.claim_settlement_ratio) > 0.5) {
      return b.claim_settlement_ratio - a.claim_settlement_ratio;
    }
    return b.solvency_ratio - a.solvency_ratio;
  });

  // Top 3
  return sorted.slice(0, 3).map((p) => ({
    policy: p,
    reason: `CSR: ${p.claim_settlement_ratio}% | Solvency: ${p.solvency_ratio}`,
  }));
}

/**
 * Select health insurance shortlist
 */
export function selectHealthInsurance(
  healthPolicies: HealthInsurance[],
  recommendedCover: number
): SuggestedHealth[] {
  if (recommendedCover === 0) return [];

  // Filter policies that offer the required sum insured band
  const eligible = healthPolicies.filter((p) =>
    p.sum_insured_bands.some((band) => band >= recommendedCover)
  );

  // Sort by premium (lower better), then no_claim_bonus
  const sorted = eligible.sort((a, b) => a.sample_premium_family_float - b.sample_premium_family_float);

  // Top 3
  return sorted.slice(0, 3).map((p) => ({
    policy: p,
    reason: `${p.copay} | Restoration: ${p.restoration ? 'Yes' : 'No'}`,
  }));
}
