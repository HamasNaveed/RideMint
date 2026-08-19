import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function Dashboard({ transactions }) {
    // Calculate stats
    const earnings = transactions.filter(t => t.Type === 'Earning').reduce((acc, curr) => acc + Number(curr['Amount (PKR)']), 0);
    const expenses = transactions.filter(t => t.Type === 'Expense').reduce((acc, curr) => acc + Number(curr['Amount (PKR)']), 0);
    const profit = earnings - expenses;

    // Calculate unique days for daily average
    const uniqueDays = new Set(transactions.map(t => t.Date)).size || 1;
    const dailyAvg = earnings / uniqueDays;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-muted text-sm uppercase tracking-wide">Total Earnings</h3>
                    <TrendingUp className="text-success" size={18} />
                </div>
                <h2 className="text-2xl font-bold tabular-nums text-success">
                    Rs {earnings.toLocaleString()}
                </h2>
            </div>

            <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-muted text-sm uppercase tracking-wide">Total Expenses</h3>
                    <TrendingDown className="text-danger" size={18} />
                </div>
                <h2 className="text-2xl font-bold tabular-nums text-danger">
                    Rs {expenses.toLocaleString()}
                </h2>
            </div>

            <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-muted text-sm uppercase tracking-wide">Net Profit</h3>
                    <DollarSign className={profit >= 0 ? "text-success" : "text-danger"} size={18} />
                </div>
                <h2 className={`text-2xl font-bold tabular-nums ${profit >= 0 ? "text-success" : "text-danger"}`}>
                    Rs {profit.toLocaleString()}
                </h2>
            </div>

            <div className="glass-panel animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-muted text-sm uppercase tracking-wide">Daily Avg</h3>
                    <Activity className="text-success" size={18} />
                </div>
                <h2 className="text-2xl font-bold tabular-nums text-success">
                    Rs {Math.round(dailyAvg).toLocaleString()}
                </h2>
            </div>
        </div>
    );
}
