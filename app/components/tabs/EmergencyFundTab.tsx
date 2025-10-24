import React from "react";
import type { EmergencyFund } from "../types";
import type { SuggestedParking } from "../lib/productSelector";

interface EmergencyFundTabProps {
  ef: EmergencyFund | null;
  formatCurrency: (value: number) => string;
  suggestedParking: SuggestedParking[];
  dataAsOf: string;
}

export const EmergencyFundTab: React.FC<EmergencyFundTabProps> = ({
  ef,
  formatCurrency,
  suggestedParking,
  dataAsOf,
}) => {
  if (!ef) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No emergency fund data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Emergency Fund Planning</h2>
      <p className="text-gray-600">
        Build a safety net for unexpected expenses
      </p>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Essential Monthly Expenses
        </h3>
        <p className="text-3xl font-bold text-brand-primary">
          ₹{formatCurrency(ef.essentialExpenses)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          (70% of expenses + EMI)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-warn rounded-xl p-6 shadow">
          <h4 className="font-semibold mb-2">Minimum (6 months)</h4>
          <p className="text-2xl font-bold">₹{formatCurrency(ef.minimumTarget)}</p>
        </div>
        <div className="card-info rounded-xl p-6 shadow">
          <h4 className="font-semibold mb-2">Recommended (9 months)</h4>
          <p className="text-2xl font-bold">₹{formatCurrency(ef.recommendedTarget)}</p>
        </div>
        <div className="card-success rounded-xl p-6 shadow">
          <h4 className="font-semibold mb-2">Conservative (12 months)</h4>
          <p className="text-2xl font-bold">₹{formatCurrency(ef.conservativeTarget)}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Existing Fund:</span>
              <span className="text-lg font-bold">₹{formatCurrency(ef.existing)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-brand-primary h-4 rounded-full transition-all"
                style={{ width: `${Math.min(100, ef.completionPct)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {ef.completionPct.toFixed(1)}% of recommended target
            </p>
          </div>

          {ef.gap > 0 && (
            <>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="font-medium">Gap to fill:</span>
                <span className="text-lg font-bold text-orange-700">
                  ₹{formatCurrency(ef.gap)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded">
                  <p className="text-sm text-gray-700">Reach target in 12 months:</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">
                    ₹{formatCurrency(ef.monthlyContribution12)}/month
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <p className="text-sm text-gray-700">Reach target in 24 months:</p>
                  <p className="text-xl font-bold text-green-700 mt-1">
                    ₹{formatCurrency(ef.monthlyContribution24)}/month
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
            <span className="font-medium">Status:</span>
            <span className="text-lg font-bold">{ef.status}</span>
          </div>
        </div>
      </div>

      {suggestedParking.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 Suggested Parking Options
          </h3>
          <p className="text-xs text-gray-500 mb-4">Data as of {dataAsOf}</p>
          <div className="space-y-3">
            {suggestedParking.map((opt, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                {opt.type === "liquid_fund" ? (
                  <>
                    <h4 className="font-semibold text-gray-900">
                      {"fund" in opt.option ? opt.option.name : "Unknown Fund"}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {"fund" in opt.option ? opt.option.category : "Liquid Fund"} |{" "}
                      {"fund" in opt.option ? opt.option.amc : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold text-gray-900">
                      {"institution" in opt.option ? opt.option.institution : "Bank FD"}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Rate: {"rate_general" in opt.option ? opt.option.rate_general : 0}% |{" "}
                      Rating: {"rating_band" in opt.option ? opt.option.rating_band : ""}
                    </p>
                  </>
                )}
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Allocation:</strong> {opt.allocation_pct}% (₹
                  {formatCurrency(opt.amount)})
                </p>
                <p className="text-sm text-gray-600 mt-1">{opt.reason}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">
            <strong>Disclaimer:</strong> Curated options for reference. Not
            financial advice. Verify rates and terms before investing.
          </p>
        </div>
      )}

      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">🎯 Action Steps</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Keep 3-6 months in highly liquid savings account</li>
          <li>Park remaining in liquid/overnight mutual funds</li>
          <li>Avoid locking emergency funds in FDs with penalties</li>
          <li>Review and top-up emergency fund annually</li>
        </ul>
      </div>
    </div>
  );
};
