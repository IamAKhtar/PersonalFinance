import { useState, useEffect } from 'react';
import type { MutualFund, FDRate } from '../../../data/products.types';
import { calculateEmergencyFund } from '../../lib/calculations';
import { selectParkingOptions } from '../../lib/productSelector';
import { cn, uid, formatCurrency, SipItem, AssetItem } from './types';


export default function EmergencyFundTab() {
  // inputs, calculated from context or hooks (omitted for brevity)
  const ef = calculateEmergencyFund(/* inputs */);
  const [efTargetType, setEfTargetType] = useState<'min'|'rec'|'cons'>('rec');
  const [efMonthsToReach, setEfMonthsToReach] = useState(9);
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [fdRates, setFdRates] = useState<FDRate[]>([]);
  const [dataAsOf, setDataAsOf] = useState('');

  useEffect(() => {
    fetch('/data/mutual_funds.json').then(r => r.json()).then(d=>setMutualFunds(d.mutual_funds));
    fetch('/data/fd_rates.json').then(r => r.json()).then(d=>setFdRates(d.fd_rates));
    fetch('/data/mutual_funds.json').then(r=>r.json()).then(d=>setDataAsOf(d.as_of));
  }, []);

  const selectedTarget =
    efTargetType==='cons'?ef.conservativeTarget
    :efTargetType==='min'?ef.minimumTarget
    :ef.recommendedTarget;
  const parking = selectParkingOptions(mutualFunds, fdRates, efMonthsToReach, selectedTarget);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Emergency Fund Planning</h2>

      {/* Controls */}
      <div className="flex justify-between mb-6">
        <div className="space-x-2">
          <button onClick={()=>setEfTargetType('min')} className={cn(efTargetType==='min'?'bg-brand-primary text-white':'bg-white text-gray-700')}>Min (6m)</button>
          <button onClick={()=>setEfTargetType('rec')} className={cn(efTargetType==='rec'?'bg-brand-primary text-white':'bg-white text-gray-700')}>Rec (9m)</button>
          <button onClick={()=>setEfTargetType('cons')} className={cn(efTargetType==='cons'?'bg-brand-primary text-white':'bg-white text-gray-700')}>Cons (12m)</button>
        </div>
        <div>
          <select value={efMonthsToReach} onChange={e=>setEfMonthsToReach(Number(e.target.value))} className="field">
            {[6,9,12,18,24].map(m=> <option key={m} value={m}>{m} months</option>)}
          </select>
        </div>
      </div>

      {/* Targets */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[['cons',ef.conservativeTarget],['rec',ef.recommendedTarget],['min',ef.minimumTarget]]
          .map(([key,val])=>(
          <div key={key} onClick={()=>setEfTargetType(key as any)}
               className={cn('p-4 border rounded-lg cursor-pointer', efTargetType===key?'border-brand-primary shadow':'border-gray-200')}>
            <div className="text-sm text-gray-600">{key==='rec'?'Recommended':key==='cons'?'Conservative':'Minimum'}</div>
            <div className="text-xl font-bold mt-2">{formatCurrency(val)}</div>
          </div>
        ))}
      </div>

      {/* Existing / Gap / Progress */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between"><span>Existing</span><span>{formatCurrency(ef.existing)}</span></div>
        <div className="flex justify-between"><span>Gap</span><span className="text-orange-600">{formatCurrency(Math.max(0,selectedTarget-ef.existing))}</span></div>
        <div>
          <div className="w-full bg-gray-200 h-2 rounded"><div className={cn('h-2 rounded',ef.completionPct>=75?'bg-green-500':'bg-orange-500')} style={{width:`${ef.completionPct}%`}}/></div>
          <div className="text-sm mt-1 text-right">{ef.completionPct.toFixed(1)}%</div>
        </div>
      </div>

      {/* Parking Strategy */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 text-xs text-yellow-800">
        <p><strong>Parking Strategy:</strong> 50% Savings Account + 50% Liquid/FD</p>
      </div>

      {/* Suggested Parking */}
      {parking.length>0 && (
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Suggested Parking</h3>
            <span className="text-xs text-gray-500">Data as of {dataAsOf}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {parking.map((p,i)=>(
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between mb-1">
                  <div className="font-medium">{p.type==='liquid_fund'?(p.option as MutualFund).name:(p.option as FDRate).institution}</div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 rounded">{p.allocation_pct}%</span>
                </div>
                <div className="text-lg font-bold mb-1">{formatCurrency(p.amount)}</div>
                <div className="text-xs text-gray-600">{p.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
