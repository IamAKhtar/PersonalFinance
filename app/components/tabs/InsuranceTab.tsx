import { useEffect, useState } from 'react';
import type { TermInsurance, HealthInsurance } from '../../../data/products.types';
import { calculateInsurance } from '../../lib/calculations';
import { selectTermInsurance, selectHealthInsurance } from '../../lib/productSelector';
import { cn, uid, formatCurrency, SipItem, AssetItem } from './types';

export default function InsuranceTab() {
  // inputs, calculated from context/hooks (omitted)
  const insurance = calculateInsurance(/* inputs */);
  const [termPolicies, setTermPolicies] = useState<TermInsurance[]>([]);
  const [healthPolicies, setHealthPolicies] = useState<HealthInsurance[]>([]);
  const [dataAsOf, setDataAsOf] = useState('');

  useEffect(() => {
    fetch('/data/term_insurance.json').then(r=>r.json()).then(d=>{ setTermPolicies(d.term_insurance); setDataAsOf(d.as_of); });
    fetch('/data/health_insurance.json').then(r=>r.json()).then(d=>setHealthPolicies(d.health_insurance));
  }, []);

  const suggestedTerm = insurance.term.gap>0
    ? selectTermInsurance(termPolicies, insurance.term.recommended)
    : [];
  const suggestedHealth = insurance.health.gap>0
    ? selectHealthInsurance(healthPolicies, insurance.health.recommended)
    : [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Insurance Planning</h2>
      {/* Term Life Section (existing UI) */}

      {/* Suggested Term Insurance */}
      {suggestedTerm.length>0 && (
        <div className="border-t pt-6">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">💡 Suggested Term Insurance</h3>
            <span className="text-xs text-gray-500">Data as of {dataAsOf}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedTerm.map((t,i)=>(
              <div key={i} className="border rounded-lg p-4">
                <div className="font-semibold">{t.policy.insurer}</div>
                <div className="text-sm text-gray-600 mb-2">{t.policy.product}</div>
                <div className="text-xs text-gray-600 mb-1">CSR: {t.policy.claim_settlement_ratio}%</div>
                <div className="text-xs text-gray-600 mb-3">Solvency: {t.policy.solvency_ratio}</div>
                <div className="text-sm mb-2">Premium: <span className="font-bold">{formatCurrency(t.policy.sample_premium_age_30_1cr)}/yr</span></div>
                <div className="text-xs text-gray-600">{t.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Section (existing UI) */}

      {/* Suggested Health Insurance */}
      {suggestedHealth.length>0 && (
        <div className="border-t pt-6">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">💡 Suggested Health Insurance</h3>
            <span className="text-xs text-gray-500">Data as of {dataAsOf}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedHealth.map((h,i)=>(
              <div key={i} className="border rounded-lg p-4">
                <div className="font-semibold">{h.policy.insurer}</div>
                <div className="text-sm text-gray-600 mb-2">{h.policy.plan}</div>
                <div className="text-xs text-gray-600 mb-1">Sum Insured: {h.policy.sum_insured_bands.join(', ')}</div>
                <div className="text-xs text-gray-600 mb-1">Restoration: {h.policy.restoration?'Yes':'No'}</div>
                <div className="text-sm mb-2">Premium: <span className="font-bold">{formatCurrency(h.policy.sample_premium_family_float)}/yr</span></div>
                <div className="text-xs text-gray-600">{h.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
