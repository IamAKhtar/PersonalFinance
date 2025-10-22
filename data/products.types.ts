// data/products.types.ts
export type MutualFund = {
  id: string;
  name: string;
  amc: string;
  category: 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Flexi Cap' | 'ELSS' | 'Liquid' | 'Overnight' | 'Short Duration' | 'Corporate Bond' | 'Gilt';
  plan_type: 'Direct Growth';
  aum_cr: number;
  expense_ratio: number;
  exit_load: string;
  min_sip: number;
  returns_1y?: number;
  returns_3y?: number;
  returns_5y?: number;
  risk_band: 'Low' | 'Medium' | 'High';
  benchmark: string;
};

export type FDRate = {
  id: string;
  institution: string;
  rating_band: 'AAA' | 'AA+' | 'Government';
  tenure_min_m: number;
  tenure_max_m: number;
  rate_general: number;
  rate_senior: number;
  compounding: 'Quarterly' | 'Annual';
  premature_penalty_notes: string;
  min_amount: number;
};

export type TermInsurance = {
  id: string;
  insurer: string;
  product: string;
  claim_settlement_ratio: number;
  solvency_ratio: number;
  min_sum_insured: number;
  max_sum_insured: number;
  sample_premium_age_30_1cr: number;
  riders: string[];
};

export type HealthInsurance = {
  id: string;
  insurer: string;
  plan: string;
  sum_insured_bands: number[];
  room_rules: string;
  copay: string;
  waiting_periods: string;
  restoration: boolean;
  no_claim_bonus: string;
  portability_notes: string;
  sample_premium_family_float: number;
};

export type ProductData = {
  data_version: string;
  as_of: string;
  mutual_funds: MutualFund[];
  fd_rates: FDRate[];
  term_insurance: TermInsurance[];
  health_insurance: HealthInsurance[];
};
