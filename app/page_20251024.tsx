'use client';

import { useEffect, useState } from 'react';
import type { UserInputs } from './types';
import {
  calculateBudget,
  calculateEmergencyFund,
  calculateInsurance,
  calculateInvestment,
  calculateRetirement,
  calculateHealthScore,
} from './lib/calculations';
import type { MutualFund, FDRate, TermInsurance, HealthInsurance } from '../data/products.types';
import {
  selectSIPBasket,
  selectParkingOptions,
  selectTermInsurance,
  selectHealthInsurance,
  type SuggestedSIP,
  type SuggestedParking,
  type SuggestedTerm,
  type SuggestedHealth,
} from './lib/productSelector';

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Local-only types for Investments tab
type SipItem = {
  id: string;
  name: string;
  category: 'Equity' | 'Debt' | 'Gold';
  monthly: number;
  start: string;
};

type AssetItem = {
  id: string;
  bucket: 'Equity' | 'Debt' | 'Gold' | 'EPF/PPF' | 'Cash/Liquid';
  amount: number;
};

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const defaultInputs: UserInputs = {
  name: '',
  age: 30,
  monthlyIncome: 100000,
  cityTier: 'Tier 1 (Metro)',
  dependents: 2,
  maritalStatus: 'Married',
  riskTolerance: 'Moderate',
  currentExpenses: 70000,
  existingEmergencyFund: 150000,
  existingTermInsurance: 5000000,
  existingHealthInsurance: 1000000,
  loanEMI: 15000,
  currentInvestments: 500000,
  retirementAge: 60,
  epfBalance: 200000,
};

