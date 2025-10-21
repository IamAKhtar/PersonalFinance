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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
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
  const [activeTab, setActiveTab] = useState<'inputs' | 'dashboard' | 'budget' | 'emergency' | 'insurance' | 'investment' | 'retirement' | 'score'>('inputs');
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('financeInputs');
      if (saved) {
        setInputs(JSON.parse(saved));
        setCalculated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('financeInputs', JSON.stringify(inputs));
    setCalculated(true);
    setActiveTab('dashboard');
  };

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const budget = calculated ? calculateBudget(inputs) : null;
  const ef = calculated ? calculateEmergencyFund(inputs) : null;
  const insurance = calculated ? calculateInsurance(inputs) : null;
  const investment = calculated && ef ? calculateInvestment(inputs, ef.gap) : null;
  const retirement = calculated ? calculateRetirement(inputs) : null;
  const healthScore =
    calculated && budget && ef && insurance
      ? calculateHealthScore(inputs, budget, ef, insurance)
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">💰 Personal Finance Planner for India</h1>
          <p className="text-blue-200 mt-1">Comprehensive financial planning for Indian families</p>
        </div>
      </header>

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
              const on = 'border-blue-500 text-blue-600';
              const off = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(id)}
                  className={cn(base, activeTab === id ? on : off)}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'inputs' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Financial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={inputs.name}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={inputs.age}
                  onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (Post-tax)</label>
                <input
                  type="number"
                  value={inputs.monthlyIncome}
                  onChange={(e) => setInputs({ ...inputs, monthlyIncome: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* City Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City Tier</label>
                <select
                  value={inputs.cityTier}
                  onChange={(e) => setInputs({ ...inputs, cityTier: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Tier 1 (Metro)</option>
                  <option>Tier 2</option>
                  <option>Tier 3</option>
                </select>
              </div>
              {/* Dependents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Dependents</label>
                <input
                  type="number"
                  value={inputs.dependents}
                  onChange={(e) => setInputs({ ...inputs, dependents: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Risk */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                <select
                  value={inputs.riskTolerance}
                  onChange={(e) => setInputs({ ...inputs, riskTolerance: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Conservative</option>
                  <option>Moderate</option>
                  <option>Aggressive</option>
                </select>
              </div>
              {/* Expenses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Monthly Expenses</label>
                <input
                  type="number"
                  value={inputs.currentExpenses}
                  onChange={(e) => setInputs({ ...inputs, currentExpenses: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* EF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Existing Emergency Fund</label>
                <input
                  type="number"
                  value={inputs.existingEmergencyFund}
                  onChange={(e) => setInputs({ ...inputs, existingEmergencyFund: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Term cover */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Existing Term Insurance Cover</label>
                <input
                  type="number"
                  value={inputs.existingTermInsurance}
                  onChange={(e) => setInputs({ ...inputs, existingTermInsurance: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Health cover */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Existing Health Insurance Cover</label>
                <input
                  type="number"
                  value={inputs.existingHealthInsurance}
                  onChange={(e) => setInputs({ ...inputs, existingHealthInsurance: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* EMI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Outstanding Loans (EMI / month)</label>
                <input
                  type="number"
                  value={inputs.loanEMI}
                  onChange={(e) => setInputs({ ...inputs, loanEMI: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Investments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Investments Value</label>
                <input
                  type="number"
                  value={inputs.currentInvestments}
                  onChange={(e) => setInputs({ ...inputs, currentInvestments: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Retirement age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age Goal</label>
                <input
                  type="number"
                  value={inputs.retirementAge}
                  onChange={(e) => setInputs({ ...inputs, retirementAge: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* EPF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current PF/EPF Balance</label>
                <input
                  type="number"
                  value={inputs.epfBalance}
                  onChange={(e) => setInputs({ ...inputs, epfBalance: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium">
                Calculate Financial Plan
              </button>
              <button onClick={() => setInputs(defaultInputs)} className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 font-medium">
                Reset
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && calculated && budget && ef && insurance && healthScore && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Financial Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-sm opacity-90">Savings Rate</div>
                <div className="text-3xl font-bold mt-2">{budget.savingsRate.toFixed(1)}%</div>
                <div className="text-sm mt-2">{budget.status}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-sm opacity-90">Emergency Fund</div>
                <div className="text-3xl font-bold mt-2">{ef.completionPct.toFixed(0)}%</div>
                <div className="text-sm mt-2">{ef.status}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-sm opacity-90">Insurance Gap</div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(insurance.term.gap + insurance.health.gap)}</div>
                <div className="text-sm mt-2">To be filled</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-sm opacity-90">Health Score</div>
                <div className="text-3xl font-bold mt-2">{healthScore.overallScore.toFixed(0)}/100</div>
                <div className="text-sm mt-2">Grade: {healthScore.grade}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budget' && calculated && budget && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Allocation Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between mb-1">
                  <span>Needs (50%)</span><span className="font-medium">{formatCurrency(budget.needs)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }} /></div>

                <div className="flex justify-between mb-1 mt-4">
                  <span>Wants (30%)</span><span className="font-medium">{formatCurrency(budget.wants)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }} /></div>

                <div className="flex justify-between mb-1 mt-4">
                  <span>Savings (20%)</span><span className="font-medium">{formatCurrency(budget.savings)}</span>
                </div>
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

        {activeTab === 'emergency' && calculated && ef && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Fund Planning</h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>Essential Monthly Expenses:</strong> {formatCurrency(ef.essentialExpenses)}<br />
                <span className="text-xs">(70% of expenses + EMI)</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Conservative (12 mo)</div>
                <div className="text-xl font-bold mt-2">{formatCurrency(ef.conservativeTarget)}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-500">
                <div className="text-sm text-green-700 font-medium">Recommended (9 mo)</div>
                <div className="text-xl font-bold mt-2 text-green-700">{formatCurrency(ef.recommendedTarget)}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Minimum (6 mo)</div>
                <div className="text-xl font-bold mt-2">{formatCurrency(ef.minimumTarget)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Your Existing Emergency Fund</span>
                <span className="text-lg font-bold">{formatCurrency(ef.existing)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Gap to Fill</span>
                <span className="text-lg font-bold text-orange-600">{formatCurrency(ef.gap)}</span>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Completion</span><span className="font-bold">{ef.completionPct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className={cn('h-4 rounded-full', ef.completionPct >= 75 ? 'bg-green-500' : 'bg-orange-500')} style={{ width: `${Math.min(100, ef.completionPct)}%` }} />
                </div>
                <div className="text-sm text-right mt-1">{ef.status}</div>
              </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">To reach target in 12 months</div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(ef.monthlyContribution12)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">To reach target in 24 months</div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(ef.monthlyContribution24)}</div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Parking Strategy</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 50% in Savings Account ({formatCurrency(ef.recommendedTarget * 0.5)})</li>
                <li>• 50% in Liquid Mutual Funds ({formatCurrency(ef.recommendedTarget * 0.5)})</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'insurance' && calculated && insurance && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Insurance Planning</h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-900">Term Life Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Method 1: Income Replacement</div>
                      <div className="text-lg font-bold">{formatCurrency(insurance.term.method1)}</div>
                      <div className="text-xs text-gray-500">{insurance.term.multiplier}x annual income</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Method 2: Human Life Value</div>
                      <div className="text-lg font-bold">{formatCurrency(insurance.term.method2)}</div>
                      <div className="text-xs text-gray-500">{insurance.term.yearsToRetirement} years to retirement</div>
                    </div>
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

              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-4 text-green-900">Health Insurance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Base Cover per Person ({inputs.cityTier})</div>
                      <div className="text-lg font-bold">{formatCurrency(insurance.health.baseCover)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Family Size</div>
                      <div className="text-lg font-bold">{insurance.health.familySize} members</div>
                      <div className="text-xs text-gray-500">Multiplier: {insurance.health.multiplier}x</div>
                    </div>
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

              <div className="border-t pt-6 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Total Insurance Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Total Annual Premium</div>
                    <div className="text-2xl font-bold">{formatCurrency(insurance.totalAnnualPremium)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Monthly Impact</div>
                    <div className="text-2xl font-bold">{formatCurrency(insurance.monthlyImpact)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">% of Income</div>
                    <div className="text-2xl font-bold">{insurance.pctOfIncome.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investment' && calculated && investment && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Allocation Strategy</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Base Equity % (100 - Age)</div>
                  <div className="text-lg font-bold">{investment.baseEquityPct}%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Risk Adjustment ({inputs.riskTolerance})</div>
                  <div className="text-lg font-bold">{investment.riskAdjustment > 0 ? '+' : ''}{investment.riskAdjustment}%</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm opacity-90">Equity</div>
                    <div className="text-3xl font-bold">{investment.finalEquityPct.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-90">Debt</div>
                    <div className="text-3xl font-bold">{investment.finalDebtPct.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Recommended Savings (20%)</div>
                <div className="text-xl font-bold">{formatCurrency(investment.recommendedSavings)}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-700">Emergency Fund Build-up</div>
                <div className="text-xl font-bold text-orange-700">-{formatCurrency(investment.emergencyFundContribution)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-700">Available for Investment</div>
                <div className="text-xl font-bold text-green-700">{formatCurrency(investment.availableForInvestment)}</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded-lg">
                <div className="text-sm text-blue-700 font-medium">MONTHLY SIP</div>
                <div className="text-xl font-bold text-blue-700">{formatCurrency(investment.monthlySIP)}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-700">Equity Portion ({investment.finalEquityPct.toFixed(0)}%)</div>
                <div className="text-2xl font-bold text-purple-700">{formatCurrency(investment.equityPortion)}</div>
                <div className="text-xs text-purple-600 mt-2">Large Cap, Mid Cap, Small Cap Funds</div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-indigo-700">Debt Portion ({investment.finalDebtPct.toFixed(0)}%)</div>
                <div className="text-2xl font-bold text-indigo-700">{formatCurrency(investment.debtPortion)}</div>
                <div className="text-xs text-indigo-600 mt-2">Debt Funds, PPF/EPF, Gold</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'retirement' && calculated && retirement && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Retirement Planning</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600">Current Age</div>
                <div className="text-2xl font-bold">{retirement.currentAge} years</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-sm text-blue-700">Retirement Age</div>
                <div className="text-2xl font-bold text-blue-700">{retirement.retirementAge} years</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600">Years to Retirement</div>
                <div className="text-2xl font-bold">{retirement.yearsToRetirement} years</div>
              </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Current Monthly Expenses</div>
                  <div className="text-lg font-bold">{formatCurrency(retirement.currentExpenses)}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Monthly Need at Retirement (inflated)</div>
                  <div className="text-lg font-bold">{formatCurrency(retirement.futureMonthlyExpense)}</div>
                  <div className="text-xs text-gray-500">At 6% inflation for {retirement.yearsToRetirement} years</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Expected Years in Retirement</div>
                  <div className="text-lg font-bold">{retirement.postRetirementYears} years</div>
                  <div className="text-xs text-gray-500">Assuming life expectancy of 85 years</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-lg">
                <div className="text-sm opacity-90">CORPUS NEEDED AT RETIREMENT</div>
                <div className="text-4xl font-bold mt-4">{formatCurrency(retirement.corpusNeeded)}</div>
                <div className="text-xs opacity-75 mt-2">Annual Expense: {formatCurrency(retirement.futureAnnualExpense)}</div>
              </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-700">Current Investments (FV)</div>
                <div className="text-xl font-bold text-blue-700">{formatCurrency(retirement.currentInvestmentsFV)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-700">EPF Balance (FV)</div>
                <div className="text-xl font-bold text-green-700">{formatCurrency(retirement.epfFV)}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-700">Total Future Value</div>
                <div className="text-xl font-bold text-purple-700">{formatCurrency(retirement.totalFV)}</div>
              </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Corpus Needed</div>
                <div className="text-xl font-bold">{formatCurrency(retirement.corpusNeeded)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Existing Assets (FV)</div>
                <div className="text-xl font-bold">{formatCurrency(retirement.totalFV)}</div>
              </div>
              <div className={cn('p-4 rounded-lg', retirement.gap === 0 ? 'bg-green-100' : 'bg-orange-100')}>
                <div className={cn('text-sm', retirement.gap === 0 ? 'text-green-700' : 'text-orange-700')}>Gap to Fill</div>
                <div className={cn('text-xl font-bold', retirement.gap === 0 ? 'text-green-700' : 'text-orange-700')}>
                  {formatCurrency(retirement.gap)}
                </div>
                <div className="text-xs mt-1">{retirement.status}</div>
              </div>
            </div>

            <div className="border-t pt-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Monthly SIP Required</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm opacity-90">To achieve retirement corpus</div>
                  <div className="text-4xl font-bold mt-2">{formatCurrency(retirement.monthlySIPNeeded)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">As % of current income</div>
                  <div className="text-4xl font-bold mt-2">{retirement.sipPctOfIncome.toFixed(1)}%</div>
                  <div className={cn('text-sm mt-2 px-3 py-1 rounded inline-block', retirement.sipPctOfIncome <= 15 ? 'bg-green-500' : 'bg-orange-500')}>
                    {retirement.sipPctOfIncome <= 15 ? '✓ Good' : '⚠ Increase Savings'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'score' && calculated && healthScore && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Health Scorecard</h2>

            <div className="text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-xl mb-8">
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
            <p className="text-yellow-800">
              Please fill in your information in the Inputs tab and click "Calculate Financial Plan" to see your results here.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">© 2025 Personal Finance Planner for India</p>
          <p className="text-gray-400 text-sm mt-2">
            Built with ❤️ for Indian families | All calculations are estimates - consult a financial advisor for personalized advice
          </p>
        </div>
      </footer>
    </div>
  );
}

function ScoreCard({ title, score, subtitle }: { title: string; score: number; subtitle: string }) {
  const bar = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-orange-500';
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{title}</span>
      </div>
      <div className="mb-2">
        <div className="text-2xl font-bold">{score.toFixed(0)}/100</div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={cn('h-2 rounded-full', bar)} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </div>
    </div>
  );
}
