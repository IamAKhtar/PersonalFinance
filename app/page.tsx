'use client';

import { useState } from 'react';
import InputsTab from './components/tabs/InputsTab';
import DashboardTab from './components/tabs/DashboardTab';
import BudgetTab from './components/tabs/BudgetTab';
import EmergencyFundTab from './components/tabs/EmergencyFundTab';
import InsuranceTab from './components/tabs/InsuranceTab';
import InvestmentTab from './components/tabs/InvestmentTab';
import RetirementTab from './components/tabs/RetirementTab';
import HealthScoreTab from './components/tabs/HealthScoreTab';

export default function Page() {
  const [activeTab, setActiveTab] = useState<
    'inputs' | 'dashboard' | 'budget' | 'emergency' | 'insurance' | 'investment' | 'retirement' | 'score'
  >('inputs');

  const tabs = [
    { id: 'inputs', label: '📝 Inputs', component: <InputsTab /> },
    { id: 'dashboard', label: '📊 Dashboard', component: <DashboardTab /> },
    { id: 'budget', label: '💵 Budget', component: <BudgetTab /> },
    { id: 'emergency', label: '🆘 Emergency Fund', component: <EmergencyFundTab /> },
    { id: 'insurance', label: '🛡️ Insurance', component: <InsuranceTab /> },
    { id: 'investment', label: '📈 Investments', component: <InvestmentTab /> },
    { id: 'retirement', label: '🏖️ Retirement', component: <RetirementTab /> },
    { id: 'score', label: '⭐ Health Score', component: <HealthScoreTab /> },
  ] as const;

  return (
    <div>
      {/* Header omitted for brevity, same as before */}

      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 flex space-x-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {tabs.find((t) => t.id === activeTab)?.component}
      </main>

      {/* Footer omitted */}
    </div>
  );
}
