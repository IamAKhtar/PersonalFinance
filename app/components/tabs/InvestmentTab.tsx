import React, { useState } from "react";
import type { Investment } from "../types";
import type { SuggestedSIP } from "../lib/productSelector";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

interface InvestmentTabProps {
  investment: Investment | null;
  sips: any[];
  setSips: React.Dispatch<React.SetStateAction<any[]>>;
  assets: any[];
  setAssets: React.Dispatch<React.SetStateAction<any[]>>;
  formatCurrency: (value: number) => string;
  suggestedSIPs: SuggestedSIP[];
  dataAsOf: string;
}

export const InvestmentTab: React.FC<InvestmentTabProps> = ({
  investment,
  sips,
  setSips,
  assets,
  setAssets,
  formatCurrency,
  suggestedSIPs,
  dataAsOf,
}) => {
  const [sipName, setSipName] = useState("");
  const [sipCategory, setSipCategory] = useState<"Equity" | "Debt" | "Gold">("Equity");
  const [sipMonthly, setSipMonthly] = useState<number>(0);
  const [sipStart, setSipStart] = useState("");

  const [assetBucket, setAssetBucket] = useState<"Equity" | "Debt" | "Gold" | "EPF/PPF" | "Cash/Liquid">("Equity");
  const [assetAmount, setAssetAmount] = useState<number>(0);

  const addSip = () => {
    if (!sipName || sipMonthly <= 0) return;
    const newSip = { id: uid(), name: sipName, category: sipCategory, monthly: sipMonthly, start: sipStart };
    const updated = [...sips, newSip];
    setSips(updated);
    localStorage.setItem("financeSips", JSON.stringify(updated));
    setSipName("");
    setSipMonthly(0);
    setSipStart("");
  };

  const removeSip = (id: string) => {
    const updated = sips.filter((s) => s.id !== id);
    setSips(updated);
    localStorage.setItem("financeSips", JSON.stringify(updated));
  };

  const addAsset = () => {
    if (assetAmount <= 0) return;
    const newAsset = { id: uid(), bucket: assetBucket, amount: assetAmount };
    const updated = [...assets, newAsset];
    setAssets(updated);
    localStorage.setItem("financeAssets", JSON.stringify(updated));
    setAssetAmount(0);
  };

  const removeAsset = (id: string) => {
    const updated = assets.filter((a) => a.id !== id);
    setAssets(updated);
    localStorage.setItem("financeAssets", JSON.stringify(updated));
  };

  if (!investment) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No investment data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Investment Allocation Strategy</h2>
      <p className="text-gray-600">Build wealth with a balanced portfolio</p>

      {/* Recommended Allocation */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Recommended Allocation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Equity</h4>
            <p className="text-3xl font-bold text-blue-700">{investment.finalEquityPct}%</p>
            <p className="text-sm text-gray-700 mt-1">₹{formatCurrency(investment.equityPortion)}/month</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Debt</h4>
            <p className="text-3xl font-bold text-green-700">{investment.finalDebtPct}%</p>
            <p className="text-sm text-gray-700 mt-1">₹{formatCurrency(investment.debtPortion)}/month</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p>
            <strong>Monthly SIP:</strong> ₹{formatCurrency(investment.monthlySIP)}
          </p>
          <p>
            <strong>Emergency Fund Contribution:</strong> ₹{formatCurrency(investment.emergencyFundContribution)}
          </p>
        </div>
      </div>

      {/* Your Current SIPs */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current SIPs</h3>
        {sips.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-right">Monthly</th>
                  <th className="p-2 text-left">Start</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {sips.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.category}</td>
                    <td className="p-2 text-right">₹{formatCurrency(r.monthly)}</td>
                    <td className="p-2">{r.start || "-"}</td>
                    <td className="p-2">
                      <button
                        onClick={() => removeSip(r.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No SIPs added yet</p>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold text-gray-900 mb-3">Add New SIP</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Fund name"
              className="field"
              value={sipName}
              onChange={(e) => setSipName(e.target.value)}
            />
            <select className="field" value={sipCategory} onChange={(e) => setSipCategory(e.target.value as any)}>
              <option>Equity</option>
              <option>Debt</option>
              <option>Gold</option>
            </select>
            <input
              type="number"
              placeholder="Monthly ₹"
              className="field"
              value={sipMonthly || ""}
              onChange={(e) => setSipMonthly(Number(e.target.value))}
            />
            <input
              type="month"
              className="field"
              value={sipStart}
              onChange={(e) => setSipStart(e.target.value)}
            />
            <button onClick={addSip} className="btn-primary">
              Add SIP
            </button>
          </div>
        </div>
      </div>

      {/* Your Existing Assets */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Existing Assets</h3>
        {assets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Bucket</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">{a.bucket}</td>
                    <td className="p-2 text-right">₹{formatCurrency(a.amount)}</td>
                    <td className="p-2">
                      <button
                        onClick={() => removeAsset(a.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No assets added yet</p>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold text-gray-900 mb-3">Add New Asset</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select className="field" value={assetBucket} onChange={(e) => setAssetBucket(e.target.value as any)}>
              <option>Equity</option>
              <option>Debt</option>
              <option>Gold</option>
              <option>EPF/PPF</option>
              <option>Cash/Liquid</option>
            </select>
            <input
              type="number"
              placeholder="Amount ₹"
              className="field"
              value={assetAmount || ""}
              onChange={(e) => setAssetAmount(Number(e.target.value))}
            />
            <button onClick={addAsset} className="btn-primary">
              Add Asset
            </button>
          </div>
        </div>
      </div>

      {/* Suggested SIP Basket */}
      {suggestedSIPs.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 Suggested SIP Basket
          </h3>
          <p className="text-xs text-gray-500 mb-4">Data as of {dataAsOf}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Fund Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-right">Allocation %</th>
                  <th className="p-2 text-right">Monthly ₹</th>
                  <th className="p-2 text-left">Reason</th>
                  <th className="p-2 text-right">Expense Ratio</th>
                </tr>
              </thead>
              <tbody>
                {suggestedSIPs.map((s, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{s.fund.name} ({s.fund.amc})</td>
                    <td className="p-2">{s.fund.category}</td>
                    <td className="p-2 text-right">{s.allocation_pct.toFixed(1)}%</td>
                    <td className="p-2 text-right font-semibold">₹{formatCurrency(s.monthly_amount)}</td>
                    <td className="p-2">{s.reason}</td>
                    <td className="p-2 text-right">{s.fund.expense_ratio}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-600">
            <ul className="list-disc list-inside space-y-1">
              <li>All schemes are Direct Growth plans</li>
              <li>Past returns are not indicative of future performance</li>
              <li>Check latest NAV, expense ratio, and exit loads on AMC websites</li>
            </ul>
          </div>
          <p className="text-xs text-gray-500 mt-3 italic">
            <strong>Disclaimer:</strong> Curated suggestions for educational purposes only. Not financial advice.
          </p>
        </div>
      )}
    </div>
  );
};
