// app/components/tabs/InvestmentTab.tsx
'use client';

import { useEffect, useState } from 'react';
import type { MutualFund } from '../../../data/products.types';
import { calculateInvestment } from '../../lib/calculations';
import { selectSIPBasket } from '../../lib/productSelector';
import { cn, formatCurrency, uid, SipItem, AssetItem } from './types';

export default function InvestmentTab() {
  // Assuming inputs and efGap are passed down or accessed via context/hook
  const inputs = {}; // replace with actual inputs state
  const efGap = 0;    // replace with ef.gap
  
  // Calculate investment recommendations
  const investment = calculateInvestment(inputs as any, efGap);

  // Load mutual funds data
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [dataAsOf, setDataAsOf] = useState<string>('');

  useEffect(() => {
    fetch('/data/mutual_funds.json')
      .then((res) => res.json())
      .then((data) => {
        setMutualFunds(data.mutual_funds || []);
        setDataAsOf(data.as_of || '');
      });
  }, []);

  // Derive net available (example values used here)
  const netAvailable = 0; // replace with real net available calculation

  // Suggestions
  const suggestions = selectSIPBasket(
    mutualFunds,
    investment.finalEquityPct,
    investment.finalDebtPct,
    (inputs as any).riskTolerance || 'Moderate',
    netAvailable
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Investment Allocation Strategy</h2>

      {/* Allocation summary and monthly metrics omitted for brevity */}

      {/* Suggested SIP Basket */}
      {suggestions.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">💡 Suggested SIP Basket</h3>
            <span className="text-xs text-gray-500">Data as of {dataAsOf}</span>
          </div>
          <table className="min-w-full text-sm bg-white border rounded-lg overflow-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Fund</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-right">Alloc %</th>
                <th className="p-3 text-right">Monthly</th>
                <th className="p-3 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{s.fund.name}</td>
                  <td className="p-3">{s.fund.category}</td>
                  <td className="p-3 text-right">{s.allocation_pct.toFixed(1)}%</td>
                  <td className="p-3 text-right">{formatCurrency(s.monthly_amount)}</td>
                  <td className="p-3 text-sm text-gray-600">{s.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
