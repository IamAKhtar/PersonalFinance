// app/components/tabs/types.ts

// Utility to join Tailwind classes
export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Unique ID generator
export function uid(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Format number as Indian rupees
export function formatCurrency(n: number): string {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

// Shared types for SIPs and Assets
export type SipItem = {
  id: string;
  name: string;
  category: 'Equity' | 'Debt' | 'Gold';
  monthly: number;
  start: string;
};

export type AssetItem = {
  id: string;
  bucket: 'Equity' | 'Debt' | 'Gold' | 'EPF/PPF' | 'Cash/Liquid';
  amount: number;
};
