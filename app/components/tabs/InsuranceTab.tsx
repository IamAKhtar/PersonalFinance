import React from "react";
import type { Insurance } from "../../types";
import type { SuggestedTerm, SuggestedHealth } from "../../lib/productSelector";

interface InsuranceTabProps {
  insurance: Insurance | null;
  formatCurrency: (value: number) => string;
  suggestedTerm: SuggestedTerm[];
  suggestedHealth: SuggestedHealth[];
  dataAsOf: string;
}

export const InsuranceTab: React.FC<InsuranceTabProps> = ({
  insurance,
  formatCurrency,
  suggestedTerm,
  suggestedHealth,
  dataAsOf,
}) => {
  if (!insurance) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No insurance data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Insurance Planning</h2>
      <p className="text-gray-600">Protect your family's financial future</p>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🛡️ Term Life Insurance
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-medium">Recommended Cover:</span>
            <span className="text-lg font-bold text-blue-700">
              ₹{formatCurrency(insurance.term.recommended)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Existing Cover:</span>
            <span className="text-lg font-bold">
              ₹{formatCurrency(insurance.term.existing)}
            </span>
          </div>
          {insurance.term.gap > 0 && (
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <span className="font-medium">Gap to fill:</span>
              <span className="text-lg font-bold text-orange-700">
                ₹{formatCurrency(insurance.term.gap)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="font-medium">Estimated Annual Premium:</span>
            <span className="text-lg font-bold text-green-700">
              ₹{formatCurrency(insurance.term.annualPremium)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
            <span className="font-medium">Status:</span>
            <span className="text-lg font-bold">{insurance.term.status}</span>
          </div>
        </div>

        {suggestedTerm.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              💡 Suggested Term Insurance Shortlist
            </h4>
            <p className="text-xs text-gray-500 mb-3">Data as of {dataAsOf}</p>
            <div className="space-y-3">
              {suggestedTerm.map((term, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <h5 className="font-semibold text-gray-900">{term.policy.insurer}</h5>
                  <p className="text-sm text-gray-700 mt-2">{term.reason}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              <strong>Disclaimer:</strong> Sample policies for reference. Premiums
              vary by age, health, lifestyle. Not financial advice. Compare quotes
              from multiple insurers.
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏥 Health Insurance
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-medium">Recommended Cover:</span>
            <span className="text-lg font-bold text-blue-700">
              ₹{formatCurrency(insurance.health.recommended)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span className="font-medium">Existing Cover:</span>
            <span className="text-lg font-bold">
              ₹{formatCurrency(insurance.health.existing)}
            </span>
          </div>
          {insurance.health.gap > 0 && (
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
              <span className="font-medium">Gap to fill:</span>
              <span className="text-lg font-bold text-orange-700">
                ₹{formatCurrency(insurance.health.gap)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="font-medium">Estimated Annual Premium:</span>
            <span className="text-lg font-bold text-green-700">
              ₹{formatCurrency(insurance.health.annualPremium)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
            <span className="font-medium">Status:</span>
            <span className="text-lg font-bold">{insurance.health.status}</span>
          </div>
        </div>

        {suggestedHealth.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              💡 Suggested Health Insurance Shortlist
            </h4>
            <p className="text-xs text-gray-500 mb-3">Data as of {dataAsOf}</p>
            <div className="space-y-3">
              {suggestedHealth.map((health, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <h5 className="font-semibold text-gray-900">{health.policy.insurer}</h5>
                  <p className="text-sm text-gray-700 mt-2">{health.reason}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              <strong>Disclaimer:</strong> Sample policies for reference. Premiums
              vary by age, family size, city. Not financial advice. Compare multiple quotes.
            </p>
          </div>
        )}
      </div>

      <div className="card bg-brand-primary text-white">
        <h3 className="text-lg font-semibold mb-4">📋 Total Insurance Plan</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Combined Annual Premium:</span>
            <span className="text-2xl font-bold">
              ₹{formatCurrency(insurance.totalAnnualPremium)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Monthly Impact:</span>
            <span className="text-xl font-bold">
              ₹{formatCurrency(insurance.monthlyImpact)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">% of Monthly Income:</span>
            <span className="text-xl font-bold">
              {insurance.pctOfIncome.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">🎯 Action Steps</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Buy term insurance early - premiums increase with age</li>
          <li>Choose online plans for lower premiums</li>
          <li>Review health insurance annually as medical costs rise</li>
          <li>Consider top-up/super top-up for additional health cover</li>
        </ul>
      </div>
    </div>
  );
};
