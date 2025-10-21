export interface UserInputs {
  name: string;
  age: number;
  monthlyIncome: number;
  cityTier: 'Tier 1 (Metro)' | 'Tier 2' | 'Tier 3';
  dependents: number;
  maritalStatus: string;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  currentExpenses: number;
  existingEmergencyFund: number;
  existingTermInsurance: number;
  existingHealthInsurance: number;
  loanEMI: number;
  currentInvestments: number;
  retirementAge: number;
  epfBalance: number;
}

export interface BudgetAllocation {
  needs: number;
  wants: number;
  savings: number;
  totalIncome: number;
  currentExpenses: number;
  currentSavings: number;
  savingsRate: number;
  status: string;
}

export interface EmergencyFund {
  essentialExpenses: number;
  conservativeTarget: number;
  recommendedTarget: number;
  minimumTarget: number;
  existing: number;
  gap: number;
  completionPct: number;
  monthlyContribution12: number;
  monthlyContribution24: number;
  status: string;
}

export interface Insurance {
  term: {
    multiplier: number;
    annualIncome: number;
    method1: number;
    yearsToRetirement: number;
    method2: number;
    recommended: number;
    existing: number;
    gap: number;
    annualPremium: number;
    status: string;
  };
  health: {
    baseCover: number;
    familySize: number;
    multiplier: number;
    recommended: number;
    existing: number;
    gap: number;
    annualPremium: number;
    status: string;
  };
  totalAnnualPremium: number;
  monthlyImpact: number;
  pctOfIncome: number;
}

export interface Investment {
  baseEquityPct: number;
  riskAdjustment: number;
  finalEquityPct: number;
  finalDebtPct: number;
  recommendedSavings: number;
  emergencyFundContribution: number;
  availableForInvestment: number;
  monthlySIP: number;
  equityPortion: number;
  debtPortion: number;
}

export interface Retirement {
  currentAge: number;
  retirementAge: number;
  yearsToRetirement: number;
  currentExpenses: number;
  retirementNeed: number;
  inflationRate: number;
  futureMonthlyExpense: number;
  futureAnnualExpense: number;
  postRetirementYears: number;
  expectedReturn: number;
  realReturn: number;
  corpusNeeded: number;
  currentInvestmentsFV: number;
  epfFV: number;
  totalFV: number;
  gap: number;
  monthlySIPNeeded: number;
  sipPctOfIncome: number;
  status: string;
}

export interface HealthScore {
  savingsRate: number;
  savingsScore: number;
  efCompletion: number;
  efScore: number;
  termCoverage: number;
  healthCoverage: number;
  termScore: number;
  healthScore: number;
  insuranceScore: number;
  emiPct: number;
  debtScore: number;
  currentInvestments: number;
  expectedInvestments: number;
  investmentScore: number;
  overallScore: number;
  grade: string;
  rating: string;
}

export interface FinancialPlan {
  inputs: UserInputs;
  budget: BudgetAllocation;
  emergencyFund: EmergencyFund;
  insurance: Insurance;
  investment: Investment;
  retirement: Retirement;
  healthScore: HealthScore;
}
