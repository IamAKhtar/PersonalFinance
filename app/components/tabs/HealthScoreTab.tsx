import React from "react";
import type { HealthScore } from "../types";

interface HealthScoreTabProps {
  healthScore: HealthScore | null;
  setActiveTab: (tab: string) => void;
}

export const HealthScoreTab: React.FC<HealthScoreTabProps> = ({ healthScore, setActiveTab }) => {
  if (!healthScore) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No health score data available.</p>
      </div>
    );
  }

  function cn(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Financial Health Scorecard</h2>
      <p className="text-gray-600">Comprehensive assessment of your financial well-being</p>

      <div className="card-success rounded-xl p-8 shadow-xl text-center">
        <h3 className="text-2xl font-semibold mb-4">Your Overall Score</h3>
        <div className="flex items-center justify-center gap-4">
          <div className="text-6xl font-bold">{healthScore.overallScore.toFixed(0)}</div>
          <div className="text-left">
            <p className="text-2xl font-bold">/ 100</p>
            <p className="text-xl font-semibold mt-1">Grade: {healthScore.grade}</p>
          </div>
        </div>
        <p className="mt-4 text-lg font-medium">{healthScore.rating}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Savings Score */}
        <div
          className={cn(
            healthScore.savingsScore >= 80 ? "card-success" : healthScore.savingsScore >= 60 ? "card-info" : "card-warn",
            "rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          )}
          onClick={() => setActiveTab("budget")}
        >
          <h4 className="font-semibold mb-2">💰 Savings Rate</h4>
          <p className="text-3xl font-bold mb-1">{healthScore.savingsScore.toFixed(0)}/100</p>
          <p className="text-sm opacity-90">Current: {healthScore.savingsRate.toFixed(1)}%</p>
        </div>

        {/* Emergency Fund Score */}
        <div
          className={cn(
            healthScore.efScore >= 80 ? "card-success" : healthScore.efScore >= 60 ? "card-info" : "card-warn",
            "rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          )}
          onClick={() => setActiveTab("emergency")}
        >
          <h4 className="font-semibold mb-2">🚨 Emergency Fund</h4>
          <p className="text-3xl font-bold mb-1">{healthScore.efScore.toFixed(0)}/100</p>
          <p className="text-sm opacity-90">Completion: {healthScore.efCompletion.toFixed(0)}%</p>
        </div>

        {/* Insurance Score */}
        <div
          className={cn(
            healthScore.insuranceScore >= 80 ? "card-success" : healthScore.insuranceScore >= 60 ? "card-info" : "card-warn",
            "rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          )}
          onClick={() => setActiveTab("insurance")}
        >
          <h4 className="font-semibold mb-2">🛡️ Insurance</h4>
          <p className="text-3xl font-bold mb-1">{healthScore.insuranceScore.toFixed(0)}/100</p>
          <p className="text-sm opacity-90">
            Term: {healthScore.termCoverage.toFixed(0)}% | Health: {healthScore.healthCoverage.toFixed(0)}%
          </p>
        </div>

        {/* Debt Score */}
        <div
          className={cn(
            healthScore.debtScore >= 80 ? "card-success" : healthScore.debtScore >= 60 ? "card-info" : "card-warn",
            "rounded-xl p-6 shadow-lg"
          )}
        >
          <h4 className="font-semibold mb-2">📉 Debt Management</h4>
          <p className="text-3xl font-bold mb-1">{healthScore.debtScore.toFixed(0)}/100</p>
          <p className="text-sm opacity-90">EMI: {healthScore.emiPct.toFixed(1)}% of income</p>
        </div>

        {/* Investment Score */}
        <div
          className={cn(
            healthScore.investmentScore >= 80 ? "card-success" : healthScore.investmentScore >= 60 ? "card-info" : "card-warn",
            "rounded-xl p-6 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          )}
          onClick={() => setActiveTab("investment")}
        >
          <h4 className="font-semibold mb-2">📈 Investment Portfolio</h4>
          <p className="text-3xl font-bold mb-1">{healthScore.investmentScore.toFixed(0)}/100</p>
          <p className="text-sm opacity-90">Current vs Expected</p>
        </div>

        {/* Overall Rating */}
        <div
          className={cn(
            healthScore.overallScore >= 80 ? "card-success" : healthScore.overallScore >= 60 ? "card-info" : "card-warn",
            "rounded-xl p-6 shadow-lg"
          )}
        >
          <h4 className="font-semibold mb-2">⭐ Overall Rating</h4>
          <p className="text-3xl font-bold mb-1">Grade {healthScore.grade}</p>
          <p className="text-sm opacity-90">{healthScore.rating}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Score Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Savings Rate (25% weight):</span>
            <span className="font-bold">{healthScore.savingsScore.toFixed(0)}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Emergency Fund (20% weight):</span>
            <span className="font-bold">{healthScore.efScore.toFixed(0)}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Insurance (25% weight):</span>
            <span className="font-bold">{healthScore.insuranceScore.toFixed(0)}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Debt Management (15% weight):</span>
            <span className="font-bold">{healthScore.debtScore.toFixed(0)}/100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Investment Portfolio (15% weight):</span>
            <span className="font-bold">{healthScore.investmentScore.toFixed(0)}/100</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">🎯 Improvement Tips</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          {healthScore.savingsScore < 80 && (
            <li>Increase your savings rate by reducing discretionary expenses</li>
          )}
          {healthScore.efScore < 80 && (
            <li>Build up your emergency fund to 9 months of expenses</li>
          )}
          {healthScore.termScore < 80 && (
            <li>Increase term life insurance cover to protect your family</li>
          )}
          {healthScore.healthScore < 80 && (
            <li>Review and upgrade health insurance coverage</li>
          )}
          {healthScore.debtScore < 80 && (
            <li>Reduce loan EMIs to below 40% of income</li>
          )}
          {healthScore.investmentScore < 80 && (
            <li>Start or increase systematic investment plan (SIP)</li>
          )}
        </ul>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">ℹ️ Grade Scale</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Grade A (80-100):</strong> Excellent financial health</p>
          <p><strong>Grade B (60-79):</strong> Good financial health</p>
          <p><strong>Grade C (40-59):</strong> Average, needs improvement</p>
          <p><strong>Grade D (0-39):</strong> Needs significant attention</p>
        </div>
      </div>
    </div>
  );
};
