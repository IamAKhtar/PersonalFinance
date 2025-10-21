import { UserInputs, BudgetAllocation, EmergencyFund, Insurance, Investment, Retirement, HealthScore } from '../types';

export function calculateBudget(inputs: UserInputs): BudgetAllocation {
  const needs = inputs.monthlyIncome * 0.50;
  const wants = inputs.monthlyIncome * 0.30;
  const savings = inputs.monthlyIncome * 0.20;

  const currentExpenses = inputs.currentExpenses + inputs.loanEMI;
  const currentSavings = inputs.monthlyIncome - currentExpenses;
  const savingsRate = (currentSavings / inputs.monthlyIncome) * 100;

  let status = '⚠ Needs Improvement';
  if (savingsRate >= 30) status = '✓ Excellent';
  else if (savingsRate >= 20) status = '✓ Good';

  return {
    needs,
    wants,
    savings,
    totalIncome: inputs.monthlyIncome,
    currentExpenses,
    currentSavings,
    savingsRate,
    status
  };
}

export function calculateEmergencyFund(inputs: UserInputs): EmergencyFund {
  const essentialExpenses = (inputs.currentExpenses * 0.7) + inputs.loanEMI;
  const conservativeTarget = essentialExpenses * 12;
  const recommendedTarget = essentialExpenses * 9;
  const minimumTarget = essentialExpenses * 6;

  const gap = Math.max(0, recommendedTarget - inputs.existingEmergencyFund);
  const completionPct = (inputs.existingEmergencyFund / recommendedTarget) * 100;

  let status = '⚠ Priority Action Needed';
  if (completionPct >= 100) status = '✓ Excellent';
  else if (completionPct >= 75) status = '✓ Good';

  return {
    essentialExpenses,
    conservativeTarget,
    recommendedTarget,
    minimumTarget,
    existing: inputs.existingEmergencyFund,
    gap,
    completionPct,
    monthlyContribution12: gap > 0 ? gap / 12 : 0,
    monthlyContribution24: gap > 0 ? gap / 24 : 0,
    status
  };
}

export function calculateInsurance(inputs: UserInputs): Insurance {
  // Term Life Insurance
  let multiplier = 20;
  if (inputs.age >= 30 && inputs.age < 35) multiplier = 18;
  else if (inputs.age >= 35 && inputs.age < 40) multiplier = 15;
  else if (inputs.age >= 40) multiplier = 12;

  const annualIncome = inputs.monthlyIncome * 12;
  const method1 = annualIncome * multiplier;

  const yearsToRetirement = inputs.retirementAge - inputs.age;
  const method2 = annualIncome * yearsToRetirement * 0.6;

  const termRecommended = (method1 + method2) / 2;
  const termGap = Math.max(0, termRecommended - inputs.existingTermInsurance);
  const termAnnualPremium = (termRecommended / 1000) * 0.5;

  let termStatus = termGap === 0 ? '✓ Adequate' : '⚠ Increase Cover';

  // Health Insurance
  let baseCover = 1000000;
  let healthMultiplier = 2.5;
  if (inputs.cityTier === 'Tier 2') {
    baseCover = 750000;
    healthMultiplier = 2.0;
  } else if (inputs.cityTier === 'Tier 3') {
    baseCover = 500000;
    healthMultiplier = 1.5;
  }

  const familySize = inputs.dependents + 1;
  const healthRecommended = baseCover * Math.min(familySize, healthMultiplier);
  const healthGap = Math.max(0, healthRecommended - inputs.existingHealthInsurance);
  const healthAnnualPremium = healthRecommended * 0.015;

  let healthStatus = healthGap === 0 ? '✓ Adequate' : '⚠ Increase Cover';

  const totalAnnualPremium = termAnnualPremium + healthAnnualPremium;
  const monthlyImpact = totalAnnualPremium / 12;
  const pctOfIncome = (monthlyImpact / inputs.monthlyIncome) * 100;

  return {
    term: {
      multiplier,
      annualIncome,
      method1,
      yearsToRetirement,
      method2,
      recommended: termRecommended,
      existing: inputs.existingTermInsurance,
      gap: termGap,
      annualPremium: termAnnualPremium,
      status: termStatus
    },
    health: {
      baseCover,
      familySize,
      multiplier: healthMultiplier,
      recommended: healthRecommended,
      existing: inputs.existingHealthInsurance,
      gap: healthGap,
      annualPremium: healthAnnualPremium,
      status: healthStatus
    },
    totalAnnualPremium,
    monthlyImpact,
    pctOfIncome
  };
}

