"use client";

import { useEffect, useState } from "react";
import type { MutualFund, FDRate, TermInsurance, HealthInsurance } from "../data/products.types";
import {
  selectSIPBasket,
  selectParkingOptions,
  selectTermInsurance,
  selectHealthInsurance,
  type SuggestedSIP,
  type SuggestedParking,
  type SuggestedTerm,
  type SuggestedHealth,
} from "./lib/productSelector";
import type { UserInputs } from "./types";
import {
  calculateBudget,
  calculateEmergencyFund,
  calculateInsurance,
  calculateInvestment,
  calculateRetirement,
  calculateHealthScore,
} from "./lib/calculations";

// Tab components
import { InputsTab } from "./components/tabs/InputsTab";
import { DashboardTab } from "./components/tabs/DashboardTab";
import { BudgetTab } from "./components/tabs/BudgetTab";
import { EmergencyFundTab } from "./components/tabs/EmergencyFundTab";
import { InsuranceTab } from "./components/tabs/InsuranceTab";
import { InvestmentTab } from "./components/tabs/InvestmentTab";
import { RetirementTab } from "./components/tabs/RetirementTab";
import { HealthScoreTab } from "./components/tabs/HealthScoreTab";

function cn(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

const defaultInputs: UserInputs = {
  name: "",
  age: 30,
  monthlyIncome: 100000,
  cityTier: "Tier 1 Metro",
  dependents: 2,
  maritalStatus: "Married",
  riskTolerance: "Moderate",
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
  const [activeTab, setActiveTab] = useState("inputs");
  const [calculated, setCalculated] = useState(false);

  const [sips, setSips] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [fdRates, setFdRates] = useState<FDRate[]>([]);
  const [termPolicies, setTermPolicies] = useState<TermInsurance[]>([]);
  const [healthPolicies, setHealthPolicies] = useState<HealthInsurance[]>([]);
  const [dataAsOf, setDataAsOf] = useState<string>("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("financeInputs");
      if (saved) {
        setInputs(JSON.parse(saved));
        setCalculated(true);
      }
    } catch {}

    try {
      const savedSips = localStorage.getItem("financeSips");
      if (savedSips) setSips(JSON.parse(savedSips));
    } catch {}

    try {
      const savedAssets = localStorage.getItem("financeAssets");
      if (savedAssets) setAssets(JSON.parse(savedAssets));
    } catch {}
  }, []);

  useEffect(() => {
    fetch("/data/products.json")
      .then((r) => r.json())
      .then((data) => {
        setMutualFunds(data.mutual_funds || []);
        setFdRates(data.fd_rates || []);
        setTermPolicies(data.term_insurance || []);
        setHealthPolicies(data.health_insurance || []);
        setDataAsOf(data.as_of_date || "2025-01-01");
      })
      .catch(() => {});
  }, []);

  const handleSave = () => {
    localStorage.setItem("financeInputs", JSON.stringify(inputs));
    setCalculated(true);
    setActiveTab("dashboard");
  };

  const resetInputs = () => {
    setInputs(defaultInputs);
    setCalculated(false);
    localStorage.removeItem("financeInputs");
    setSips([]);
    setAssets([]);
    localStorage.removeItem("financeSips");
    localStorage.removeItem("financeAssets");
    setActiveTab("inputs");
  };

  const budget = calculated ? calculateBudget(inputs) : null;
  const ef = calculated ? calculateEmergencyFund(inputs) : null;
  const insurance = calculated ? calculateInsurance(inputs) : null;
  const investment = calculated && ef ? calculateInvestment(inputs, ef.gap) : null;
  const retirement = calculated ? calculateRetirement(inputs) : null;
  const healthScore =
    calculated && budget && ef && insurance
      ? calculateHealthScore(inputs, budget, ef, insurance)
      : null;

  const suggestedSIPs: SuggestedSIP[] =
    calculated && investment
      ? selectSIPBasket(
          mutualFunds,
          investment.finalEquityPct,
          investment.finalDebtPct,
          inputs.riskTolerance,
          investment.monthlySIP
        )
      : [];

  const suggestedParking: SuggestedParking[] =
    calculated && ef
      ? selectParkingOptions(mutualFunds, fdRates, 12, ef.gap)
      : [];

  const suggestedTerm: SuggestedTerm[] =
    calculated && insurance
      ? selectTermInsurance(termPolicies, insurance.term.gap)
      : [];

  const suggestedHealth: SuggestedHealth[] =
    calculated && insurance
      ? selectHealthInsurance(healthPolicies, insurance.health.gap)
      : [];

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const renderTabContent = () => {
    if (!calculated && activeTab !== "inputs") {
      return (
        <div className="text-center p-8">
          <p>Please fill inputs first to view this tab.</p>
          <button
            className="btn-primary mt-4"
            onClick={() => setActiveTab("inputs")}
          >
            Go to Inputs
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "inputs":
        return (
          <InputsTab
            inputs={inputs}
            setInputs={setInputs}
            handleSave={handleSave}
            resetInputs={resetInputs}
            setActiveTab={setActiveTab}
          />
        );
      case "dashboard":
        return (
          <DashboardTab
            budget={budget}
            ef={ef}
            insurance={insurance}
            healthScore={healthScore}
            formatCurrency={formatCurrency}
            setActiveTab={setActiveTab}
          />
        );
      case "budget":
        return <BudgetTab budget={budget} formatCurrency={formatCurrency} />;
      case "emergency":
        return (
          <EmergencyFundTab
            ef={ef}
            formatCurrency={formatCurrency}
            suggestedParking={suggestedParking}
            dataAsOf={dataAsOf}
          />
        );
      case "insurance":
        return (
          <InsuranceTab
            insurance={insurance}
            formatCurrency={formatCurrency}
            suggestedTerm={suggestedTerm}
            suggestedHealth={suggestedHealth}
            dataAsOf={dataAsOf}
          />
        );
      case "investment":
        return (
          <InvestmentTab
            investment={investment}
            sips={sips}
            setSips={setSips}
            assets={assets}
            setAssets={setAssets}
            formatCurrency={formatCurrency}
            suggestedSIPs={suggestedSIPs}
            dataAsOf={dataAsOf}
          />
        );
      case "retirement":
        return (
          <RetirementTab retirement={retirement} formatCurrency={formatCurrency} />
        );
      case "score":
        return (
          <HealthScoreTab healthScore={healthScore} setActiveTab={setActiveTab} />
        );
      default:
        return (
          <InputsTab
            inputs={inputs}
            setInputs={setInputs}
            handleSave={handleSave}
            resetInputs={resetInputs}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header-brand shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white text-center">
            Personal Finance Planner
          </h1>
          <p className="text-center text-white text-sm mt-1 opacity-90">
            Your comprehensive financial planning assistant
          </p>
        </div>
      </header>

      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2">
            {[
              { id: "inputs", label: "Inputs", icon: "📝" },
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "budget", label: "Budget", icon: "💰" },
              { id: "emergency", label: "Emergency", icon: "🚨" },
              { id: "insurance", label: "Insurance", icon: "🛡️" },
              { id: "investment", label: "Investment", icon: "📈" },
              { id: "retirement", label: "Retirement", icon: "🏖️" },
              { id: "score", label: "Score", icon: "⭐" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all",
                  activeTab === tab.id
                    ? "bg-brand-primary text-white shadow"
                    : "text-gray-600 hover:bg-gray-100",
                  tab.id !== "inputs" && !calculated && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => {
                  if (tab.id === "inputs" || calculated) {
                    setActiveTab(tab.id);
                  }
                }}
                disabled={tab.id !== "inputs" && !calculated}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8">{renderTabContent()}</main>

      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p className="text-sm">
          &copy; 2025 Personal Finance Planner | Educational purposes only, not
          financial advice
        </p>
      </footer>
    </div>
  );
}
