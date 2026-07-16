import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function TransactionHistory({ transactions }) {
    const [showAll, setShowAll] = useState(false);

    if (!transactions || transactions.length === 0) {
        return (
            <div className="glass-panel text-center py-8 text-muted animate-fade-in" style={{ animationDelay: '0.6s' }}>
                No transactions found. Add one above!
            </div>
        );
    }

    // Reverse to show latest first
    const sortedTransactions = [...transactions].reverse();
    const displayedTransactions = showAll ? sortedTransactions : sortedTransactions.slice(0, 6);

    return (
        <div className="glass-panel mt-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h3 className="mb-4 text-gradient">Transaction History</h3>
            <div className="table-container">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th className="text-right">Amount (PKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedTransactions.map((tx, idx) => {
                            const amount = Number(tx['Amount (PKR)']);
                            const isEarning = tx.Type === 'Earning';

                            return (
                                <tr key={idx}>
                                    <td className="whitespace-nowrap font-medium">{tx.Date}</td>
                                    <td>
                                        <span className={`badge ${isEarning ? 'badge-success' : 'badge-danger'}`}>
                                            {isEarning ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                            {tx.Type}
                                        </span>
                                    </td>
                                    <td className="text-muted">{tx.Description}</td>
                                    <td className={`text-right font-medium ${isEarning ? 'text-success' : 'text-danger'}`}>
                                        {isEarning ? '+' : '-'} Rs {amount.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {sortedTransactions.length > 6 && (
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={() => setShowAll(!showAll)}
                        className="btn btn-outline flex items-center gap-2"
                        style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem', marginTop: '1rem' }}
                    >
                        {showAll ? (
                            <>
                                <span>Show Less</span>
                                <ChevronUp size={16} />
                            </>
                        ) : (
                            <>
                                <span>View Older Transactions ({sortedTransactions.length - 6} more)</span>
                                <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
