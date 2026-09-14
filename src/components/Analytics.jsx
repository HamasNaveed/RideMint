import React, { useMemo, useState } from 'react';
import { PieChart } from 'lucide-react';

const SEGMENT_COLORS = ['#D97706', '#F43F5E', '#94A0B8', '#4B5565', '#10B981'];

function groupByDescription(rows) {
  const map = {};
  rows.forEach(t => {
    const amount = Number(t['Amount (PKR)']);
    map[t.Description] = (map[t.Description] || 0) + amount;
  });
  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export default function Analytics({ transactions }) {
  const [period, setPeriod] = useState('monthly');

  const dated = transactions.filter(t => t.rawDate);
  const latestMonth = useMemo(() => {
    if (dated.length === 0) return null;
    return dated.reduce((max, t) => (t.rawDate > max ? t.rawDate : max), dated[0].rawDate).substring(0, 7);
  }, [dated]);

  const scoped = useMemo(() => {
    if (!latestMonth) return [];
    if (period === 'monthly') {
      return dated.filter(t => t.rawDate.substring(0, 7) === latestMonth);
    }
    // quarterly: latest month plus the two preceding it
    const [y, m] = latestMonth.split('-').map(Number);
    const monthKeys = [0, 1, 2].map(offset => {
      let year = y, month = m - offset;
      while (month <= 0) { month += 12; year -= 1; }
      return `${year}-${String(month).padStart(2, '0')}`;
    });
    return dated.filter(t => monthKeys.includes(t.rawDate.substring(0, 7)));
  }, [dated, latestMonth, period]);

  const earningRows = scoped.filter(t => t.Type === 'Earning');
  const expenseRows = scoped.filter(t => t.Type === 'Expense');
  const earnings = earningRows.reduce((acc, t) => acc + Number(t['Amount (PKR)']), 0);
  const expenses = expenseRows.reduce((acc, t) => acc + Number(t['Amount (PKR)']), 0);
  const net = earnings - expenses;
  const profitMargin = earnings > 0 ? (net / earnings) * 100 : 0;

  const uniqueDays = new Set(scoped.map(t => t.Date)).size || 1;
  const avgEarningPerDay = earnings / uniqueDays;
  const costPerDay = expenses / uniqueDays;

  const expenseByCategory = groupByDescription(expenseRows);
  const incomeBySource = groupByDescription(earningRows);
  const topExpense = expenseByCategory[0];
  const topExpenseRatio = expenses > 0 && topExpense ? (topExpense.amount / expenses) * 100 : 0;

  if (!latestMonth) {
    return (
      <div className="p-space-lg rounded-xl bg-surface-container-low border border-hairline text-center py-12 text-on-surface-variant animate-fade-in">
        No transactions logged yet — analytics will appear once you record some entries.
      </div>
    );
  }

  const statCards = [
    { label: 'Profit Margin', value: `${profitMargin.toFixed(1)}%`, tone: net >= 0 ? 'secondary' : 'tertiary', note: `Rs ${net.toLocaleString()} net this period` },
    { label: topExpense ? `${topExpense.name} Outflow Ratio` : 'Top Expense Ratio', value: `${topExpenseRatio.toFixed(1)}%`, tone: 'tertiary', note: topExpense ? `Rs ${topExpense.amount.toLocaleString()} of total expense` : 'No expenses logged' },
    { label: 'Avg Earning / Day', value: `Rs ${Math.round(avgEarningPerDay).toLocaleString()}`, tone: 'primary', note: `Across ${uniqueDays} active ${uniqueDays === 1 ? 'day' : 'days'}` },
    { label: 'Cost / Day', value: `Rs ${Math.round(costPerDay).toLocaleString()}`, tone: 'on-surface', note: `Rs ${expenses.toLocaleString()} total expense` },
  ];

  const toneClass = { secondary: 'text-secondary', tertiary: 'text-tertiary', primary: 'text-primary', 'on-surface': 'text-on-surface' };

  // Donut geometry — precompute each segment's dash length/offset (no mutation during render)
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const donutSegments = incomeBySource.reduce((acc, src) => {
    const dash = (src.amount / earnings) * circumference;
    const cumulativeBefore = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
    acc.push({ ...src, dash, offset: circumference - cumulativeBefore, cumulative: cumulativeBefore + dash });
    return acc;
  }, []);

  return (
    <div className="flex flex-col gap-space-xl animate-fade-in">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-lg">
        <div>
          <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">Telemetry • Economics</span>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight mt-1">Financial Intelligence &amp; Breakdown</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {period === 'monthly' ? `Analysis for ${latestMonth}` : 'Trailing 3-month analysis'}
          </p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-surface-container-low self-start sm:self-auto">
          {['monthly', 'quarterly'].map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg font-label-sans text-label-sans capitalize transition-colors ${
                period === p ? 'bg-surface-container-high text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {statCards.map(card => (
          <div key={card.label} className="p-space-lg rounded-xl bg-surface-container-low border border-hairline">
            <span className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">{card.label}</span>
            <div className={`font-mono text-stat-lg tracking-tight mt-2 ${toneClass[card.tone]}`}>{card.value}</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{card.note}</p>
          </div>
        ))}
      </section>

      {/* Breakdown row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
        {/* Expense by category */}
        <div className="lg:col-span-7 p-space-lg rounded-xl bg-surface-container-low border border-hairline">
          <h2 className="font-headline-md text-headline-md text-on-surface">Expense by Category</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 mb-space-lg">
            {expenseByCategory.length === 0 ? 'No expenses logged this period' : `${expenseByCategory.length} categories tracked`}
          </p>

          {expenseByCategory.length > 0 && (
            <>
              <div className="flex h-2.5 rounded-full overflow-hidden mb-space-lg">
                {expenseByCategory.map((cat, idx) => (
                  <div
                    key={cat.name}
                    style={{ width: `${(cat.amount / expenses) * 100}%`, backgroundColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length] }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-space-sm">
                {expenseByCategory.map((cat, idx) => {
                  const pct = (cat.amount / expenses) * 100;
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between font-body-sm text-body-sm">
                        <span className="flex items-center gap-2 text-on-surface">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length] }} />
                          {cat.name}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="text-on-surface-variant">{pct.toFixed(1)}%</span>
                          <span className="font-mono text-on-surface">Rs {cat.amount.toLocaleString()}</span>
                        </span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-surface-container-high overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Income by source */}
        <div className="lg:col-span-5 p-space-lg rounded-xl bg-surface-container-low border border-hairline flex flex-col items-center">
          <div className="w-full flex items-center gap-2 mb-space-lg">
            <PieChart size={18} className="text-primary" />
            <h2 className="font-headline-md text-headline-md text-on-surface">Income by Source</h2>
          </div>

          {incomeBySource.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant py-8">No income logged this period</p>
          ) : (
            <>
              <svg viewBox="0 0 160 160" width="160" height="160" className="mb-space-lg">
                <circle cx="80" cy="80" r={radius} fill="none" stroke="#181C20" strokeWidth="20" />
                {donutSegments.map((src, idx) => (
                  <circle
                    key={src.name}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke={SEGMENT_COLORS[idx % SEGMENT_COLORS.length]}
                    strokeWidth="20"
                    strokeDasharray={`${src.dash} ${circumference - src.dash}`}
                    strokeDashoffset={src.offset}
                    transform="rotate(-90 80 80)"
                  />
                ))}
                <text x="80" y="76" textAnchor="middle" className="font-mono" fontSize="18" fill="#F1F3F5">
                  Rs {earnings.toLocaleString()}
                </text>
                <text x="80" y="94" textAnchor="middle" fontSize="10" fill="#94A0B8">
                  Total Income
                </text>
              </svg>

              <div className="w-full flex flex-col gap-2">
                {incomeBySource.map((src, idx) => (
                  <div key={src.name} className="flex items-center justify-between font-body-sm text-body-sm">
                    <span className="flex items-center gap-2 text-on-surface">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length] }} />
                      {src.name}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-on-surface-variant">{((src.amount / earnings) * 100).toFixed(1)}%</span>
                      <span className="font-mono text-on-surface">Rs {src.amount.toLocaleString()}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