export default function Home() {
  const [inputs, setInputs] = useState<UserInputs>(defaultInputs);
  const [activeTab, setActiveTab] = useState<
    'inputs' | 'dashboard' | 'budget' | 'emergency' | 'insurance' | 'investment' | 'retirement' | 'score'
  >('inputs');
  const [calculated, setCalculated] = useState(false);

  // Emergency fund preferences
  const [efTargetType, setEfTargetType] = useState<'min' | 'rec' | 'cons'>('rec');
  const [efMonthsToReach, setEfMonthsToReach] = useState<number>(12);

  // Investments tab state
  const [sips, setSips] = useState<SipItem[]>([]);
  const [assets, setAssets] = useState<AssetItem[]>([]);

  // Product data state
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [fdRates, setFdRates] = useState<FDRate[]>([]);
  const [termPolicies, setTermPolicies] = useState<TermInsurance[]>([]);
  const [healthPolicies, setHealthPolicies] = useState<HealthInsurance[]>([]);
  const [dataAsOf, setDataAsOf] = useState<string>('');

  // Quick add form local state
  const [sipName, setSipName] = useState('');
  const [sipCat, setSipCat] = useState<SipItem['category']>('Equity');
  const [sipMonthly, setSipMonthly] = useState<number | ''>('');
  const [sipStart, setSipStart] = useState('');

  const [assetBucket, setAssetBucket] = useState<AssetItem['bucket']>('Equity');
  const [assetAmount, setAssetAmount] = useState<number | ''>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('financeInputs');
      if (saved) {
        setInputs(JSON.parse(saved));
        setCalculated(true);
      }
      const efPrefs = localStorage.getItem('efPrefs');
      if (efPrefs) {
        const p = JSON.parse(efPrefs);
        if (p.efTargetType) setEfTargetType(p.efTargetType);
        if (p.efMonthsToReach) setEfMonthsToReach(p.efMonthsToReach);
      }
      const s = localStorage.getItem('sips');
      if (s) setSips(JSON.parse(s));
      const a = localStorage.getItem('assets');
      if (a) setAssets(JSON.parse(a));
    } catch {}
  }, []);

  // Load product data
  useEffect(() => {
    Promise.all([
      fetch('/data/mutual_funds.json').then((r) => r.json()),
      fetch('/data/fd_rates.json').then((r) => r.json()),
      fetch('/data/term_insurance.json').then((r) => r.json()),
      fetch('/data/health_insurance.json').then((r) => r.json()),
    ])
      .then(([mfData, fdData, termData, healthData]) => {
        setMutualFunds(mfData.mutual_funds || []);
        setFdRates(fdData.fd_rates || []);
        setTermPolicies(termData.term_insurance || []);
        setHealthPolicies(healthData.health_insurance || []);
        setDataAsOf(mfData.as_of || '');
      })
      .catch((err) => console.error('Failed to load product data:', err));
  }, []);

  useEffect(() => {
    if (calculated) {
      localStorage.setItem('efPrefs', JSON.stringify({ efTargetType, efMonthsToReach }));
    }
  }, [efTargetType, efMonthsToReach, calculated]);

  useEffect(() => {
    localStorage.setItem('sips', JSON.stringify(sips));
  }, [sips]);

  useEffect(() => {
    localStorage.setItem('assets', JSON.stringify(assets));
  }, [assets]);

  const handleSave = () => {
    localStorage.setItem('financeInputs', JSON.stringify(inputs));
    setCalculated(true);
    setActiveTab('dashboard');
  };

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  // Core calculations
  const budget = calculated ? calculateBudget(inputs) : null;
  const ef = calculated ? calculateEmergencyFund(inputs) : null;
  const insurance = calculated ? calculateInsurance(inputs) : null;
  const investment = calculated && ef ? calculateInvestment(inputs, ef.gap) : null;
  const retirement = calculated ? calculateRetirement(inputs) : null;
  const healthScore =
    calculated && budget && ef && insurance ? calculateHealthScore(inputs, budget, ef, insurance) : null;

  // EF dynamic selection values
  const selectedEfTarget = !ef
    ? 0
    : efTargetType === 'cons'
    ? ef.conservativeTarget
    : efTargetType === 'min'
    ? ef.minimumTarget
    : ef.recommendedTarget;

  const selectedEfGap = Math.max(0, selectedEfTarget - (ef ? ef.existing : 0));
  const selectedEfMonthly = efMonthsToReach > 0 ? Math.ceil(selectedEfGap / efMonthsToReach) : 0;

  // Investments helpers
  const totalSipOutflow = sips.reduce((sum, r) => sum + (r.monthly || 0), 0);
  const recommendedSavings = investment?.recommendedSavings ?? 0;
  const insuranceMonthly = insurance?.monthlyImpact ?? 0;
  const budgetSavings = budget?.currentSavings ?? 0;
  const netAvailable = Math.max(0, budgetSavings - selectedEfMonthly - insuranceMonthly - totalSipOutflow);
  const suggestedNewSip = netAvailable;

  // Assets allocation
  const totals = assets.reduce(
    (acc, a) => {
      if (a.bucket === 'Equity') acc.eq += a.amount;
      else if (a.bucket === 'Debt') acc.debt += a.amount;
      else if (a.bucket === 'Gold') acc.gold += a.amount;
      else if (a.bucket === 'EPF/PPF') acc.debt += a.amount;
      else if (a.bucket === 'Cash/Liquid') acc.debt += a.amount;
      return acc;
    },
    { eq: 0, debt: 0, gold: 0 }
  );
  const totalAssetsForAlloc = totals.eq + totals.debt + totals.gold || 1;
  const curEqPct = (totals.eq / totalAssetsForAlloc) * 100;
  const curDebtPct = (totals.debt / totalAssetsForAlloc) * 100;
  const targetEq = investment?.finalEquityPct ?? 0;
  const targetDebt = investment?.finalDebtPct ?? 0;
  const needMoreEquity = targetEq > curEqPct;
  const needMoreDebt = targetDebt > curDebtPct;

  // Product suggestions
  const suggestedSIPs: SuggestedSIP[] =
    calculated && investment && mutualFunds.length > 0 && suggestedNewSip > 0
      ? selectSIPBasket(mutualFunds, investment.finalEquityPct, investment.finalDebtPct, inputs.riskTolerance, suggestedNewSip)
      : [];

  const suggestedParking: SuggestedParking[] =
    calculated && ef && mutualFunds.length > 0 && fdRates.length > 0 && selectedEfGap > 0
      ? selectParkingOptions(mutualFunds, fdRates, efMonthsToReach, selectedEfTarget)
      : [];

  const suggestedTerm: SuggestedTerm[] =
    calculated && insurance && termPolicies.length > 0 && insurance.term.gap > 0
      ? selectTermInsurance(termPolicies, insurance.term.recommended)
      : [];

  const suggestedHealth: SuggestedHealth[] =
    calculated && insurance && healthPolicies.length > 0 && insurance.health.gap > 0
      ? selectHealthInsurance(healthPolicies, insurance.health.recommended)
      : [];

  // Add/remove handlers
  const addSip = () => {
    if (!sipName.trim() || !sipMonthly || sipMonthly <= 0) return;
    setSips([...sips, { id: uid(), name: sipName.trim(), category: sipCat, monthly: Number(sipMonthly), start: sipStart || '' }]);
    setSipName('');
    setSipMonthly('');
    setSipStart('');
  };
  const removeSip = (id: string) => setSips(sips.filter((x) => x.id !== id));

  const addAsset = () => {
    if (!assetAmount || assetAmount <= 0) return;
    setAssets([...assets, { id: uid(), bucket: assetBucket, amount: Number(assetAmount) }]);
    setAssetAmount('');
  };
  const removeAsset = (id: string) => setAssets(assets.filter((x) => x.id !== id));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header-brand shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">💰 Personal Finance Planner for India</h1>
          <p className="text-blue-100 mt-1">Comprehensive financial planning for Indian families</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'inputs', label: '📝 Inputs' },
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'budget', label: '💵 Budget' },
              { id: 'emergency', label: '🆘 Emergency Fund' },
              { id: 'insurance', label: '🛡️ Insurance' },
              { id: 'investment', label: '📈 Investments' },
              { id: 'retirement', label: '🏖️ Retirement' },
              { id: 'score', label: '⭐ Health Score' },
            ].map((tab) => {
              const id = tab.id as typeof activeTab;
              const base = 'py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap';
              const on = 'border-brand-primary text-brand-primary';
              const off = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
              return (
                <button key={tab.id} onClick={() => setActiveTab(id)} className={cn(base, activeTab === id ? on : off)}>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* FIRST PART ENDS HERE - CONTINUE TO PART 2 */}
        {/* Inputs */}
        {activeTab === 'inputs' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="label">Name</label><input className="field" value={inputs.name} onChange={(e) => setInputs({ ...inputs, name: e.target.value })} /></div>
              <div><label className="label">Age</label><input type="number" className="field" value={inputs.age} onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })} /></div>

              <div><label className="label">Monthly Income (Post-tax)</label><input type="number" className="field" value={inputs.monthlyIncome} onChange={(e) => setInputs({ ...inputs, monthlyIncome: Number(e.target.value) })} /></div>
              <div>
                <label className="label">City Tier</label>
                <select className="field" value={inputs.cityTier} onChange={(e) => setInputs({ ...inputs, cityTier: e.target.value as any })}>
                  <option>Tier 1 (Metro)</option><option>Tier 2</option><option>Tier 3</option>
                </select>
              </div>

              <div><label className="label">Number of Dependents</label><input type="number" className="field" value={inputs.dependents} onChange={(e) => setInputs({ ...inputs, dependents: Number(e.target.value) })} /></div>
              <div>
                <label className="label">Risk Tolerance</label>
                <select className="field" value={inputs.riskTolerance} onChange={(e) => setInputs({ ...inputs, riskTolerance: e.target.value as any })}>
                  <option>Conservative</option><option>Moderate</option><option>Aggressive</option>
                </select>
              </div>

              <div><label className="label">Current Monthly Expenses</label><input type="number" className="field" value={inputs.currentExpenses} onChange={(e) => setInputs({ ...inputs, currentExpenses: Number(e.target.value) })} /></div>
              <div><label className="label">Existing Emergency Fund</label><input type="number" className="field" value={inputs.existingEmergencyFund} onChange={(e) => setInputs({ ...inputs, existingEmergencyFund: Number(e.target.value) })} /></div>

              <div><label className="label">Existing Term Insurance Cover</label><input type="number" className="field" value={inputs.existingTermInsurance} onChange={(e) => setInputs({ ...inputs, existingTermInsurance: Number(e.target.value) })} /></div>
              <div><label className="label">Existing Health Insurance Cover</label><input type="number" className="field" value={inputs.existingHealthInsurance} onChange={(e) => setInputs({ ...inputs, existingHealthInsurance: Number(e.target.value) })} /></div>

              <div><label className="label">Outstanding Loans (EMI / month)</label><input type="number" className="field" value={inputs.loanEMI} onChange={(e) => setInputs({ ...inputs, loanEMI: Number(e.target.value) })} /></div>
              <div><label className="label">Current Investments Value</label><input type="number" className="field" value={inputs.currentInvestments} onChange={(e) => setInputs({ ...inputs, currentInvestments: Number(e.target.value) })} /></div>

              <div><label className="label">Retirement Age Goal</label><input type="number" className="field" value={inputs.retirementAge} onChange={(e) => setInputs({ ...inputs, retirementAge: Number(e.target.value) })} /></div>
              <div><label className="label">Current PF/EPF Balance</label><input type="number" className="field" value={inputs.epfBalance} onChange={(e) => setInputs({ ...inputs, epfBalance: Number(e.target.value) })} /></div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Want a detailed breakdown? <button className="text-brand-primary underline" onClick={() => setActiveTab('investment')}>Add your SIPs and asset buckets →</button>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={handleSave} className="btn-primary px-8 py-3">Calculate Financial Plan</button>
              <button onClick={() => setInputs(defaultInputs)} className="btn-ghost px-8 py-3">Reset</button>
            </div>
          </div>
        )}

        {/* Dashboard */}
        {activeTab === 'dashboard' && calculated && budget && ef && insurance && healthScore && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-info rounded-xl p-6 shadow-lg">
                <div className="text-sm opacity-90">Savings Rate</div>
                <div className="text-3xl font-bold mt-2">{budget.savingsRate.toFixed(1)}%</div>
                <div className="text-sm mt-2">{budget.status}</div>
              </div>

              <div className={cn(ef.completionPct >= 75 ? 'card-success' : 'card-warn', 'rounded-xl p-6 shadow-lg')}>
                <div className="text-sm opacity-90">Emergency Fund</div>
                <div className="text-3xl font-bold mt-2">{ef.completionPct.toFixed(0)}%</div>
                <div className="text-sm mt-2">{ef.status}</div>
              </div>

              <div className={cn(insurance.term.gap + insurance.health.gap > 0 ? 'card-warn' : 'card-success', 'rounded-xl p-6 shadow-lg')}>
                <div className="text-sm opacity-90">Insurance Gap</div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(insurance.term.gap + insurance.health.gap)}</div>
                <div className="text-sm mt-2">To be filled</div>
              </div>

              <div className={cn(
                healthScore.overallScore >= 80 ? 'card-success' :
                healthScore.overallScore >= 60 ? 'card-info' : 'card-warn',
                'rounded-xl p-6 shadow-lg'
              )}>
                <div className="text-sm opacity-90">Health Score</div>
                <div className="text-3xl font-bold mt-2">{healthScore.overallScore.toFixed(0)}/100</div>
                <div className="text-sm mt-2">Grade: {healthScore.grade}</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Improve accuracy: <button className="text-brand-primary underline" onClick={() => setActiveTab('investment')}>add your current SIPs and assets →</button>
            </div>
          </div>
        )}

        {/* Budget */}
        {activeTab === 'budget' && calculated && budget && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Allocation Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between mb-1"><span>Needs (50%)</span><span className="font-medium">{formatCurrency(budget.needs)}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }} /></div>

                <div className="flex justify-between mb-1 mt-4"><span>Wants (30%)</span><span className="font-medium">{formatCurrency(budget.wants)}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }} /></div>

                <div className="flex justify-between mb-1 mt-4"><span>Savings (20%)</span><span className="font-medium">{formatCurrency(budget.savings)}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{ width: '20%' }} /></div>
              </div>

              <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between"><span>Total Monthly Income</span><span className="font-medium">{formatCurrency(budget.totalIncome)}</span></div>
                <div className="flex justify-between"><span>Current Expenses + EMI</span><span className="font-medium">{formatCurrency(budget.currentExpenses)}</span></div>
                <div className="flex justify-between"><span>Current Savings</span><span className="font-medium">{formatCurrency(budget.currentSavings)}</span></div>
                <div className="flex justify-between border-t pt-2"><span className="font-semibold">Savings Rate</span><span className="font-bold text-lg">{budget.savingsRate.toFixed(1)}%</span></div>
                <div className={cn('text-sm', budget.status.indexOf('✓') >= 0 ? 'text-green-600' : 'text-orange-600')}>{budget.status}</div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Fund */}
        {activeTab === 'emergency' && calculated && ef && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Fund Planning</h2>

            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Time to reach:</span>
                <select value={efMonthsToReach} onChange={(e) => setEfMonthsToReach(parseInt(e.target.value))} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary">
                  <option value={6}>6 months</option>
                  <option value={9}>9 months</option>
                  <option value={12}>12 months</option>
                  <option value={18}>18 months</option>
                  <option value={24}>24 months</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-700"><strong>Essential Monthly Expenses:</strong> {formatCurrency(ef.essentialExpenses)}<br /><span className="text-xs">(70% of expenses + EMI)</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" role="tablist" aria-label="Emergency fund target selection">
              <button type="button" role="tab" aria-selected={efTargetType === 'cons'} onClick={() => setEfTargetType('cons')} className={cn('w-full text-left p-4 rounded-lg bg-white border transition-shadow focus:outline-none focus:ring-2', efTargetType === 'cons' ? 'border-brand-primary ring-brand-primary/30 shadow-md' : 'border-gray-200 hover:border-brand-primary/60 hover:shadow-sm')}>
                <div className="text-sm text-gray-600">Conservative (12 mo)</div>
                <div className="text-xl font-bold mt-2">{formatCurrency(ef.conservativeTarget)}</div>
              </button>

              <button type="button" role="tab" aria-selected={efTargetType === 'rec'} onClick={() => setEfTargetType('rec')} className={cn('w-full text-left p-4 rounded-lg bg-white border transition-shadow focus:outline-none focus:ring-2', efTargetType === 'rec' ? 'border-brand-primary ring-brand-primary/30 shadow-md' : 'border-gray-200 hover:border-brand-primary/60 hover:shadow-sm')}>
                <div className="text-sm text-gray-600">Recommended (9 mo)</div>
                <div className="text-xl font-bold mt-2">{formatCurrency(ef.recommendedTarget)}</div>
              </button>

              <button type="button" role="tab" aria-selected={efTargetType === 'min'} onClick={() => setEfTargetType('min')} className={cn('w-full text-left p-4 rounded-lg bg-white border transition-shadow focus:outline-none focus:ring-2', efTargetType === 'min' ? 'border-brand-primary ring-brand-primary/30 shadow-md' : 'border-gray-200 hover:border-brand-primary/60 hover:shadow-sm')}>
                <div className="text-sm text-gray-600">Minimum (6 mo)</div>
                <div className="text-xl font-bold mt-2">{formatCurrency(ef.minimumTarget)}</div>
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center"><span className="font-medium">Your Existing Emergency Fund</span><span className="text-lg font-bold">{formatCurrency(ef.existing)}</span></div>
              <div className="flex justify-between items-center"><span className="font-medium">Gap to Fill (Selected Target)</span><span className="text-lg font-bold text-orange-600">{formatCurrency(selectedEfGap)}</span></div>
              <div>
                <div className="flex justify-between mb-2"><span>Completion (vs. Recommended 9 mo)</span><span className="font-bold">{ef.completionPct.toFixed(1)}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-4"><div className={cn('h-4 rounded-full', ef.completionPct >= 75 ? 'bg-green-500' : 'bg-orange-500')} style={{ width: `${Math.min(100, ef.completionPct)}%` }} /></div>
                <div className="text-sm text-right mt-1">{ef.status}</div>
              </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Selected Target</div><div className="text-xl font-bold mt-1">{efTargetType === 'min' ? 'Minimum (6 mo)' : efTargetType === 'cons' ? 'Conservative (12 mo)' : 'Recommended (9 mo)'}</div><div className="text-sm text-gray-600 mt-1">Amount: {formatCurrency(selectedEfTarget)}</div></div>
              <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Gap to Fill</div><div className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(selectedEfGap)}</div></div>
              <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded-lg"><div className="text-sm text-blue-700 font-medium">Monthly to reach in {efMonthsToReach} months</div><div className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(selectedEfMonthly)}</div></div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Parking Strategy (for full target)</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 50% in Savings Account ({formatCurrency(ef.recommendedTarget * 0.5)})</li>
                <li>• 50% in Liquid Mutual Funds ({formatCurrency(ef.recommendedTarget * 0.5)})</li>
              </ul>
            </div>

            {/* Suggested Parking Options */}
            {suggestedParking.length > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">💡 Suggested Parking Options</h3>
                  <span className="text-xs text-gray-500">Data as of {dataAsOf}</span>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4 text-xs text-yellow-800">
                  <strong>Disclaimer:</strong> Curated options for reference. Not financial advice. Verify rates and terms before investing.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedParking.map((p, i) => (
                    <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold">
                            {p.type === 'liquid_fund' ? (p.option as MutualFund).name : (p.option as FDRate).institution}
                          </div>
                          <div className="text-xs text-gray-500">
                            {p.type === 'liquid_fund' ? (p.option as MutualFund).amc : `FD - ${(p.option as FDRate).rating_band}`}
                          </div>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{p.allocation_pct}%</span>
                      </div>
                      
                      <div className="text-2xl font-bold text-brand-primary mb-2">{formatCurrency(p.amount)}</div>
                      
                      <div className="text-xs text-gray-600 mb-2">{p.reason}</div>
                      
                      {p.type === 'liquid_fund' && (
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Expense Ratio: {(p.option as MutualFund).expense_ratio}%</div>
                          <div>1Y Return: {(p.option as MutualFund).returns_1y?.toFixed(1)}%</div>
                          <div>Min SIP: ₹{(p.option as MutualFund).min_sip.toLocaleString()}</div>
                        </div>
                      )}
                      
                      {p.type === 'fd' && (
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Rate: {(p.option as FDRate).rate_general}% (General)</div>
                          <div>Senior: {(p.option as FDRate).rate_senior}%</div>
                          <div>Tenure: {(p.option as FDRate).tenure_min_m}-{(p.option as FDRate).tenure_max_m} months</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTINUE IN PAGE-PART3.tsx for Insurance, Investment, Retirement, Score tabs and closing */}
      </main>
    </div>
  );
}
        {/* Insurance */}
        {activeTab === 'insurance' && calculated && insurance && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Insurance Planning</h2>
            <div className="space-y-8">
              {/* Term Life */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-900">Term Life Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Method 1: Income Replacement</div><div className="text-lg font-bold">{formatCurrency(insurance.term.method1)}</div><div className="text-xs text-gray-500">{insurance.term.multiplier}x annual income</div></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Method 2: Human Life Value</div><div className="text-lg font-bold">{formatCurrency(insurance.term.method2)}</div><div className="text-xs text-gray-500">{insurance.term.yearsToRetirement} years to retirement</div></div>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-500 p-6 rounded-lg">
                    <div className="text-sm text-blue-700 font-medium">RECOMMENDED COVER</div>
                    <div className="text-3xl font-bold text-blue-900 mt-2">{formatCurrency(insurance.term.recommended)}</div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span>Your Existing Cover</span><span className="font-medium">{formatCurrency(insurance.term.existing)}</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Gap to Fill</span><span className="font-bold text-orange-600">{formatCurrency(insurance.term.gap)}</span></div>
                      <div className="flex justify-between border-t pt-2"><span>Est. Annual Premium</span><span className="font-medium">{formatCurrency(insurance.term.annualPremium)}</span></div>
                      <div className={cn('text-center py-2 rounded', insurance.term.status.indexOf('✓') >= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')}>{insurance.term.status}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Term Insurance */}
              {suggestedTerm.length > 0 && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">💡 Suggested Term Insurance Shortlist</h3>
                    <span className="text-xs text-gray-500">Data as of {dataAsOf}</span>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4 text-xs text-yellow-800">
                    <strong>Disclaimer:</strong> Sample policies for reference. Premiums vary by age, health, lifestyle. Not financial advice. Compare quotes from multiple insurers.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {suggestedTerm.map((t, i) => (
                      <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="font-semibold text-lg mb-1">{t.policy.insurer}</div>
                        <div className="text-sm text-gray-600 mb-3">{t.policy.product}</div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Claim Settlement:</span>
                            <span className="font-bold text-green-600">{t.policy.claim_settlement_ratio}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Solvency Ratio:</span>
                            <span className="font-medium">{t.policy.solvency_ratio}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Max Cover:</span>
                            <span className="font-medium">{formatCurrency(t.policy.max_sum_insured)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-gray-500">Sample Premium (Age 30, ₹1 Cr)</div>
                          <div className="text-xl font-bold text-brand-primary">{formatCurrency(t.policy.sample_premium_age_30_1cr)}/year</div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">{t.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Health */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-4 text-green-900">Health Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Base Cover per Person ({inputs.cityTier})</div><div className="text-lg font-bold">{formatCurrency(insurance.health.baseCover)}</div></div>
                    <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Family Size</div><div className="text-lg font-bold">{insurance.health.familySize} members</div><div className="text-xs text-gray-500">Multiplier: {insurance.health.multiplier}x</div></div>
                  </div>
                  <div className="bg-green-50 border-2 border-green-500 p-6 rounded-lg">
                    <div className="text-sm text-green-700 font-medium">RECOMMENDED COVER</div>
                    <div className="text-3xl font-bold text-green-900 mt-2">{formatCurrency(insurance.health.recommended)}</div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span>Your Existing Cover</span><span className="font-medium">{formatCurrency(insurance.health.existing)}</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Gap to Fill</span><span className="font-bold text-orange-600">{formatCurrency(insurance.health.gap)}</span></div>
                      <div className="flex justify-between border-t pt-2"><span>Est. Annual Premium</span><span className="font-medium">{formatCurrency(insurance.health.annualPremium)}</span></div>
                      <div className={cn('text-center py-2 rounded', insurance.health.status.indexOf('✓') >= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')}>{insurance.health.status}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Health Insurance */}
              {suggestedHealth.length > 0 && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">💡 Suggested Health Insurance Shortlist</h3>
                    <span className="text-xs text-gray-500">Data as of {dataAsOf}</span>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4 text-xs text-yellow-800">
                    <strong>Disclaimer:</strong> Sample policies for reference. Premiums vary by age, family size, city. Not financial advice. Compare multiple quotes.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {suggestedHealth.map((h, i) => (
                      <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="font-semibold text-lg mb-1">{h.policy.insurer}</div>
                        <div className="text-sm text-gray-600 mb-3">{h.policy.plan}</div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">Sum Insured Bands:</span>
                            <div className="text-xs text-gray-500 mt-1">
                              {h.policy.sum_insured_bands.map((b) => formatCurrency(b)).join(', ')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Room:</span>
                            <span className="ml-2 text-xs">{h.policy.room_rules}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Restoration:</span>
                            <span className="ml-2 font-medium">{h.policy.restoration ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs text-gray-500">Sample Premium (Family Floater)</div>
                          <div className="text-xl font-bold text-brand-primary">{formatCurrency(h.policy.sample_premium_family_float)}/year</div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">{h.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="border-t pt-6 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Total Insurance Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center"><div className="text-sm text-gray-600">Total Annual Premium</div><div className="text-2xl font-bold">{formatCurrency(insurance.totalAnnualPremium)}</div></div>
                  <div className="text-center"><div className="text-sm text-gray-600">Monthly Impact</div><div className="text-2xl font-bold">{formatCurrency(insurance.monthlyImpact)}</div></div>
                  <div className="text-center"><div className="text-sm text-gray-600">% of Income</div><div className="text-2xl font-bold">{insurance.pctOfIncome.toFixed(1)}%</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment */}
        {activeTab === 'investment' && calculated && investment && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Allocation Strategy</h2>

            <div className="text-xs text-gray-600 mb-3">Baseline from Inputs — Investments: {formatCurrency(inputs.currentInvestments)} • EPF: {formatCurrency(inputs.epfBalance)}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Base Equity % (100 - Age)</div><div className="text-lg font-bold">{investment.baseEquityPct}%</div></div>
                <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Risk Adjustment ({inputs.riskTolerance})</div><div className="text-lg font-bold">{investment.riskAdjustment > 0 ? '+' : ''}{investment.riskAdjustment}%</div></div>
              </div>

              <div className="card-info p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div><div className="text-sm opacity-90">Equity</div><div className="text-3xl font-bold">{investment.finalEquityPct.toFixed(0)}%</div></div>
                  <div><div className="text-sm opacity-90">Debt</div><div className="text-3xl font-bold">{investment.finalDebtPct.toFixed(0)}%</div></div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Recommended Savings (20%)</div><div className="text-xl font-bold">{formatCurrency(recommendedSavings)}</div></div>
              <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Your Current SIP Outflow</div><div className="text-xl font-bold">{formatCurrency(totalSipOutflow)}</div></div>
              <div className={cn('p-4 rounded-lg', netAvailable > 0 ? 'bg-green-50' : 'bg-orange-50')}>
                <div className={cn('text-sm', netAvailable > 0 ? 'text-green-700' : 'text-orange-700')}>Available for Investment (net)</div>
                <div className={cn('text-xl font-bold', netAvailable > 0 ? 'text-green-700' : 'text-orange-700')}>{formatCurrency(netAvailable)}</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded-lg"><div className="text-sm text-blue-700 font-medium">Suggested Monthly SIP (new money)</div><div className="text-xl font-bold text-blue-700">{formatCurrency(suggestedNewSip)}</div></div>
            </div>

            <div className="text-xs text-gray-500 mt-2">Net = Budget savings − EF monthly − Insurance monthly − Current SIPs ({formatCurrency(budgetSavings)} − {formatCurrency(selectedEfMonthly)} − {formatCurrency(insuranceMonthly)} − {formatCurrency(totalSipOutflow)})</div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Your Current SIPs</h3>

              <div className="bg-white border rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input placeholder="Scheme / Purpose" className="field" value={sipName} onChange={(e) => setSipName(e.target.value)} />
                  <select className="field" value={sipCat} onChange={(e) => setSipCat(e.target.value as SipItem['category'])}>
                    <option>Equity</option><option>Debt</option><option>Gold</option>
                  </select>
                  <input type="number" placeholder="Monthly ₹" className="field" value={sipMonthly} onChange={(e) => setSipMonthly(e.target.value === '' ? '' : Number(e.target.value))} />
                  <input type="month" className="field" value={sipStart} onChange={(e) => setSipStart(e.target.value)} />
                  <button className="btn-primary" onClick={addSip}>Add SIP</button>
                </div>
              </div>

              <div className="overflow-auto rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Category</th><th className="text-right p-3">Monthly</th><th className="text-left p-3">Start</th><th className="p-3"></th></tr>
                  </thead>
                  <tbody>
                    {sips.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="p-3">{r.name}</td>
                        <td className="p-3">{r.category}</td>
                        <td className="p-3 text-right">{formatCurrency(r.monthly)}</td>
                        <td className="p-3">{r.start || '-'}</td>
                        <td className="p-3 text-right"><button className="btn-ghost" onClick={() => removeSip(r.id)}>Remove</button></td>
                      </tr>
                    ))}
                    {sips.length === 0 && (<tr><td className="p-4 text-gray-500" colSpan={5}>No SIPs added yet</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Your Existing Assets</h3>

              <div className="bg-white border rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select className="field" value={assetBucket} onChange={(e) => setAssetBucket(e.target.value as AssetItem['bucket'])}>
                    <option>Equity</option><option>Debt</option><option>Gold</option><option>EPF/PPF</option><option>Cash/Liquid</option>
                  </select>
                  <input type="number" placeholder="Amount ₹" className="field" value={assetAmount} onChange={(e) => setAssetAmount(e.target.value === '' ? '' : Number(e.target.value))} />
                  <div className="md:col-span-1" />
                  <button className="btn-primary" onClick={addAsset}>Add Asset</button>
                </div>
              </div>

              <div className="overflow-auto rounded-lg border mb-4">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr><th className="text-left p-3">Bucket</th><th className="text-right p-3">Amount</th><th className="p-3"></th></tr>
                  </thead>
                  <tbody>
                    {assets.map((a) => (
                      <tr key={a.id} className="border-t">
                        <td className="p-3">{a.bucket}</td>
                        <td className="p-3 text-right">{formatCurrency(a.amount)}</td>
                        <td className="p-3 text-right"><button className="btn-ghost" onClick={() => removeAsset(a.id)}>Remove</button></td>
                      </tr>
                    ))}
                    {assets.length === 0 && (<tr><td className="p-4 text-gray-500" colSpan={3}>No assets added yet</td></tr>)}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Current Allocation</div><div className="mt-2 text-sm">Equity: {curEqPct.toFixed(1)}% • Debt+Cash+EPF: {curDebtPct.toFixed(1)}% • Gold: {(100 - curEqPct - curDebtPct).toFixed(1)}%</div></div>
                <div className="bg-blue-50 p-4 rounded-lg"><div className="text-sm text-blue-700 font-medium">Target Allocation</div><div className="mt-2 text-sm">Equity: {targetEq.toFixed(0)}% • Debt: {targetDebt.toFixed(0)}%</div></div>
                <div className="bg-green-50 p-4 rounded-lg"><div className="text-sm text-green-700 font-medium">New Money Guidance</div><div className="mt-2 text-sm">{needMoreEquity && (<div>• Direct most fresh SIPs to Equity until ~{targetEq.toFixed(0)}%</div>)}{needMoreDebt && (<div>• Add to Debt/PPF/EPF until ~{targetDebt.toFixed(0)}%</div>)}{!needMoreEquity && !needMoreDebt && (<div>• Allocation on target — split new money by target weights</div>)}</div></div>
              </div>
            </div>

            {/* Suggested SIP Basket */}
            {suggestedSIPs.length > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">💡 Suggested SIP Basket</h3>
                  <span className="text-xs text-gray-500">Data as of {dataAsOf}</span>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4 text-xs text-yellow-800">
                  <strong>Disclaimer:</strong> These are curated suggestions for educational purposes only. Not financial advice. Verify details with fund houses before investing.
                </div>

                <div className="overflow-auto rounded-lg border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="text-left p-3">Fund Name</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-right p-3">Allocation %</th>
                        <th className="text-right p-3">Monthly ₹</th>
                        <th className="text-left p-3">Reason</th>
                        <th className="text-right p-3">Expense Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestedSIPs.map((s, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium">{s.fund.name}</div>
                            <div className="text-xs text-gray-500">{s.fund.amc}</div>
                          </td>
                          <td className="p-3">{s.fund.category}</td>
                          <td className="p-3 text-right font-medium">{s.allocation_pct.toFixed(1)}%</td>
                          <td className="p-3 text-right font-bold">{formatCurrency(s.monthly_amount)}</td>
                          <td className="p-3 text-sm text-gray-600">{s.reason}</td>
                          <td className="p-3 text-right text-xs">{s.fund.expense_ratio}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>• All schemes are Direct Growth plans</p>
                  <p>• Past returns are not indicative of future performance</p>
                  <p>• Check latest NAV, expense ratio, and exit loads on AMC websites</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Retirement */}
        {activeTab === 'retirement' && calculated && retirement && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Retirement Planning</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center"><div className="text-sm text-gray-600">Current Age</div><div className="text-2xl font-bold">{retirement.currentAge} years</div></div>
              <div className="bg-blue-50 p-4 rounded-lg text-center"><div className="text-sm text-blue-700">Retirement Age</div><div className="text-2xl font-bold text-blue-700">{retirement.retirementAge} years</div></div>
              <div className="bg-gray-50 p-4 rounded-lg text-center"><div className="text-sm text-gray-600">Years to Retirement</div><div className="text-2xl font-bold">{retirement.yearsToRetirement} years</div></div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Current Monthly Expenses</div><div className="text-lg font-bold">{formatCurrency(retirement.currentExpenses)}</div></div>
                <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Monthly Need at Retirement (inflated)</div><div className="text-lg font-bold">{formatCurrency(retirement.futureMonthlyExpense)}</div><div className="text-xs text-gray-500">At 6% inflation for {retirement.yearsToRetirement} years</div></div>
                <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Expected Years in Retirement</div><div className="text-lg font-bold">{retirement.postRetirementYears} years</div><div className="text-xs text-gray-500">Assuming life expectancy of 85 years</div></div>
              </div>

              <div className="card-warn p-6 rounded-lg"><div className="text-sm opacity-90">CORPUS NEEDED AT RETIREMENT</div><div className="text-4xl font-bold mt-4">{formatCurrency(retirement.corpusNeeded)}</div><div className="text-xs opacity-90 mt-2">Annual Expense: {formatCurrency(retirement.futureAnnualExpense)}</div></div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg"><div className="text-sm text-blue-700">Current Investments (FV)</div><div className="text-xl font-bold text-blue-700">{formatCurrency(retirement.currentInvestmentsFV)}</div></div>
              <div className="bg-green-50 p-4 rounded-lg"><div className="text-sm text-green-700">EPF Balance (FV)</div><div className="text-xl font-bold text-green-700">{formatCurrency(retirement.epfFV)}</div></div>
              <div className="bg-purple-50 p-4 rounded-lg"><div className="text-sm text-purple-700">Total Future Value</div><div className="text-xl font-bold text-purple-700">{formatCurrency(retirement.totalFV)}</div></div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Corpus Needed</div><div className="text-xl font-bold">{formatCurrency(retirement.corpusNeeded)}</div></div>
              <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-600">Existing Assets (FV)</div><div className="text-xl font-bold">{formatCurrency(retirement.totalFV)}</div></div>
              <div className={cn('p-4 rounded-lg', retirement.gap === 0 ? 'bg-green-100' : 'bg-orange-100')}>
                <div className={cn('text-sm', retirement.gap === 0 ? 'text-green-700' : 'text-orange-700')}>Gap to Fill</div>
                <div className={cn('text-xl font-bold', retirement.gap === 0 ? 'text-green-700' : 'text-orange-700')}>{formatCurrency(retirement.gap)}</div>
                <div className="text-xs mt-1">{retirement.status}</div>
              </div>
            </div>

            <div className="border-t pt-6 card-info p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-4">Monthly SIP Required</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><div className="text-sm opacity-90">To achieve retirement corpus</div><div className="text-4xl font-bold mt-2">{formatCurrency(retirement.monthlySIPNeeded)}</div></div>
                <div><div className="text-sm opacity-90">As % of current income</div><div className="text-4xl font-bold mt-2">{retirement.sipPctOfIncome.toFixed(1)}%</div><div className={cn('text-sm mt-2 px-3 py-1 rounded inline-block', retirement.sipPctOfIncome <= 15 ? 'bg-green-500' : 'bg-orange-500')}>{retirement.sipPctOfIncome <= 15 ? '✓ Good' : '⚠ Increase Savings'}</div></div>
              </div>
            </div>
          </div>
        )}

        {/* Health Score */}
        {activeTab === 'score' && calculated && healthScore && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Health Scorecard</h2>

            <div className="card-info text-center p-8 rounded-xl mb-8">
              <div className="text-lg opacity-90">Your Financial Health Score</div>
              <div className="text-7xl font-bold my-4">{healthScore.overallScore.toFixed(0)}</div>
              <div className="text-2xl font-semibold">Grade: {healthScore.grade}</div>
              <div className="text-lg mt-2 opacity-90">{healthScore.rating}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScoreCard title="1. Savings Rate (25%)" score={healthScore.savingsScore} subtitle={`Current: ${healthScore.savingsRate.toFixed(1)}%`} />
              <ScoreCard title="2. Emergency Fund (20%)" score={healthScore.efScore} subtitle={`Completion: ${healthScore.efCompletion.toFixed(1)}%`} />
              <ScoreCard title="3. Insurance (25%)" score={healthScore.insuranceScore} subtitle={`Term: ${healthScore.termCoverage.toFixed(0)}% | Health: ${healthScore.healthCoverage.toFixed(0)}%`} />
              <ScoreCard title="4. Debt Management (15%)" score={healthScore.debtScore} subtitle={`EMI: ${healthScore.emiPct.toFixed(1)}% of income`} />
              <ScoreCard title="5. Investments (15%)" score={healthScore.investmentScore} subtitle={`Current: ${formatCurrency(healthScore.currentInvestments)}`} />
            </div>
          </div>
        )}

        {!calculated && activeTab !== 'inputs' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
            <p className="text-yellow-800">Please fill in your information in the Inputs tab and click "Calculate Financial Plan" to see your results here.</p>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">© 2025 Personal Finance Planner for India</p>
          <p className="text-gray-400 text-sm mt-2">Built with ❤️ for Indian families | All calculations are estimates - consult a financial advisor for personalized advice</p>
        </div>
      </footer>
    </div>
  );
}

function ScoreCard({ title, score, subtitle }: { title: string; score: number; subtitle: string }) {
  const bar = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-orange-500';
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2"><span className="font-medium">{title}</span></div>
      <div className="mb-2"><div className="text-2xl font-bold">{score.toFixed(0)}/100</div><div className="text-sm text-gray-600">{subtitle}</div></div>
      <div className="w-full bg-gray-200 rounded-full h-2"><div className={cn('h-2 rounded-full', bar)} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} /></div>
    </div>
  );
}