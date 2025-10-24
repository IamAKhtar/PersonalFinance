import React from "react";
import type { BudgetAllocation } from "../../types";

interface BudgetTabProps {
  budget: BudgetAllocation | null;
  formatCurrency: (value: number) => string;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({ budget, formatCurrency }) => {
  if (!budget) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No budget data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Budget Allocation Analysis</h2>
      <p className="text-gray-600">Based on the 50-30-20 rule</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-info rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">50% Needs</h3>
          <p className="text-3xl font-bold">₹{formatCurrency(budget.needs)}</p>
          <p className="text-sm mt-2 opacity-90">Essential expenses</p>
        </div>
        <div className="card-warn rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">30% Wants</h3>
          <p className="text-3xl font-bold">₹{formatCurrency(budget.wants)}</p>
          <p className="text-sm mt-2 opacity-90">Lifestyle & leisure</p>
        </div>
        <div className="card-success rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">20% Savings</h3>
          <p className="text-3xl font-bold">₹{formatCurrency(budget.savings)}</p>
          <p className="text-sm mt-2 opacity-90">Investments & goals</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Situation</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Total Income:</span>
            <span className="text-lg font-bold">₹{formatCurrency(budget.totalIncome)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Current Expenses:</span>
            <span className="text-lg font-bold">₹{formatCurrency(budget.currentExpenses)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="font-medium">Current Savings:</span>
            <span className="text-lg font-bold text-green-700">
              ₹{formatCurrency(budget.currentSavings)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-medium">Savings Rate:</span>
            <span className="text-lg font-bold text-blue-700">
              {budget.savingsRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
            <span className="font-medium">Status:</span>
            <span className="text-lg font-bold">{budget.status}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Recommendations</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Aim for at least 20% savings rate for long-term wealth creation</li>
          <li>Review and optimize your expenses quarterly</li>
          <li>Consider increasing savings rate by 1-2% annually</li>
          {budget.savingsRate < 20 && (
            <li className="font-semibold text-orange-700">
              Your current savings rate is below recommended 20%. Look for ways to reduce expenses or increase income.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
