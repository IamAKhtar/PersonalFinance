import React from "react";
import type { BudgetAllocation, EmergencyFund, Insurance, HealthScore } from "../../types";

function cn(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

interface DashboardTabProps {
  budget: BudgetAllocation | null;
  ef: EmergencyFund | null;
  insurance: Insurance | null;
  healthScore: HealthScore | null;
  formatCurrency: (value: number) => string;
  setActiveTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  budget,
  ef,
  insurance,
  healthScore,
  formatCurrency,
  setActiveTab,
}) => {
  if (!budget || !ef || !insurance || !healthScore) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No data available. Please fill inputs first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Financial Dashboard</h2>
      <p className="text-gray-600">Your financial health at a glance</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={cn(
            budget.savingsRate >= 20 ? "card-success" : "card-warn",
            "rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          )}
          onClick={() => setActiveTab("budget")}
        >
          <div className="text-sm opacity-90">Savings Rate</div>
          <div className="text-3xl font-bold mt-2">
            {budget.savingsRate.toFixed(1)}%
          </div>
          <div className="text-sm mt-2">{budget.status}</div>
        </div>

        <div
          className={cn(
            ef.completionPct >= 75 ? "card-success" : "card-warn",
            "rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          )}
          onClick={() => setActiveTab("emergency")}
        >
          <div className="text-sm opacity-90">Emergency Fund</div>
          <div className="text-3xl font-bold mt-2">
            {ef.completionPct.toFixed(0)}%
          </div>
          <div className="text-sm mt-2">{ef.status}</div>
        </div>

        <div
          className={cn(
            insurance.term.gap <= 0 && insurance.health.gap <= 0
              ? "card-success"
              : "card-warn",
            "rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          )}
          onClick={() => setActiveTab("insurance")}
        >
          <div className="text-sm opacity-90">Insurance Gap</div>
          <div className="text-3xl font-bold mt-2">
            ₹{formatCurrency(insurance.term.gap + insurance.health.gap)}
          </div>
          <div className="text-sm mt-2">To be filled</div>
        </div>

        <div
          className={cn(
            healthScore.overallScore >= 80
              ? "card-success"
              : healthScore.overallScore >= 60
              ? "card-info"
              : "card-warn",
            "rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          )}
          onClick={() => setActiveTab("score")}
        >
          <div className="text-sm opacity-90">Financial Health Score</div>
          <div className="text-3xl font-bold mt-2">
            {healthScore.overallScore.toFixed(0)}/100
          </div>
          <div className="text-sm mt-2">Grade {healthScore.grade}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          💡 <strong>Pro Tip:</strong> Click on any card above to dive deeper into that area.
          Improve accuracy by adding your{" "}
          <button
            className="text-brand-primary underline font-medium"
            onClick={() => setActiveTab("investment")}
          >
            current SIPs and assets
          </button>
          .
        </p>
      </div>
    </div>
  );
};
