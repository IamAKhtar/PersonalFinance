import React from "react";
import type { Retirement } from "../../types";

interface RetirementTabProps {
  retirement: Retirement | null;
  formatCurrency: (value: number) => string;
}

export const RetirementTab: React.FC<RetirementTabProps> = ({ retirement, formatCurrency }) => {
  if (!retirement) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No retirement data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Retirement Planning</h2>
      <p className="text-gray-600">Plan for a comfortable retirement</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-info rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Years to Retirement</h3>
          <p className="text-4xl font-bold">{retirement.yearsToRetirement}</p>
          <p className="text-sm mt-2 opacity-90">
            Age {retirement.currentAge} → {retirement.retirementAge}
          </p>
        </div>
        <div className="card-success rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Post-Retirement Years</h3>
          <p className="text-4xl font-bold">{retirement.postRetirementYears}</p>
          <p className="text-sm mt-2 opacity-90">Until age 85</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Corpus Calculation
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Current Monthly Expenses:</span>
            <span className="text-lg font-bold">₹{formatCurrency(retirement.currentExpenses)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-medium">Retirement Need (70%):</span>
            <span className="text-lg font-bold text-blue-700">
              ₹{formatCurrency(retirement.retirementNeed)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
            <span className="font-medium">Future Monthly Expense:</span>
            <span className="text-lg font-bold text-yellow-700">
              ₹{formatCurrency(retirement.futureMonthlyExpense)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
            <span className="font-medium">Future Annual Expense:</span>
            <span className="text-lg font-bold text-yellow-700">
              ₹{formatCurrency(retirement.futureAnnualExpense)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="font-medium">Corpus Needed:</span>
            <span className="text-xl font-bold text-green-700">
              ₹{formatCurrency(retirement.corpusNeeded)}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📈 Your Progress
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-medium">Current Investments (Future Value):</span>
            <span className="text-lg font-bold text-blue-700">
              ₹{formatCurrency(retirement.currentInvestmentsFV)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
            <span className="font-medium">EPF Balance (Future Value):</span>
            <span className="text-lg font-bold text-purple-700">
              ₹{formatCurrency(retirement.epfFV)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="font-medium">Total Future Value:</span>
            <span className="text-xl font-bold text-green-700">
              ₹{formatCurrency(retirement.totalFV)}
            </span>
          </div>
          {retirement.gap > 0 && (
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <span className="font-medium">Gap to fill:</span>
              <span className="text-xl font-bold text-orange-700">
                ₹{formatCurrency(retirement.gap)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
            <span className="font-medium">Status:</span>
            <span className="text-lg font-bold">{retirement.status}</span>
          </div>
        </div>
      </div>

      {retirement.gap > 0 && (
        <div className="card bg-brand-primary text-white">
          <h3 className="text-lg font-semibold mb-4">📊 Monthly SIP Required</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Monthly SIP Needed:</span>
              <span className="text-3xl font-bold">
                ₹{formatCurrency(retirement.monthlySIPNeeded)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">% of Monthly Income:</span>
              <span className="text-2xl font-bold">
                {retirement.sipPctOfIncome.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">🎯 Action Steps</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Start investing early to benefit from compounding</li>
          <li>Review retirement plan annually and adjust as needed</li>
          <li>Consider NPS for additional tax benefits and retirement corpus</li>
          <li>Gradually shift to debt as you approach retirement</li>
        </ul>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">ℹ️ Assumptions</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Inflation: {(retirement.inflationRate * 100).toFixed(0)}% per annum</li>
          <li>• Expected return: {(retirement.expectedReturn * 100).toFixed(0)}% per annum</li>
          <li>• EPF return: 8% per annum</li>
          <li>• Lifespan: 85 years</li>
        </ul>
      </div>
    </div>
  );
};
