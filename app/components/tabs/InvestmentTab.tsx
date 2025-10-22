import { useEffect, useState } from 'react';
import type { MutualFund } from '../../../data/products.types';
import { calculateInvestment } from '../../lib/calculations';
import { selectSIPBasket } from '../../lib/productSelector';
import { cn, uid, formatCurrency, SipItem, AssetItem } from './types';

export default function InvestmentTab() {
  // inputs, ef, insurance from context/hooks
  const investment = calculateInvestment(/* inputs */, /* ef.gap */);
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [dataAsOf, setDataAsOf] = useState('');

  useEffect(() => {
    fetch('/data/mutual_funds.json').then(r=>r.json()).then(d=>{ setMutualFunds(d.mutual_funds); setDataAsOf(d.as_of); });
  }, []);

  // derive netAvailable from hooks or props
  const netAvailable = 25000; // example
  const targetEq = investment.finalEquityPct;
  const targetDebt = investment.finalDebtPct;

  const suggestions = selectSIPBasket(mutualFunds, targetEq, targetDebt, /* inputs.riskTolerance */'Moderate', netAvailable);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Investment Allocation Strategy</h2>
      {/* Existing allocation UI */}

      {/* Suggested SIP Basket */}
      {suggestions.length>0 && (
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
              {suggestions.map((s,i)=>(
                <tr key={i} className="border-t hover:bg-gray-50">
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
