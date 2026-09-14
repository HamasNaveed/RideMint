import React, { useState } from 'react';
import { format } from 'date-fns';
import { PlusCircle, TrendingUp, Fuel, Car, Package, MoreHorizontal } from 'lucide-react';

const CATEGORY_ICONS = {
  'Ride Income': TrendingUp,
  Fuel: Fuel,
  'InDrive Cost': Car,
  'Package Cost': Package,
  Other: MoreHorizontal,
};

const categories = {
  Earning: ['Ride Income'],
  Expense: ['Fuel', 'InDrive Cost', 'Package Cost', 'Other'],
};

export default function TransactionForm({ onAdd, loading, transactions = [] }) {
  const [formData, setFormData] = useState({
    Date: format(new Date(), 'yyyy-MM-dd'),
    Type: 'Earning',
    Description: 'Ride Income',
    'Amount (PKR)': ''
  });

  const setType = (type) => {
    setFormData(prev => ({ ...prev, Type: type, Description: categories[type][0] }));
  };

  const setCategory = (category) => {
    setFormData(prev => ({ ...prev, Description: category }));
  };

  const handleAmountChange = (e) => {
    setFormData(prev => ({ ...prev, 'Amount (PKR)': e.target.value }));
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({ ...prev, Date: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData['Amount (PKR)']) return;

    const [year, month, day] = formData.Date.split('-');
    const dateObj = new Date(year, month - 1, day);

    onAdd({
      ...formData,
      Date: format(dateObj, 'dd-MMM'),
      rawDate: formData.Date,
      'Amount (PKR)': Number(formData['Amount (PKR)'])
    });

    setFormData(prev => ({ ...prev, 'Amount (PKR)': '' }));
  };

  const currentNet = transactions.reduce((acc, t) => {
    const amount = Number(t['Amount (PKR)']);
    return acc + (t.Type === 'Earning' ? amount : -amount);
  }, 0);

  const previewAmount = Number(formData['Amount (PKR)']) || 0;
  const previewDelta = formData.Type === 'Earning' ? previewAmount : -previewAmount;
  const projectedNet = currentNet + previewDelta;

  const recentActivity = [...transactions]
    .filter(t => t.rawDate)
    .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop animate-fade-in">
      {/* Left: entry form */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 p-space-lg rounded-xl bg-surface-container-low border border-hairline flex flex-col gap-space-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Record Entry</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Log a new earning or expense to your ledger</p>
        </div>

        {/* Income / Expense toggle */}
        <div className="inline-flex self-start p-1 rounded-xl bg-surface-container-high">
          {['Earning', 'Expense'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setType(type)}
              className={`px-4 py-2 rounded-lg font-headline-sm text-headline-sm transition-colors ${
                formData.Type === type
                  ? type === 'Earning' ? 'bg-secondary/20 text-secondary' : 'bg-tertiary/20 text-tertiary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {type === 'Earning' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div>
          <label className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Amount</label>
          <div className="mt-2 flex items-baseline gap-2 px-space-md py-3 rounded-lg bg-surface-container-high border border-hairline focus-within:border-primary transition-colors">
            <span className="font-label-mono text-label-mono text-on-surface-variant">Rs</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData['Amount (PKR)']}
              onChange={handleAmountChange}
              placeholder="0.00"
              required
              className="flex-1 bg-transparent outline-none font-mono text-stat-lg text-on-surface tracking-tight"
            />
          </div>
        </div>

        {/* Category tiles */}
        <div>
          <label className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Category</label>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
            {categories[formData.Type].map(cat => {
              const Icon = CATEGORY_ICONS[cat] || MoreHorizontal;
              const active = formData.Description === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center gap-1.5 px-space-sm py-space-md rounded-lg border transition-colors ${
                    active
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface-container-high border-hairline text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-label-sans text-label-sans">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Date</label>
          <input
            type="date"
            value={formData.Date}
            onChange={handleDateChange}
            required
            className="form-input mt-2"
            style={{ maxWidth: '220px' }}
          />
        </div>

        <button type="submit" className="btn btn-primary self-start" disabled={loading}>
          {loading ? 'Saving...' : <><PlusCircle size={18} /> {formData.Type === 'Earning' ? 'Record Income' : 'Record Expense'}</>}
        </button>
      </form>

      {/* Right: live impact preview + recent activity */}
      <div className="lg:col-span-4 flex flex-col gap-gutter">
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-hairline">
          <span className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Live Impact Preview</span>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Current Net</span>
            <span className="font-mono text-stat-md text-on-surface">Rs {currentNet.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant">This Entry</span>
            <span className={`font-mono text-stat-md ${previewDelta >= 0 ? 'text-secondary' : 'text-tertiary'}`}>
              {previewDelta >= 0 ? '+' : ''}Rs {previewDelta.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between">
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Projected Net</span>
            <span className={`font-mono text-stat-lg tracking-tight ${projectedNet >= 0 ? 'text-secondary' : 'text-tertiary'}`}>
              Rs {projectedNet.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-low border border-hairline">
          <span className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Recent Activity</span>
          <div className="mt-3 flex flex-col gap-2">
            {recentActivity.length === 0 ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">No entries logged yet.</p>
            ) : (
              recentActivity.map((tx, idx) => {
                const isEarning = tx.Type === 'Earning';
                return (
                  <div key={tx.id || idx} className="flex items-center justify-between font-body-sm text-body-sm">
                    <span className="text-on-surface-variant">{tx.Date} · {tx.Description}</span>
                    <span className={`font-mono ${isEarning ? 'text-secondary' : 'text-tertiary'}`}>
                      {isEarning ? '+' : '-'}Rs {Number(tx['Amount (PKR)']).toLocaleString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