export function calculateInvestment(inputs: UserInputs, efGap: number): Investment {
  const baseEquityPct = 100 - inputs.age;

  let riskAdjustment = 0;
  if (inputs.riskTolerance === 'Aggressive') riskAdjustment = 10;
  else if (inputs.riskTolerance === 'Conservative') riskAdjustment = -10;

  const finalEquityPct = Math.min(90, Math.max(30, baseEquityPct + riskAdjustment));
  const finalDebtPct = 100 - finalEquityPct;

  const recommendedSavings = inputs.monthlyIncome * 0.20;
  const emergencyFundContribution = efGap > 0 ? Math.min(recommendedSavings, efGap / 24) : 0;
  const availableForInvestment = recommendedSavings - emergencyFundContribution;

  const monthlySIP = availableForInvestment;
  const equityPortion = (monthlySIP * finalEquityPct) / 100;
  const debtPortion = (monthlySIP * finalDebtPct) / 100;

  return {
    baseEquityPct,
    riskAdjustment,
    finalEquityPct,
    finalDebtPct,
    recommendedSavings,
    emergencyFundContribution,
    availableForInvestment,
    monthlySIP,
    equityPortion,
    debtPortion
  };
}

export function calculateRetirement(inputs: UserInputs): Retirement {
  const yearsToRetirement = inputs.retirementAge - inputs.age;
  const retirementNeed = inputs.currentExpenses * 0.70;

  const inflationRate = 0.06;
  const futureMonthlyExpense = retirementNeed * Math.pow(1 + inflationRate, yearsToRetirement);
  const futureAnnualExpense = futureMonthlyExpense * 12;

  const postRetirementYears = 85 - inputs.retirementAge;
  const expectedReturn = 0.12;
  const realReturn = (expectedReturn - inflationRate) / (1 + inflationRate);

  const corpusNeeded = futureAnnualExpense * ((1 - Math.pow(1 + realReturn, -postRetirementYears)) / realReturn);

  const currentInvestmentsFV = inputs.currentInvestments * Math.pow(1 + expectedReturn, yearsToRetirement);
  const epfFV = inputs.epfBalance * Math.pow(1.08, yearsToRetirement);
  const totalFV = currentInvestmentsFV + epfFV;

  const gap = Math.max(0, corpusNeeded - totalFV);

  const monthlyReturn = expectedReturn / 12;
  const months = yearsToRetirement * 12;
  const monthlySIPNeeded = gap > 0 
    ? (gap * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1)
    : 0;

  const sipPctOfIncome = (monthlySIPNeeded / inputs.monthlyIncome) * 100;

  let status = gap === 0 ? '✓ On Track' : '⚠ Action Needed';

  return {
    currentAge: inputs.age,
    retirementAge: inputs.retirementAge,
    yearsToRetirement,
    currentExpenses: inputs.currentExpenses,
    retirementNeed,
    inflationRate,
    futureMonthlyExpense,
    futureAnnualExpense,
    postRetirementYears,
    expectedReturn,
    realReturn,
    corpusNeeded,
    currentInvestmentsFV,
    epfFV,
    totalFV,
    gap,
    monthlySIPNeeded,
    sipPctOfIncome,
    status
  };
}

export function calculateHealthScore(
  inputs: UserInputs,
  budget: BudgetAllocation,
  ef: EmergencyFund,
  insurance: Insurance
): HealthScore {
  // 1. Savings Rate
  const savingsScore = Math.min(100, (budget.savingsRate / 30) * 100);

  // 2. Emergency Fund
  const efScore = Math.min(100, ef.completionPct);

  // 3. Insurance
  const termCoverage = (inputs.existingTermInsurance / insurance.term.recommended) * 100;
  const healthCoverage = (inputs.existingHealthInsurance / insurance.health.recommended) * 100;
  const termScore = Math.min(100, termCoverage);
  const healthScore = Math.min(100, healthCoverage);
  const insuranceScore = (termScore + healthScore) / 2;

  // 4. Debt Management
  const emiPct = (inputs.loanEMI / inputs.monthlyIncome) * 100;
  const debtScore = Math.max(0, Math.min(100, (1 - emiPct / 40) * 100));

  // 5. Investment Portfolio
  const expectedInvestments = inputs.monthlyIncome * 12 * 2;
  const investmentScore = Math.min(100, (inputs.currentInvestments / expectedInvestments) * 100);

  // Overall Score
  const overallScore = 
    savingsScore * 0.25 +
    efScore * 0.20 +
    insuranceScore * 0.25 +
    debtScore * 0.15 +
    investmentScore * 0.15;

  let grade = 'D';
  if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 60) grade = 'B';
  else if (overallScore >= 40) grade = 'C';

  let rating = '⚠ Needs Attention';
  if (overallScore >= 80) rating = '✓ Excellent';
  else if (overallScore >= 60) rating = '✓ Good Financial Health';

  return {
    savingsRate: budget.savingsRate,
    savingsScore,
    efCompletion: ef.completionPct,
    efScore,
    termCoverage,
    healthCoverage,
    termScore,
    healthScore,
    insuranceScore,
    emiPct,
    debtScore,
    currentInvestments: inputs.currentInvestments,
    expectedInvestments,
    investmentScore,
    overallScore,
    grade,
    rating
  };
}
