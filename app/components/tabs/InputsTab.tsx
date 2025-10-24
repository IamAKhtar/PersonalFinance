import React from "react";
import type { UserInputs } from "../types";

interface InputsTabProps {
  inputs: UserInputs;
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  handleSave: () => void;
  resetInputs: () => void;
  setActiveTab: (tab: string) => void;
}

export const InputsTab: React.FC<InputsTabProps> = ({
  inputs,
  setInputs,
  handleSave,
  resetInputs,
  setActiveTab,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Enter Your Financial Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label">Name</label>
          <input
            name="name"
            className="field"
            value={inputs.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="label">Age</label>
          <input
            name="age"
            type="number"
            className="field"
            value={inputs.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Monthly Income (Post-tax, ₹)</label>
          <input
            name="monthlyIncome"
            type="number"
            className="field"
            value={inputs.monthlyIncome}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">City Tier</label>
          <select
            name="cityTier"
            className="field"
            value={inputs.cityTier}
            onChange={handleChange}
          >
            <option>Tier 1 Metro</option>
            <option>Tier 2</option>
            <option>Tier 3</option>
          </select>
        </div>
        <div>
          <label className="label">Dependents</label>
          <input
            name="dependents"
            type="number"
            className="field"
            value={inputs.dependents}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Marital Status</label>
          <select
            name="maritalStatus"
            className="field"
            value={inputs.maritalStatus}
            onChange={handleChange}
          >
            <option>Single</option>
            <option>Married</option>
          </select>
        </div>
        <div>
          <label className="label">Risk Tolerance</label>
          <select
            name="riskTolerance"
            className="field"
            value={inputs.riskTolerance}
            onChange={handleChange}
          >
            <option>Conservative</option>
            <option>Moderate</option>
            <option>Aggressive</option>
          </select>
        </div>
        <div>
          <label className="label">Current Monthly Expenses (₹)</label>
          <input
            name="currentExpenses"
            type="number"
            className="field"
            value={inputs.currentExpenses}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Existing Emergency Fund (₹)</label>
          <input
            name="existingEmergencyFund"
            type="number"
            className="field"
            value={inputs.existingEmergencyFund}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Existing Term Insurance Cover (₹)</label>
          <input
            name="existingTermInsurance"
            type="number"
            className="field"
            value={inputs.existingTermInsurance}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Existing Health Insurance Cover (₹)</label>
          <input
            name="existingHealthInsurance"
            type="number"
            className="field"
            value={inputs.existingHealthInsurance}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Loan EMI (Monthly, ₹)</label>
          <input
            name="loanEMI"
            type="number"
            className="field"
            value={inputs.loanEMI}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Current Investments (₹)</label>
          <input
            name="currentInvestments"
            type="number"
            className="field"
            value={inputs.currentInvestments}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Retirement Age</label>
          <input
            name="retirementAge"
            type="number"
            className="field"
            value={inputs.retirementAge}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Current PF/EPF Balance (₹)</label>
          <input
            name="epfBalance"
            type="number"
            className="field"
            value={inputs.epfBalance}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-600">
        <p>
          💡 Want detailed breakdowns? After calculating, visit the{" "}
          <button
            className="text-brand-primary underline"
            onClick={() => setActiveTab("investment")}
          >
            Investment tab
          </button>{" "}
          to add your SIPs and assets.
        </p>
      </div>
      <div className="mt-8 flex gap-4">
        <button onClick={handleSave} className="btn-primary px-8 py-3">
          Calculate Financial Plan
        </button>
        <button onClick={resetInputs} className="btn-ghost px-8 py-3">
          Reset All
        </button>
      </div>
    </div>
  );
};
