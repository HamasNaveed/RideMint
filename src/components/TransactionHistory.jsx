import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export default function TransactionHistory({ transactions }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const earnings = transactions.filter(t => t.Type === 'Earning').reduce((acc, t) => acc + Number(t['Amount (PKR)']), 0);
  const expenses = transactions.filter(t => t.Type === 'Expense').reduce((acc, t) => acc + Number(t['Amount (PKR)']), 0);
  const net = earnings - expenses;

  const categories = useMemo(
    () => Array.from(new Set(transactions.map(t => t.Description))).sort(),
    [transactions]
  );

  const filtered = useMemo(() => {
    let rows = [...transactions];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(t => t.Description.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') {
      rows = rows.filter(t => t.Description === categoryFilter);
    }
    if (typeFilter !== 'all') {
      rows = rows.filter(t => t.Type === typeFilter);
    }

    rows.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.rawDate || 0) - new Date(b.rawDate || 0);
        case 'amount-desc':
          return Number(b['Amount (PKR)']) - Number(a['Amount (PKR)']);
        case 'amount-asc':
          return Number(a['Amount (PKR)']) - Number(b['Amount (PKR)']);
        case 'date-desc':
        default:
          return new Date(b.rawDate || 0) - new Date(a.rawDate || 0);
      }
    });

    return rows;
  }, [transactions, search, categoryFilter, typeFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const resetToFirstPage = () => setPage(1);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-space-lg rounded-xl bg-surface-container-low border border-hairline text-center py-8 text-on-surface-variant animate-fade-in">
        No transactions found. Log your first entry to get started.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-lg animate-fade-in">
      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-hairline">
          <span className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Gross Inflow</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-label-mono text-label-mono text-on-surface-variant">Rs</span>
            <span className="font-mono text-stat-lg text-secondary tracking-tight">{earnings.toLocaleString()}</span>
          </div>
        </div>
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-hairline">
          <span className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Operational Expense</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-label-mono text-label-mono text-on-surface-variant">Rs</span>
            <span className="font-mono text-stat-lg text-tertiary tracking-tight">{expenses.toLocaleString()}</span>
          </div>
        </div>
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-hairline">
          <span className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Net Cash Retained</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-label-mono text-label-mono text-on-surface-variant">Rs</span>
            <span className={`font-mono text-stat-lg tracking-tight ${net >= 0 ? 'text-secondary' : 'text-tertiary'}`}>{net.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-space-md rounded-xl bg-surface-container-low border border-hairline flex flex-col lg:flex-row lg:items-center gap-space-sm">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetToFirstPage(); }}
            placeholder="Search by description…"
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); resetToFirstPage(); }}
          className="form-select"
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Amount: High to Low</option>
          <option value="amount-asc">Amount: Low to High</option>
        </select>
        <div className="flex gap-1.5 p-1 rounded-lg bg-surface-container-high shrink-0">
          {[
            { key: 'all', label: 'All' },
            { key: 'Earning', label: 'Income' },
            { key: 'Expense', label: 'Expenses' },
          ].map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => { setTypeFilter(opt.key); resetToFirstPage(); }}
              className={`px-3 py-1 rounded-md font-label-sans text-label-sans transition-colors ${
                typeFilter === opt.key ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger table */}
      <div className="rounded-xl bg-surface-container-low border border-hairline overflow-hidden">
        <div className="flex items-center justify-between px-space-lg py-3 border-b border-hairline">
          <h3 className="font-headline-md text-headline-md text-on-surface">Transaction History</h3>
          <span className="font-label-mono text-label-mono text-on-surface-variant">
            Showing {pageRows.length} of {filtered.length} entries
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container">
                <th className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant px-space-lg py-3">Date</th>
                <th className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant px-space-lg py-3">Flow</th>
                <th className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant px-space-lg py-3">Category</th>
                <th className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant px-space-lg py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-space-lg py-8 text-center text-on-surface-variant font-body-sm text-body-sm">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((tx, idx) => {
                  const amount = Number(tx['Amount (PKR)']);
                  const isEarning = tx.Type === 'Earning';
                  return (
                    <tr key={tx.id || idx} className="border-b border-hairline last:border-b-0 hover:bg-surface-container-high/60 transition-colors">
                      <td className="px-space-lg py-3 font-body-sm text-body-sm text-on-surface whitespace-nowrap">{tx.Date}</td>
                      <td className="px-space-lg py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-mono text-label-mono ${
                            isEarning ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'
                          }`}
                        >
                          {isEarning ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {isEarning ? 'Inflow' : 'Outflow'}
                        </span>
                      </td>
                      <td className="px-space-lg py-3 font-body-sm text-body-sm text-on-surface-variant">{tx.Description}</td>
                      <td className={`px-space-lg py-3 text-right font-mono text-stat-md ${isEarning ? 'text-secondary' : 'text-tertiary'}`}>
                        {isEarning ? '+' : '-'} Rs {amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-space-lg py-3 border-t border-hairline">
          <div className="flex items-center gap-2">
            <span className="font-label-sans text-label-sans text-on-surface-variant">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); resetToFirstPage(); }}
              className="form-select"
              style={{ width: 'auto', minWidth: '70px', padding: '0.35rem 2rem 0.35rem 0.75rem' }}
            >
              {ROWS_PER_PAGE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-label-mono text-label-mono text-on-surface-variant">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
