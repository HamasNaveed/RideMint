import React from 'react';

const TONE_CLASSES = {
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  primary: 'text-primary',
  neutral: 'text-on-surface',
};

export default function Dashboard({ transactions }) {
  const earningTx = transactions.filter(t => t.Type === 'Earning');
  const expenseTx = transactions.filter(t => t.Type === 'Expense');
  const earnings = earningTx.reduce((acc, t) => acc + Number(t['Amount (PKR)']), 0);
  const expenses = expenseTx.reduce((acc, t) => acc + Number(t['Amount (PKR)']), 0);
  const profit = earnings - expenses;
  const marginRatio = earnings > 0 ? (profit / earnings) * 100 : 0;

  const uniqueDays = new Set(transactions.map(t => t.Date)).size || 1;
  const dailyAvg = earnings / uniqueDays;
  const avgPerEarning = earningTx.length > 0 ? earnings / earningTx.length : 0;

  const expenseByCategory = expenseTx.reduce((acc, t) => {
    acc[t.Description] = (acc[t.Description] || 0) + Number(t['Amount (PKR)']);
    return acc;
  }, {});
  const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      label: 'Net Cashflow',
      value: profit,
      tone: profit >= 0 ? 'secondary' : 'tertiary',
      description: profit >= 0 ? 'Surplus retained after expenses' : 'Deficit — expenses exceed earnings',
      footerLabel: 'Margin Ratio',
      footerValue: `${marginRatio.toFixed(1)}%`,
    },
    {
      label: 'Gross Earnings',
      value: earnings,
      tone: 'neutral',
      description: `${earningTx.length} earning ${earningTx.length === 1 ? 'entry' : 'entries'} logged`,
      footerLabel: 'Avg / Entry',
      footerValue: `Rs ${Math.round(avgPerEarning).toLocaleString()}`,
    },
    {
      label: 'Total Expenses',
      value: expenses,
      tone: 'tertiary',
      description: topCategory ? `Top category: ${topCategory[0]}` : 'No expenses logged',
      footerLabel: 'Burn / Inflow',
      footerValue: earnings > 0 ? `${((expenses / earnings) * 100).toFixed(1)}%` : '—',
    },
    {
      label: 'Daily Avg Earnings',
      value: dailyAvg,
      tone: 'primary',
      description: `Across ${uniqueDays} active ${uniqueDays === 1 ? 'day' : 'days'}`,
      footerLabel: 'Active Days',
      footerValue: uniqueDays,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl animate-fade-in">
      {cards.map((card, idx) => (
        <div
          key={card.label}
          className="p-space-lg rounded-xl bg-surface-container-low border border-hairline flex flex-col justify-between overflow-hidden hover:border-outline transition-colors"
          style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
        >
          <div className="flex items-center justify-between gap-space-xs mb-3">
            <span className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">
              {card.label}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-label-mono text-label-mono text-on-surface-variant">Rs</span>
              <span className={`font-mono text-stat-lg tracking-tight ${TONE_CLASSES[card.tone]}`}>
                {Math.round(card.value).toLocaleString()}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{card.description}</p>
          </div>
          <div className="mt-4 -mx-space-lg -mb-space-lg px-space-lg py-2 flex items-center justify-between bg-surface-container/60">
            <span className="font-label-mono text-label-mono text-on-surface-variant">{card.footerLabel}</span>
            <span className="font-mono text-stat-md text-on-surface">{card.footerValue}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
